//src/app/api/hub/route.js

import { createServerSupabaseClient } from '@/lib/supabaseClient';

export async function GET() {
//  console.log("🚀 Starting hub API request");
  try {
  //  console.log("🔌 Creating Supabase client");
    const supabase = createServerSupabaseClient();

//    console.log("📡 Fetching all profiles from Supabase");
    const { data: profiles, error } = await supabase
      .from("all_profiles")
      .select("*");

    // Log raw data for debugging (optional - remove in production)
//    console.log("📊 Raw profiles data sample:", profiles?.[0] || "No profiles found");

    if (error) {
      console.error("❌ Profiles query error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    // Normalize profiles based on their type
    const normalizeProfile = (profile) => {
      // Base object with null fallbacks for all fields
      const base = {
        id: profile.id || null,
        user_id: profile.user_id || null,
        name: profile.name || (profile.profile_type === 'artist' ? 'Unnamed Artist' : 'Unnamed Business'),
        bio: profile.bio || 'No bio available',
        profile_type: profile.profile_type || null,
        cover_image_url: profile.cover_image_url || '/default-profile.jpg',
        art_forms: Array.isArray(profile.art_forms) ? profile.art_forms : [],
        phone: profile.phone || null,
        twitter: profile.twitter || null,
        instagram: profile.instagram || null,
        facebook: profile.facebook || null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString(),
        cover_image_public_id: profile.cover_image_public_id || null,
      };

      return base;
    };

    // Process the data with better error handling
    const normalizedProfiles = Array.isArray(profiles)
      ? profiles.map(profile => normalizeProfile(profile))
      : [];

   // console.log(`✅ Successfully processed ${normalizedProfiles.length} profiles`);

    // Log a normalized sample to verify transformation
    if (normalizedProfiles.length > 0) {
 //     console.log("🔄 Normalized sample:", normalizedProfiles[0]);
    }

    return new Response(JSON.stringify({ profiles: normalizedProfiles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60' // Add some caching
      }
    });
  } catch (error) {
    console.error("❌ Unhandled error in hub API:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error.message
    }), {
      status: 500,
    });
  }
}