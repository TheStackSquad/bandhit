// src/lib/dataDeletionService.js

import { createServerSupabaseClient } from '@/lib/supabaseClient';

export const deleteUserAccountAndData = async (userId) => {
//  console.log(`Initiating data deletion for user ID: ${userId}`);

  const supabase = createServerSupabaseClient();

  try {
    // 1. Retrieve User Information (Optional but Recommended)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error(`Error fetching user ${userId}:`, userError);
    } else if (user) {
  //    console.log(`Fetched user data for ID ${userId}:`, user);
    }

    // 2. Delete User Profile Data
    const { data: profiles, error: profilesError } = await supabase
      .from('all_profiles')
      .select('cover_image_public_id')
      .eq('user_id', userId);

    if (profilesError) {
      console.error(`Error fetching profiles for user ${userId}:`, profilesError);
    } else if (profiles && profiles.length > 0) {
//      console.log(`Found ${profiles.length} profile(s) for user ${userId}`);

      // Delete cover images from storage if they exist
      for (const profile of profiles) {
        if (profile.cover_image_public_id) {
          const { error: storageError } = await supabase.storage
            .from('profile_cover_images') // Replace with your actual bucket name
            .remove([profile.cover_image_public_id]);

          if (storageError) {
            console.error(`Error deleting cover image for user ${userId}:`, storageError);
          } else {
  //          console.log(`Successfully deleted cover image for user ${userId}`);
          }
        }
      }

      // Delete profile records from database
      const { error: deleteProfileError } = await supabase
        .from('all_profiles')
        .delete()
        .eq('user_id', userId);

      if (deleteProfileError) {
        console.error(`Error deleting profile for user ${userId}:`, deleteProfileError);
      } else {
//        console.log(`Successfully deleted profile data for user ${userId}`);
      }
    }

    // 3. Delete Other User Data (posts, comments, etc.)
    const { error: postsError } = await supabase
      .from('posts')
      .delete()
      .eq('user_id', userId);

    if (postsError) {
      console.error(`Error deleting posts for user ${userId}:`, postsError);
    } else {
//      console.log(`Successfully deleted posts for user ${userId}`);
    }

    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('user_id', userId);

    if (commentsError) {
      console.error(`Error deleting comments for user ${userId}:`, commentsError);
    } else {
//      console.log(`Successfully deleted comments for user ${userId}`);
    }

    // Add deletions for any other relevant tables...

    // 4. Delete User Account from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error(`Error deleting user account ${userId}:`, authError);
      throw new Error(`Failed to delete user account: ${authError.message}`);
    } else {
//      console.log(`Successfully deleted user account ${userId}`);
    }

//    console.log(`Data deletion process completed for user ID: ${userId}`);
    return { success: true, message: `Data for user ${userId} has been deleted.` };

  } catch (error) {
    console.error(`Error during data deletion process for user ${userId}:`, error);
    return { success: false, error: error.message || 'Failed to delete user data.' };
  }
};