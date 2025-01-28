// src/components/UI/signupComponents/SocialSignUp.jsx
'use client';
import React from 'react';
import { FaGoogle, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { showSuccess, showError } from '@/utils/alertManager';
import { handleSocialSubmit } from '@/utils/socialSignUpUtils';

const SocialSignUp = () => {
  const socialProviders = [
    { 
      provider: 'google',  // Changed from 'gmail' to match OAuth provider name
      icon: FaGoogle, 
      color: 'text-red-500',
      hoverColor: 'hover:bg-red-50'
    },
    { 
      provider: 'facebook', 
      icon: FaFacebook, 
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      provider: 'linkedin', 
      icon: FaLinkedin, 
      color: 'text-blue-800',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      provider: 'twitter', 
      icon: FaTwitter, 
      color: 'text-sky-400',
      hoverColor: 'hover:bg-sky-50'
    }
  ];

  const handleSocialSignup = async (provider) => {
    try {
      const result = await handleSocialSubmit(provider);
      
      if (result.success) {
        showSuccess('Sign in successful!');
        // Additional success handling if needed
      } else {
        showError(result.error);
      }
    } catch (error) {
      console.error(error);
      showError('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center p-4">
      {socialProviders.map(({ provider, icon: Icon, color, hoverColor }) => (
        <span
          key={provider}
          onClick={() => handleSocialSignup(provider)}
          className={`
            w-12 h-12 md:w-14 md:h-14
            rounded-full
            flex items-center justify-center
            border border-gray-200
            transition-all duration-300
            ${hoverColor}
            hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
          aria-label={`Sign up with ${provider}`}
        >
          <Icon className={`text-xl md:text-2xl ${color}`} />
        </span>
      ))}
    </div>
  );
};

export default SocialSignUp;


