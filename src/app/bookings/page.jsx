// src/app/bookings/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function BlogPage() {
  // State to control animation timing
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animation after component mounts
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      {/* Message container with animation */}
      <div 
        className={`max-w-md p-8 rounded-lg shadow-lg bg-white text-center transform transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-sky-200 p-4">
            <svg 
              className="w-12 h-12 text-sky-600 animate-bounce" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
        
        {/* Message title with loading animation */}
        <h2 className="text-2xl font-bold mb-3 text-sky-800 flex items-center justify-center">
       Bookings will be available soon.
          <span className="ml-2 flex space-x-1">
            <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
          </span>
        </h2>
        
        {/* Friendly message */}
        <p className="text-gray-600 mb-6">
          Hey there! 👋 Our dev team is working their magic on this awesome blog section right now. 
          They are fueled by coffee and determination, so it should not take too long!
        </p>
        
        <p className="text-gray-600 mb-6">
          In the meantime, feel free to check out all the other cool stuff on our app. 
          There is plenty to explore while we put the finishing touches on this page!
        </p>
        
        {/* Button with hover animation */}
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transform hover:scale-105 transition-all duration-300"
        >
          Take Me Back
        </button>
      </div>
    </div>
  );
}