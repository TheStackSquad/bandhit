//src/utils/dashboardUtils.jsx
"use client";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  createEvent,
  updateProfileImage,
} from "@/reduxStore/actions/authActions";
import { showError, showSuccess } from "@/utils/alertManager";

//image validation logic
const validateImage = (file) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "image/jpg",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxWidth = 2000; // Maximum image width
  const maxHeight = 2000; // Maximum image height

  // Check if the file type is valid
  if (!validTypes.includes(file.type)) {
    return "Please upload a valid image file (JPEG, PNG, or GIF)";
  }

  // Check if the file size is less than 5MB
  if (file.size > maxSize) {
    return "Image size should be less than 5MB";
  }

  // Check image dimensions (width and height)
  const img = new Image();
  img.onload = () => {
    if (img.width > maxWidth || img.height > maxHeight) {
      return `Image dimensions should not exceed ${maxWidth}x${maxHeight}`;
    }
  };
  img.src = URL.createObjectURL(file);

  return null;
};

// Custom hook for managing form submission state

export const useSubmitForm = (selectedImage, token, setCoverUploadStatus) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // Memoized submit function
  const submitForm = useCallback(
    async (values, formikHelpers) => {
      try {
        setIsSubmitting(true);
        // console.log("Submitting form...");

        // Validate selected image (if present)
        if (selectedImage) {
          // console.log("Validating selected image...");
          const error = validateImage(selectedImage);
          if (error) {
            console.error("Image validation failed:", error);
            showError("Image not validated!");
            setIsSubmitting(false);
            return;
          }
        }

        // Create FormData and append values
        const formData = new FormData();

        // console.log("Form values before appending:", values);
        Object.keys(values).forEach((key) => {
          // console.log(`Appending field: ${key} =`, values[key]);
          formData.append(key, values[key]);
        });

        // Append image if available
        if (selectedImage) {
          // console.log("Appending cover image...");
          formData.append("coverImage", selectedImage);
        }

        // Debug: Log FormData contents
        // console.log("Final FormData entries:", Array.from(formData.entries()));

        // Dispatch event creation action
        // console.log("Dispatching event creation...");
        await dispatch(createEvent(formData, token));

        // Handle successful submission
        formikHelpers.resetForm();
        setCoverUploadStatus("success");
        showSuccess("Event created successfully!");

        // console.log("Event creation successful!");
      } catch (error) {
        console.error("Event creation failed:", error?.message || error);
        setCoverUploadStatus("error");
        showError("Failed to create event");
      } finally {
        setIsSubmitting(false);
        // console.log("Submission process completed.");
      }
    },
    [selectedImage, token, dispatch, setCoverUploadStatus]
  );

  return { isSubmitting, submitForm };
};

// Define the upload function inside the hook
export const useProfileImage = (token, setProfileUploadStatus) => {
  // State for managing the profile image URL
  const [profileImage, setProfileImage] = useState(null);

  // Get dispatch function from Redux
  const dispatch = useDispatch();

  // Define the upload function inside the hook
  const uploadProfileImage = async (file) => {
    // Validate inputs
    if (!token) {
      console.error("No token provided to uploadProfileImage");
      return;
    }

    if (!file) {
      console.error("No file provided to uploadProfileImage");
      return;
    }

    // Validate the image
    const error = validateImage(file);
    if (error) {
      showError("Image not validated!");
      return;
    }

    // Update status to loading
    setProfileUploadStatus("loading");

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profileImage", file);

      // Dispatch the update action
      await dispatch(updateProfileImage(formData, token));

      // Create and set preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      // Update status to success
      setProfileUploadStatus("success");

      // Return cleanup function
      return () => URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Profile image update failed:", error);
      setProfileUploadStatus("error");
      showError("Failed to update profile image");
    }
  };

  // Return both the current profile image and the upload function
  return {
    profileImage,
    uploadProfileImage,
  };
};

// Image container class utilities
export const getCoverImageContainerClass = (status) => {
  const baseClasses =
    "w-full h-64 rounded-lg flex items-center justify-center text-gray-500 bg-gray-100";

  const statusClasses = {
    idle: "",
    loading: "animate-pulse",
    success: "border-green-500",
    error: "border-red-500",
  };

  return `${baseClasses} ${statusClasses[status] || ""}`;
};

export const getProfileImageContainerClass = (status) => {
  const baseClasses = "w-16 h-16 rounded-full overflow-hidden bg-gray-200";

  const statusClasses = {
    idle: "",
    loading: "animate-pulse",
    success: "border-2 border-green-500",
    error: "border-2 border-red-500",
  };

  return `${baseClasses} ${statusClasses[status] || ""}`;
};
