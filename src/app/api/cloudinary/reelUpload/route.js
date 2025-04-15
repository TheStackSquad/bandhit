// src/app/api/cloudnary/reelUpload/route.js

import { NextResponse } from 'next/server'; // Import Next.js response utility
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK
import { createServerSupabaseClient } from '@/lib/supabaseClient'; // Import Supabase server-side client utility
import { redis } from '@/lib/redis/redisClient'; // Import Redis client utility

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
    try {
    //    console.log('📥 Upload API endpoint hit'); // Log when the endpoint is hit

        // 1. Extract access token from Authorization header
        const authHeader = req.headers.get('authorization'); // Get the Authorization header
        const token = authHeader?.split('Bearer ')[1]; // Extract the token after "Bearer "
      //  console.log('Received token:', token); // Log the received token

        if (!token) { // Check if the token is missing
            return NextResponse.json({ error: 'Missing access token' }, { status: 401 }); // Return 401 if no token
        }

        // 2. Validate access token with Supabase
        const supabase = createServerSupabaseClient(); // Create a Supabase server client
        const { data: { user: sessionUser }, error: authError } = await supabase.auth.getUser(token); // Validate the token and get user data
    //    console.log('Supabase auth result:', { sessionUser, authError }); // Log the authentication result

        if (authError || !sessionUser) { // Check if authentication failed
            return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 401 }); // Return 401 if authentication fails
        }

        const userId = sessionUser.id; // Extract the user ID from the session
    //    console.log('Authenticated userId:', userId); // Log the authenticated user ID

        // Token is valid, proceed with the post request for authenticated users.
        // Redis cache for user ban status to improve performance.
        const banCacheKey = `user:${userId}:banned`; // Define cache key for ban status
        const cachedBannedStatus = await redis.get(banCacheKey); // Get ban status from Redis

        if (cachedBannedStatus === 'true') { // If user is marked as banned in cache
            return NextResponse.json({ error: 'User is banned' }, { status: 403 }); // Return 403 Forbidden
        }

        if (cachedBannedStatus !== 'true') { // If ban status is not in cache or not 'true'
            const { data: authUser } = await supabase.auth.getUser(token); // Re-fetch user data to check ban status
            if (authUser?.user?.banned_until) { // Check if the user is banned in Supabase auth
                await redis.setex(banCacheKey, 300, 'true'); // Cache the ban status for 5 minutes
                return NextResponse.json({ error: 'User is banned' }, { status: 403 }); // Return 403 Forbidden
            }
            await redis.setex(banCacheKey, 300, 'false'); // Cache that the user is not banned for 5 minutes
        }

        // 3. Parse formData
        const formData = await req.formData(); // Parse the form data from the request
        const file = formData.get('file'); // Get the file from the form data
        const folder = formData.get('folder') || 'bandhitAsset/reels'; // Get the folder or use default
        const title = formData.get('title'); // Get the title
        const context = formData.get('context'); // Get the context

        if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 }); // Return 400 if no file

        // 4. Handle metadata
        let metadata = {}; // Initialize metadata object
        try {
            const metadataStr = formData.get('metadata'); // Get metadata string from form data
            if (metadataStr) metadata = JSON.parse(metadataStr); // Parse metadata string to JSON
        } catch (e) {
            console.error('❌ Error parsing metadata:', e); // Log error if metadata parsing fails
        }

        let caption = metadata.caption; // Get caption from metadata
        if (context?.startsWith('caption=')) { // If caption is in the context
            caption = context.substring(8); // Extract caption from context
            metadata.caption = caption; // Update metadata with caption
        }

    //    console.log('📦 Upload request:', { fileName: file.name, fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, userId, caption }); // Log upload request info

        // 5. Parse video optimization options if present
        let videoOptions = {}; // Initialize video options object
        try {
            const videoOptionsStr = formData.get('video_options'); // Get video options string from form data
            if (videoOptionsStr) {
                videoOptions = JSON.parse(videoOptionsStr); // Parse video options string to JSON
      //          console.log('🎬 Received video optimization options:', videoOptions); // Log video options
            }
        } catch (e) {
            console.error('❌ Error parsing video options:', e); // Log error if video options parsing fails
        }

        // 6. Prepare and upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
        const timestamp = Date.now(); // Get current timestamp for unique ID
        const sanitizedFileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize filename for public ID
        const uniqueId = `${userId.substring(0, 8)}_${timestamp}_${sanitizedFileName}`; // Create a unique public ID

        // Construct Cloudinary upload options with video optimization
        const uploadOptions = {
            resource_type: 'video',
            folder,
            public_id: uniqueId,
            overwrite: true,
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            context,
            eager_async: true,
            eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL
        };

        // Default eager transformations
        const defaultEager = [
            { streaming_profile: "hd", format: "m3u8" },
            { quality: "auto", format: "mp4" }
        ];

        // Apply custom video transformations if provided
        if (Object.keys(videoOptions).length > 0) {
            // Handle quality setting (overrides default)
            if (videoOptions.quality) {
                uploadOptions.quality = videoOptions.quality;
            }

            // Handle streaming profile
            const streamingProfile = videoOptions.streaming_profile || "hd";

            // Handle bitrate if specified
            const bitrateOption = videoOptions.bit_rate ? { bit_rate: videoOptions.bit_rate } : {};

            // Construct advanced eager transformations
            uploadOptions.eager = [
                // Streaming version with HLS (m3u8)
                {
                    streaming_profile: streamingProfile,
                    format: "m3u8",
                    ...bitrateOption
                },
                // MP4 version with quality setting
                {
                    quality: videoOptions.quality || "auto",
                    format: "mp4",
                    ...bitrateOption
                }
            ];

            // If additional custom transformations exist, add them
            if (videoOptions.transformation) {
                uploadOptions.eager.push({
                    transformation: videoOptions.transformation,
                    format: videoOptions.format || "mp4"
                });
            }

        //    console.log('🔧 Using custom video optimization:', uploadOptions.eager);
        } else {
            // Use default transformations if no custom options
            uploadOptions.eager = defaultEager;
        //    console.log('🔧 Using default video optimization');
        }

        const uploadResult = await new Promise((resolve, reject) => { // Create a promise for Cloudinary upload
            cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
                if (err) return reject(err); // Reject promise if Cloudinary upload fails
          //      console.log('✅ Cloudinary upload successful'); // Log successful Cloudinary upload
                resolve(result); // Resolve promise with upload result
            }).end(buffer); // End the upload stream with the file buffer
        });

        // 7. Insert into DB
        const { data: dbResult, error: dbError } = await supabase.from('reels').insert([{
            user_id: userId,
            title: title || file.name,
            video_url: uploadResult.secure_url,
            thumbnail_url: metadata.thumbnail || null,
            cloudinary_public_id: uploadResult.public_id,
            caption,
            metadata: {
                ...metadata,
                video_optimization: videoOptions // Save the video optimization settings in metadata
            }
        }]).select(); // Insert reel data into the database

        if (dbError) { // If database insertion fails
            console.error('❌ Database insert error:', dbError); // Log the database error
            try {
                await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: 'video' }); // Attempt to delete the uploaded file from Cloudinary
            } catch (cleanupError) {
                console.error('❌ Cloudinary cleanup failed:', cleanupError); // Log Cloudinary cleanup failure
            }
            return NextResponse.json({ error: 'Database insert failed', details: dbError.message }, { status: 500 }); // Return 500 for database error
        }

        // 8. Update Redis with last upload time
        await redis.set(`user:${userId}:last_upload`, new Date().toISOString()); // Store the last upload time in Redis

        return NextResponse.json({ // Return success response
            message: 'Reel uploaded successfully',
            data: {
                url: uploadResult.secure_url,
                reel_id: dbResult[0]?.id,
                public_id: uploadResult.public_id,
                caption,
                video_optimization: videoOptions,
                cached: cachedBannedStatus !== null
            }
        });

    } catch (error) {
        console.error('❌ Upload API error:', error); // Log any errors during the process
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 }); // Return 500 for generic upload error
    }
}