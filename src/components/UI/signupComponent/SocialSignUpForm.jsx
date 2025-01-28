//src/components/UI/signupComponent/SocialSignUpForm.jsx

'use client';

import React from 'react';

const SOCIAL_BUTTONS = [
  { name: 'Twitter', icon: '𝕏', bgColor: 'bg-black' },
  { name: 'Facebook', icon: 'f', bgColor: 'bg-blue-600' },
  { name: 'LinkedIn', icon: 'in', bgColor: 'bg-blue-700' },
  { name: 'Gmail', icon: 'G', bgColor: 'bg-red-700' },
];

const SocialSignUpForm = () => {
 
  return (
    <div className="w-full bg-blue max-w-md mx-auto">
      {/* Container for the buttons with responsive grid/flex layout */}
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
        {SOCIAL_BUTTONS.map(({ name, icon, bgColor }) => (
          <button
            key={name}
            // Base styles
            className={`
              ${bgColor}
              w-full
              rounded-full
              px-3
              py-3
              text-white 
              font-medium
              
              // Stack icon and text on all screen sizes
              flex
              flex-col
              items-center
              gap-2
              
              // Hover and focus states
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-blue-500
              
              // Shadow to make it appear elevated
              shadow-lg
              
              // Animation for click effect
              transition-all
              duration-200
              active:transform
              active:scale-95
              active:shadow-md
            `}
          >
            {/* Icon with larger size */}
            <span className="text-xl">{icon}</span>
            
            {/* Button text */}
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialSignUpForm;
