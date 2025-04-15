// src/utils/artistUtils.jsx
import { supabaseClient } from '@/lib/supabaseClient';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinaryUpload';
import { optimizeImage } from '@/utils/cloudinaryUtils/optimizeImage';

export const uploadArtistCoverImage = async (file, previousImageId = null) => {
  if (!file) throw new Error('No file selected.');

  // Validate file type
  if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');

  try {
    //    console.log('Initiating cover image upload...');

    // If there's an existing image, delete it first
    if (previousImageId) {
      try {
        //  console.log('Deleting previous image:', previousImageId);
        await deleteFromCloudinary(previousImageId);
        //    console.log('Previous image deleted successfully.');
      } catch (deleteError) {
        console.error('Failed to delete previous image:', deleteError);
      }
    }

    // Optimize and upload new image
    const optimizedImage = await optimizeImage(file);
    //  console.log('Image optimized, starting upload...');

    const uploadResult = await uploadToCloudinary(optimizedImage, 'bandhitAsset/artist', {
      user_id: 'artist_profile',
      upload_type: 'cover_image',
    });

    //   console.log('New image uploaded:', uploadResult);

    return {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};


// Original submitVendorProfile function
export const submitArtistProfile = async (formData) => {
  try {
    // Check if any updateable data exists (excluding auto-managed fields)
    const hasUpdateableData = Object.keys(formData).some(key =>
      key !== 'user_id' && key !== 'updated_at'
    );

    if (!hasUpdateableData) {
      console.warn('No updateable data provided in form submission');
      return {
        success: false,
        message: 'No profile data provided to update.',
      };
    }

    // Fetch existing profile to compare changes
    let existingProfile = null;
    try {
      const { data } = await supabaseClient
        .from('artist_profiles')
        .select('*')
        .eq('user_id', formData.user_id)
        .single();
      existingProfile = data;
    } catch {
      //    console.log('No existing profile found, creating new one');
    }

    // Identify changes if profile exists
    if (existingProfile) {
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (
          key !== 'user_id' && key !== 'updated_at' &&
          JSON.stringify(formData[key]) !== JSON.stringify(existingProfile[key])
        ) {
          changes[key] = {
            from: existingProfile[key],
            to: formData[key]
          };
        }
      });

      //  console.log('PROFILE CHANGES:', changes);
    }

    // Perform upsert (insert or update)
    const { data, error } = await supabaseClient
      .from('artist_profiles')
      .upsert(formData, { onConflict: 'user_id', merge: true })
      .select(); // Ensures the updated row is returned

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to save profile: ${error.message}`);
    }

    return {
      success: true,
      message: 'Profile saved successfully.',
      data
    };
  } catch (error) {
    console.error('Error submitting artist profile:', error);
    throw error;
  }
};
