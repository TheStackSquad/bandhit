
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

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
  //  console.log('No public ID provided for deletion');
    return null;
  }

  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary deletion error:', error);
          reject(new Error('Failed to delete from Cloudinary'));
        }
        resolve(result);
      });
    });
  } catch (error) {
    console.error('Error during deletion:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};