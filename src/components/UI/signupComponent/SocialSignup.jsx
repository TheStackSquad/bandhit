//src/components/UI/signupComponents/socialSignup.jsx

// src/components/UI/signupComponents/SocialSignUp.jsx
'use client';
import React from 'react';
import { FaGoogle, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { showSuccess, showError } from '@/utils/alertManager';

const SocialSignUp = () => {
  const handleSocialSignup = async (provider) => {
    try {
      // Implement social signup logic
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'User Name', // You'll get this from social login
          email: 'user@example.com', // From social login
          socialProvider: provider,
          socialId: 'unique-social-id' // From social login
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Signup successful');
        // Handle redirect or further actions
      } else {
        showError(data.message);
      }
    } catch (error) {
      console.error('social sign up error', error);
      showError('Signup failed');
    }
  };

  const socialProviders = [
    { 
      provider: 'gmail', 
      icon: FaGoogle, 
      color: 'text-red-500' 
    },
    { 
      provider: 'facebook', 
      icon: FaFacebook, 
      color: 'text-blue-600' 
    },
    { 
      provider: 'linkedin', 
      icon: FaLinkedin, 
      color: 'text-blue-800' 
    },
    { 
      provider: 'twitter', 
      icon: FaTwitter, 
      color: 'text-sky-400' 
    }
  ];

  return (
    <div className="flex justify-center space-x-4 mb-6">
      {socialProviders.map(({ provider, icon: Icon, color }) => (
        <button 
          key={provider}
          type="button" 
          onClick={() => handleSocialSignup(provider)}
          className="p-3 bg-white border rounded-full hover:bg-gray-100 transition"
          aria-label={`Sign up with ${provider}`}
        >
          <Icon className={`text-2xl ${color}`} />
        </button>
      ))}
    </div>
  );
};

export default SocialSignUp;
