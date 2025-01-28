//src/utils/dashboardUtils.jsx
'use client';

// Update the profile image container class based on status
export const getProfileImageContainerClass = (status) => {
  const baseClasses = "w-16 h-16 rounded-full overflow-hidden border-2";
  switch (status) {
    case 'loading':
      return `${baseClasses} border-yellow-500 animate-pulse`;
    case 'success':
      return `${baseClasses} border-green-500`;
    case 'error':
      return `${baseClasses} border-red-500`;
    default:
      return `${baseClasses} border-blue-500`;
  }
};

// Update the cover image container similarly
export const getCoverImageContainerClass = (status) => {
  const baseClasses = "w-full h-64 rounded-lg";
  switch (status) {
    case 'loading':
      return `${baseClasses} border-2 border-yellow-500 animate-pulse`;
    case 'success':
      return `${baseClasses} border-2 border-green-500`;
    case 'error':
      return `${baseClasses} border-2 border-red-500`;
    default:
      return baseClasses;
  }
};

// src/utils/dashboardUtils.jsx

export const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/jpg'];
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
  