//src/components/signupComponents/SocialSignUpForm.jsx
'use client';

import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'; // Lightweight Next.js friendly icons

const SOCIAL_BUTTONS = [
  { name: 'Twitter', icon: Twitter, bgColor: 'bg-black' },
  { name: 'Facebook', icon: Facebook, bgColor: 'bg-blue-600' },
  { name: 'LinkedIn', icon: Linkedin, bgColor: 'bg-blue-700' },
  { name: 'Google', icon: Mail, bgColor: 'bg-red-600' },
];

const SocialSignUpForm = () => {
  return (
    <div className="w-[80%] max-w-lg mx-auto">
      {/* Responsive 1-column (xs) -> 2-column (md & lg) grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOCIAL_BUTTONS.map(({ name, icon: Icon, bgColor }) => (
          <button
            key={name}
            className={`
              ${bgColor} text-white font-medium 
              flex items-center justify-center gap-3 
              w-full py-3 rounded-lg shadow-lg
              transition-all duration-200 
              hover:opacity-90 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
            `}
          >
            <Icon className="w-5 h-5" /> {/* Icon size optimized */}
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialSignUpForm;
