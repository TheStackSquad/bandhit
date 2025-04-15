// src/app/api/cloudinary/get_reel/route.js
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic'; // Ensure fresh data

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const supabase = createServerSupabaseClient();

        // Only select the fields we actually need
        const selectFields = `
            id,
            video_url,
            thumbnail_url,
            caption,
            created_at,
            metadata->duration,
            metadata->aspectRatio
        `;

        // Get total count (optimized)
        const { count } = await supabase
            .from('reels')
            .select('*', { count: 'exact', head: true });

        // Get paginated data with only needed fields
        const { data, error } = await supabase
            .from('reels')
            .select(selectFields)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: data || [],
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        }, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
            }
        });

    } catch (error) {
        console.error("Error fetching reels:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}