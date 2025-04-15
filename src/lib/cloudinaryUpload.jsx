// src/lib/cloudinaryUpload.jsx

// This file contains functions to upload and delete assets from Cloudinary
// using the Cloudinary API.
export const uploadToCloudinary = async (file, folder, metadata = {}) => {
    try {
        // Create FormData to send to the server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        // Add metadata
        Object.entries(metadata).forEach(([key, value]) => {
            formData.append(`metadata[${key}]`, value);
        });

        // Call the server-side API endpoint
        const response = await fetch('/api/cloudinary/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Upload API error:', errorData);
            throw new Error(`Upload failed: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Function to delete an asset from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        console.warn('No public ID provided for deletion');
        return;
    }

    try {
        // Call the server-side API endpoint
        const response = await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_id: publicId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Delete API error:', errorData);
            throw new Error(`Deletion failed: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
//        console.log('Cloudinary deletion result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export const uploadThumbnailCloudinary = async (base64Thumbnail, 
  //eslint-disable-next-line no-unused-vars
  accessToken) => {
  try {
    if (!base64Thumbnail) {
      console.warn('No thumbnail data to upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', base64Thumbnail); // You might need to convert Base64 to Blob here
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'bandhitAsset/thumbnails'); // Optional thumbnail folder

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      headers: {
        // You might need an Authorization header here if your upload preset requires it
        // 'Authorization': `Bearer ${accessToken}`, // If your preset requires authenticated uploads
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error uploading thumbnail to Cloudinary:', errorData);
      throw new Error(`Thumbnail upload failed: ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
//    console.log('✅ Thumbnail uploaded to Cloudinary:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('❌ Error in uploadThumbnailCloudinary:', error);
    throw error;
  }
};

// Updated uploadReelCloudinary with video optimization
export const uploadReelCloudinary = async (
  file,
  metadata = {},
  title = null,
  progressCallback = null,
  accessToken = null,
  videoOptions = {} // New parameter for video optimization options
) => {
  try {
    if (!file) {
      console.error('❌ Missing required parameter: file');
      throw new Error('Missing required parameter: file');
    }

    // Extract caption from metadata
    const { caption = '', ...otherMetadata } = metadata;

// //    console.log('📤 Starting reel upload:', {
//       fileName: file.name,
//       fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//       fileType: file.type,
//       caption: caption,
//       hasAccessToken: !!accessToken
//     });

    // Create FormData to send to the server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'bandhitAsset/reels');
    formData.append('title', title || file.name);

    // Add caption to context parameter for Cloudinary
    if (caption) {
      const escapedCaption = caption.replace(/\|/g, ' ');
      formData.append('context', `caption=${escapedCaption}`);
   //   console.log('📝 Added caption to context:', escapedCaption);
    }

    // Calculate video duration if available for optimization decisions
    let videoDuration = null;
    if (file.type.startsWith('video/')) {
      try {
        videoDuration = await getVideoDuration(file);
    //    console.log('📊 Detected video duration:', videoDuration);
      } catch (e) {
        console.warn('⚠️ Could not determine video duration:', e);
      }
    }

    // Default video optimization settings if not specified
    const defaultVideoOptions = {
      quality: 'auto', // Let Cloudinary determine the best quality
      format: 'auto',  // Let Cloudinary choose the best format
      streaming_profile: 'hd', // HD streaming by default
      transformation: 'video' // Indicates this is a video transformation
    };

    // Merge defaults with provided options
    const finalVideoOptions = {
      ...defaultVideoOptions,
      ...videoOptions
    };

    // If we have duration, estimate file sizes and possibly adjust quality
    if (videoDuration) {
      const sizeEstimates = estimateCompressedSize(file, videoDuration);
      if (sizeEstimates) {
//        console.log('📊 Estimated compressed sizes:', sizeEstimates);
        
        // If the file is very large, we might want to adjust quality automatically
        const originalSizeMB = file.size / (1024 * 1024);
        if (originalSizeMB > 50 && !videoOptions.quality) {
          // For large files, use more aggressive compression if user didn't specify
          finalVideoOptions.quality = 'auto:good';
    //      console.log('🔧 Automatically adjusted quality setting for large file');
        }
      }
    }

    // Add video optimization options to the form data
    formData.append('video_options', JSON.stringify(finalVideoOptions));
//    console.log('🎬 Added video optimization options:', finalVideoOptions);

    // Add extra metadata for tracking and debugging (without access token)
    const enhancedMetadata = {
      ...otherMetadata,
      caption,
      uploadedAt: new Date().toISOString(),
      fileType: file.type,
      fileSize: file.size,
      videoDuration,
      videoOptimization: finalVideoOptions
    };

    // Convert metadata to JSON string
    formData.append('metadata', JSON.stringify(enhancedMetadata));

    // Add access token as a separate header or form field for backend auth
    if (accessToken) {
      formData.append('auth_token', accessToken);
    }

    // console.log('📋 Prepared upload payload:', {
    //   endpoint: '/api/cloudinary/reelUpload',
    //   title: title || file.name,
    //   folder: 'bandhitAsset/reels',
    //   metadataKeys: Object.keys(enhancedMetadata),
    //   hasCaption: !!caption,
    //   hasAuthToken: !!accessToken,
    //   hasVideoOptions: true
    // });

    // Rest of your function remains the same...
    const xhr = new XMLHttpRequest();

    const promise = new Promise((resolve, reject) => {
      xhr.open('POST', '/api/cloudinary/reelUpload');

      if (accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }

      xhr.upload.onprogress = (e) => {
        if (progressCallback && e.lengthComputable) {
          progressCallback(e);
        }
      };

      // Rest of XHR setup...
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || 'Upload failed'));
          } catch (e) {
            console.warn('⚠️ Could not determine onload status:', e);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.send(formData);
    });

    const data = await promise;

    // console.log('✅ Reel upload successful:', {
    //   responseUrl: data.data,
    //   message: data.message
    // });

    return data;
  } catch (error) {
    console.error('❌ Reel upload error:', error.message);
    throw error;
  }
};

// Helper function to get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Could not load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// Size estimation function you provided earlier
export const estimateCompressedSize = (file, duration) => {
  if (!duration) return null;

  // Basic size estimation based on file size per second
  const bytesPerSecond = file.size / duration;

  // Estimate different quality levels
  return {
    high: Math.round((bytesPerSecond * 0.7 * duration) / (1024 * 1024) * 10) / 10, // MB
    medium: Math.round((bytesPerSecond * 0.5 * duration) / (1024 * 1024) * 10) / 10, // MB
    low: Math.round((bytesPerSecond * 0.3 * duration) / (1024 * 1024) * 10) / 10 // MB
  };
};

// Function to delete a reel from Cloudinary
export const deleteReelCloudinary = async (publicId, reelId = null) => {
  if (!publicId) {
    console.warn('⚠️ No public ID provided for reel deletion');
    return;
  }

  try {
    // console.log('🗑️ Deleting reel:', {
    //   publicId,
    //   reelId: reelId || 'Not provided'
    // });

    // Prepare the payload
    const payload = {
      public_id: publicId,
      folder: 'bandhitAsset/reels' // Added folder path for consistency
    };

    // Add reelId if provided
    if (reelId) {
      payload.reel_id = reelId;
    }

    // console.log('📋 Prepared delete payload:', {
    //   endpoint: '/api/cloudinary/delete',
    //   payload
    // });

    // Call the server-side API endpoint (using the existing path)
    const response = await fetch('/api/cloudinary/reelDelete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

//    console.log('📡 Delete API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Reel deletion API error:', errorData);
      throw new Error(`Reel deletion failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
  //  console.log('✅ Reel deletion successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting reel from Cloudinary:', error.message);
    throw error;
  }
};