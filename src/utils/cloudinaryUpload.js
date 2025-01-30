
// src/utils/cloudinaryUpload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: 'auto',
      };

      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Failed to upload to Cloudinary'));
        } else {
          // Resolve with both secure_url and public_id
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id
          });
        }
      }).end(file);
    });
  } catch (error) {
    console.error('Error during upload:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

export const deleteFromCloudinary = async (imageData) => {
  if (!imageData || !imageData.publicId) {
    console.error('Invalid image object or missing publicId for deletion');
    return null;
  }

  try {
    // console.log(`Attempting to delete from Cloudinary: ${imageData.publicId}`);

    const result = await cloudinary.uploader.destroy(imageData.publicId);

    if (result.result !== 'ok') {
      console.error('Cloudinary deletion failed:', result);
      throw new Error('Failed to delete from Cloudinary');
    }

    // console.log('Cloudinary deletion successful:', result);
    return result;
  } catch (error) {
    console.error('Error during deletion:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};

// export const deleteEventImageFromCloudinary = async (imageUrl) => {
//   if (!imageUrl || !imageUrl.publicId) {
//     console.error('Invalid imageUrl object or missing publicId for deletion');
//     return null;
//   }

//   try {
//     console.log(`Attempting to delete event image from Cloudinary: ${imageUrl.publicId}`);

//     const result = await cloudinary.uploader.destroy(imageUrl.publicId);

//     if (result.result !== 'ok') {
//       console.error('Cloudinary event image deletion failed:', result);
//       throw new Error('Failed to delete event image from Cloudinary');
//     }

//     console.log('Cloudinary event image deletion successful:', result);
//     return result;
//   } catch (error) {
//     console.error('Error during event image deletion:', error);
//     throw new Error('Failed to delete event image from Cloudinary');
//   }
// };
