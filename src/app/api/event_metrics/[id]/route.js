// src/app/api/event_metrics/route.jsx

import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    try {
        const { data, error } = await supabase
            .from('event_metrics')
            .select(`
                id,
                event_id,
                total_likes,
                total_payments,
                total_revenue,
                last_updated,
                events:event_id (
                    id,
                    event_name,
                    time,
                    date,
                    price,
                    venue,
                    capacity,
                    cover_image,
                    user_id
                )
            `)
            .eq('event_id', id)
            .limit(1)
            .single(); // or use .then(d => d[0])

        if (error) {
            console.error(`❌ Error fetching metrics for event ${id}:`, error);
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const percentageSold = data.events?.capacity > 0
            ? (data.total_payments / data.events.capacity * 100).toFixed(1)
            : 0;

        const formatted = {
            ...data,
            ...data.events,
            percentage_sold: parseFloat(percentageSold),
        };

        delete formatted.events;

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error(`🔥 Server error for event ${id}:`, error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
