// src/app/api/category/check-email/route.js
import { createServerSupabaseClient } from '@/lib/supabaseClient';

export async function POST(request) {
    const supabase = createServerSupabaseClient();
    const { email } = await request.json();

    try {
        const { data, error } = await supabase
            .from('newsletter')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ exists: !!data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error checking email:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}