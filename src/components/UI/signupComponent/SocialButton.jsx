// src/components/UI/signupComponent/SocialButton.jsx
'use client';
import React from 'react';

const SocialButton = ({ provider, onClick }) => {
  // Set button styles based on provider
  const buttonStyles = {
    google: 'bg-red-500 hover:bg-red-600 text-white',
    facebook: 'bg-blue-600 hover:bg-blue-700 text-white',
    linkedin: 'bg-blue-800 hover:bg-blue-900 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg font-bold transition-all duration-300 ${buttonStyles[provider]}`}
    >
      Sign up with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
};

export default SocialButton;
