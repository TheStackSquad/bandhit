//src/utils/vendorUtils.jsx
import { supabaseClient } from '@/lib/supabaseClient';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinaryUpload';
import { optimizeImage } from '@/utils/cloudinaryUtils/optimizeImage';

export const uploadVendorCoverImage = async (file, previousImageId = null) => {
  if (!file) {
    throw new Error('No file selected.');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  try {
    //    console.log('Starting cover image upload process');

    // Delete previous image if it exists
    if (previousImageId) {
      try {
        //      console.log('Attempting to delete previous image:', previousImageId);
        await deleteFromCloudinary(previousImageId);
        //    console.log('Previous image deleted successfully');
      } catch (deleteError) {
        console.error('Failed to delete previous image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }


    // Optimize the image
    const optimizedImage = await optimizeImage(file);
    //    console.log('Image optimized successfully');

    // Upload using the updated utility function
    const uploadResult = await uploadToCloudinary(optimizedImage, 'bandhitAsset/vendor', {
      user_id: 'vendor_profile', // Optional metadata
      upload_type: 'cover_image'
    });

    //    console.log('New image uploaded successfully:', uploadResult);

    // Return both secure_url and public_id
    return {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Image upload process failed:', error);
    throw error;
  }
};


// Original submitVendorProfile function
export const submitVendorProfile = async (formData) => {
  try {
    // Pre-submission logging
    // console.log('PRE-SUBMISSION DATA:', {
    //   rawFormData: formData,
    //   hasImageData: !!formData.cover_image_url,
    //   fieldCount: Object.keys(formData).length,
    //   timestamp: new Date().toISOString()
    // });

    // Check if we have at least one non-mandatory field to update
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

    // Fetch current profile to log changes
    let existingProfile = null;
    try {
      const { data } = await supabaseClient
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', formData.user_id)
        .maybeSingle();
      existingProfile = data;
    } catch (
    //eslint-disable-next-line no-unused-vars
    fetchError) {
      //   console.log('No existing profile found, creating new one');
    }

    // Log what's changing
    if (existingProfile) {
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (key !== 'user_id' && key !== 'updated_at' &&
          JSON.stringify(formData[key]) !== JSON.stringify(existingProfile[key])) {
          changes[key] = {
            from: existingProfile[key],
            to: formData[key]
          };
        }
      });
      //  console.log('PROFILE CHANGES:', changes);
    }

    // Perform the upsert operation
    const { data, error } = await supabaseClient
      .from('vendor_profiles')
      .upsert(formData, { onConflict: 'user_id', merge: true });

    // Post-submission logging
    // console.log('POST-SUBMISSION RESPONSE:', {
    //   success: !error,
    //   data,
    //   error,
    //   timestamp: new Date().toISOString()
    // });

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to save profile to Supabase: ${error.message}`);
    }

    return {
      success: true,
      message: 'Profile saved successfully.',
      data
    };
  } catch (error) {
    console.error('Error submitting vendor profile:', error);
    throw error;
  }
};