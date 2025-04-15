//src/utils/dashboardUtils.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "@/reduxStore/actions/authActions";
import { toast } from "@/lib/alertManager";
import { optimizeImage } from "@/utils/cloudinaryUtils/optimizeImage";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useCreateEventMutation, useUpdateEventMutation } from '@/reduxStore/api/eventsApi';


// default image path
const defaultImagePath = "https://res.cloudinary.com/dobwoeo5p/image/upload/v1741792297/thumbnail_drgnimages_thapew.jpg";

/**
 * Hook for handling event image uploads
 */
export const useEventImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEventImageUpload = async (file, setFieldValue) => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setLoading(true);
    setSelectedImage(file);

    try {
      // Optimize the image
      const optimizedImage = await optimizeImage(file);

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(optimizedImage, "bandhitAsset/events");

      // Update form values
      setFieldValue("coverImage", uploadResult.secure_url);
      setFieldValue("coverImagePublicId", uploadResult.public_id);

      toast.success("Event image uploaded successfully!");
      return uploadResult;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        error.message || "Image upload failed. Please try again."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    handleEventImageUpload,
    loading,
  };
};

/**
 * Hook for handling profile image uploads
 */
export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleProfileImageUpload = async (file, userId) => {
    if (!file) return;
    setLoading(true);

    try {
      const optimizedImage = await optimizeImage(file);
      const uploadResult = await uploadToCloudinary(optimizedImage, "users", {
        user_id: userId,
      });

      setProfileImage(uploadResult.secure_url);

      // Update Redux store with new profile image
      dispatch(
        signIn({
          _id: userId,
          profileImage: {
            url: uploadResult.secure_url,
          },
        })
      );

      toast.success("Profile image updated successfully!");
      return uploadResult;
    } catch (error) {
      console.error("Profile image upload failed:", error);
      toast.error("Failed to update profile image.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { profileImage, handleProfileImageUpload, loading };
};

/**
 * Hook for handling form submissions
 */
export const useSubmitForm = () => {
  const [loading, setLoading] = useState(false);
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation(); // New mutation for updates

  const submitForm = async (
    values,
    userId,
    { resetForm },
    mode = 'create',
    eventId = null
  ) => {
    setLoading(true);
    try {
      // Validation for required fields
      const requiredFields = ['eventName', 'date', 'time'];
      const missingFields = requiredFields.filter(field => !values[field]);

      if (missingFields.length > 0) {
        toast.error(`Please fill out: ${missingFields.join(', ')}`);
        setLoading(false);
        return null;
      }

      // Cover image validation only for create mode
      if (mode === 'create' && !values.coverImage) {
        toast.error("Please upload a cover image before submitting.");
        setLoading(false);
        return;
      }

      const eventData = {
        event_name: values.eventName,
        time: values.time,
        date: values.date,
        price: values.price,
        venue: values.venue,
        capacity: values.capacity,
        cover_image: values.coverImage,
        cover_image_public_id: values.coverImagePublicId,
        user_id: userId,
      };

      // Determine mutation based on mode
      const mutationFn = mode === 'create' ? createEvent : updateEvent;
      const mutationPayload = mode === 'update'
        ? { id: eventId, ...eventData }
        : eventData;

      const { data, error } = await mutationFn(mutationPayload);

      if (error) {
        throw new Error(error.message || `Failed to ${mode} event.`);
      }

      toast.success(`Event ${mode}d successfully!`);
      resetForm();
      return data;
    } catch (error) {
      toast.error(error.message || `Failed to ${mode} event. Try again.`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading };
};


/**
 * Helper function to get profile image URL with fallback
 */
export const getProfileImageUrl = (user) => {
  if (!user) return defaultImagePath;

  // If user has a profileImage object with url
  if (user.profileImage && user.profileImage.url) {
    return user.profileImage.url;
  }

  // If profileImage is a string (URL)
  if (typeof user.profileImage === "string") {
    return user.profileImage;
  }

  return defaultImagePath;
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use useEventImage hook instead
 */
export const handleFormImageUpload = async (file, setSelectedImage, setFieldValue) => {
  if (!file) return;

  setSelectedImage(file);

  try {
    const optimizedImage = await optimizeImage(file);
    const uploadResult = await uploadToCloudinary(optimizedImage, "events");

    // Store the uploaded image URL and public_id in the form values
    setFieldValue("coverImage", uploadResult.secure_url);
    setFieldValue("coverImagePublicId", uploadResult.public_id);
  } catch (error) {
    console.error("Image upload failed:", error);
    toast.error("Image upload failed. Try again.");
  }
};

// Clears localStorage and refreshes page

export const clearLocalStorage = () => {
  try {
    const keysToRemove = [
      "sb-utriuuqjqfbwufazpetl-auth-token",
      "userData",
      "userProfile", // Added this key from the other implementation
      "persist:auth",
      "persist:events"
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    // Verify if localStorage is cleared
    return keysToRemove.every((key) => localStorage.getItem(key) === null);
  } catch (error) {
    console.error("Error clearing local storage:", error);
    return false;
  }
};

// Handles modal close logic
export const handleModalClose = (router, modalState) => {
  if (modalState.type === "success") {
    router.push("/dashboard");
  }
};

