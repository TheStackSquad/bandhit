//src/components/UI/signupComponent/SocialSignUpForm.jsx
// src/components/UI/signupComponent/SocialSignUpForm.jsx
'use client';

import React from 'react';
import { FaGoogle, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const SOCIAL_BUTTONS = [
  { name: 'Google', icon: <FaGoogle className="text-white text-xl" />, bgColor: 'bg-red-500' },
  { name: 'Facebook', icon: <FaFacebookF className="text-white text-xl" />, bgColor: 'bg-blue-600' },
  { name: 'Twitter', icon: <FaTwitter className="text-white text-xl" />, bgColor: 'bg-blue-400' },
  { name: 'Instagram', icon: <FaInstagram className="text-white text-xl" />, bgColor: 'bg-pink-500' },
];

const SocialSignUpForm = () => {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {SOCIAL_BUTTONS.map(({ name, icon, bgColor }) => (
        <button
          key={name}
          className={`w-full flex items-center justify-center p-4 rounded-lg ${bgColor} hover:opacity-90 transition-opacity`}
        >
          <span className="mr-3">{icon}</span>
          <span className="text-white font-medium">Sign up with {name}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialSignUpForm;
