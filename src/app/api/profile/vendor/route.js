//src / app / api / profile / vendor / route.js

import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const profileData = await request.json();

        // Validate required fields
        if (!profileData.user_id) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Ensure proper data format
        const payload = {
            ...profileData,
            cover_image_url: profileData.cover_image_url || null,
            cover_image_public_id: profileData.cover_image_public_id || null,
        };

        // Server-side Supabase client
        const supabase = createServerSupabaseClient();

        // Upsert vendor profile data
        const { data, error } = await supabase
            .from('vendor_profiles')
            // .upsert(payload, { onConflict: 'user_id', merge: true })
            .upsert(payload, { onConflict: 'user_id', merge: true })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, data: data[0] },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}