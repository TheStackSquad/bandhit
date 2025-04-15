// src/app/api/cloudinary/delete/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createServerSupabaseClient } from '@/lib/supabaseClient';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// This function handles the deletion of a video from Cloudinary and optionally from the database

export async function POST(req) {
    try {
    //    console.log('📥 Delete API endpoint hit');

        // Parse request body
        const body = await req.json();
        const { public_id, reel_id } = body;

        // console.log('📦 Received delete request:', {
        //     public_id,
        //     reel_id: reel_id || 'Not provided',
        //     folder: folder || 'Not provided'
        // });

        // Validate required fields
        if (!public_id) {
            console.error('❌ Missing public_id in delete request');
            return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
        }

        // Auth check - verify user owns this reel before deleting
        if (reel_id) {
            const supabase = createServerSupabaseClient();

            // First get the user from the session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error('❌ Unauthorized: No valid session');
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Then verify the user owns this reel
            const { data: reelData, error: reelError } = await supabase
                .from('reels')
                .select('user_id')
                .eq('id', reel_id)
                .single();

            if (reelError || !reelData) {
                console.error('❌ Reel not found:', reelError || 'No data returned');
                return NextResponse.json({ error: 'Reel not found' }, { status: 404 });
            }

            if (reelData.user_id !== session.user.id) {
                console.error('❌ Unauthorized: User does not own this reel');
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        // Delete from Cloudinary
       // console.log('🔄 Deleting from Cloudinary:', public_id);

        const cloudinaryResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(
                public_id,
                { resource_type: 'video' },
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary deletion error:', error);
                        return reject(error);
                    }
     //               console.log('✅ Cloudinary deletion result:', result);
                    resolve(result);
                }
            );
        });

        // If reel_id is provided, delete from database as well
        let databaseResult = null;
        if (reel_id) {
   //         console.log('💾 Deleting from database:', reel_id);

            const supabase = createServerSupabaseClient();
            const { data, error } = await supabase
                .from('reels')
                .delete()
                .eq('id', reel_id)
                .select();

            if (error) {
                console.error('❌ Database delete error:', error);
                // Continue even if DB delete fails, since Cloudinary deletion succeeded
            } else {
 //               console.log('✅ Database delete successful');
                databaseResult = data;
            }
        }

        // Return success response
        return NextResponse.json({
            message: 'Deletion successful',
            cloudinary: cloudinaryResult,
            database: databaseResult
        });
    } catch (error) {
        console.error('❌ Delete API error:', error);
        return NextResponse.json({
            error: 'Deletion failed',
            details: error.message
        }, { status: 500 });
    }
}