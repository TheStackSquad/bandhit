// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Detailed environment variable logging
// console.log('🔍 Supabase Environment Variables:', {
//     NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'Present' : 'MISSING',
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Present' : 'MISSING',
//     SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? 'Present' : 'MISSING',
//     // Add raw length for debugging
//     SERVICE_ROLE_KEY_LENGTH: supabaseServiceRoleKey?.length || 0
// });

// Ensure the service role key is actually being read
if (!supabaseServiceRoleKey) {
    console.error('❌ SERVICE ROLE KEY IS NOT BEING READ CORRECTLY');
    throw new Error(
        "Missing Supabase Service Role Key. Check your .env.local file configuration."
    );
}

// Client-side Supabase instance (for browser interactions)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    },
    realtime: true
});

// Server-side Supabase instance (for API routes, server-side rendering)
export const createServerSupabaseClient = (context) => {
  //  console.log("🔐 Creating Server-Side Supabase Client");
    try {
        const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            },
            ...(context && { context })
        });

    //    console.log("✅ Server-Side Supabase Client Created Successfully");
        return client;
    } catch (error) {
        console.error("❌ Failed to create server-side Supabase client", error);
        throw error;
    }
};