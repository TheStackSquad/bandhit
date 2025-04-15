// src/app/api/cloudinary/upload/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
//import { createServerSupabaseClient } from '@/lib/supabaseClient';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST handler to upload a file to Cloudinary

export async function POST(request) {
    try {
        // Parse the FormData
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'bandhitAsset/vendor';

        // Get any metadata from the form
        const metadataEntries = Array.from(formData.entries())
            .filter(([key]) => key.startsWith('metadata['))
            .map(([key, value]) => [key.replace('metadata[', '').replace(']', ''), value]);

        const metadata = Object.fromEntries(metadataEntries);

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert the file to buffer for Cloudinary
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                dataURI,
                {
                    folder,
                    resource_type: 'auto',
                    context: metadata
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        return NextResponse.json({
            success: true,
            secure_url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Server error during upload:', error);
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        );
    }
}


