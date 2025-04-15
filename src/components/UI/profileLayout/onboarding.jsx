// src/components/UI/onboarding.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Onboarding = () => {
  const router = useRouter();
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    setShowElements(true); // Trigger animation on mount
  }, []);

  const handleVendorClick = () => {
    router.push('/create_profile/vendor_profile');
  };

  const handleEntertainerClick = () => {
    router.push('/create_profile/artist_profile');
  };

  const handleSkipClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className={`text-center space-y-4 ${showElements ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to Our Platform!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Connect with vendors and entertainers for your perfect event.
        </p>
      </div>

      <div className={`flex space-x-4 mt-8 ${showElements ? 'opacity-100 transition-opacity duration-1000 delay-200' : 'opacity-0'}`}>
        <button
          onClick={handleVendorClick}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Vendor
        </button>
        <button
          onClick={handleEntertainerClick}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          Entertainer
        </button>
      </div>

      <button
        onClick={handleSkipClick}
        className={`mt-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 ${showElements ? 'opacity-100 transition-opacity duration-1000 delay-400' : 'opacity-0'}`}
      >
        Skip and go to Dashboard
      </button>
    </div>
  );
};

export default Onboarding;