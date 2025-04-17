// src/components/UI/hub/HubHeader.jsx
import React from 'react';

const HubHeader = () => {
  return (
    <header className="relative text-center py-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full filter blur-xl animate-float1"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/15 rounded-full filter blur-xl animate-float2"></div>
      </div>
      
      {/* Content with animation */}
      <div className="relative space-y-4 transform transition-all duration-500 hover:scale-[1.01]">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
          Welcome to the Vendor & Entertainer Hub
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fadeIn delay-100">
          Discover and connect with the best vendors and entertainers for your next event.
        </p>
        
        {/* Subtle CTA with animation */}
        <div className="pt-4 animate-fadeIn delay-200">
          <button 
            className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:shadow-lg hover:scale-105"
            aria-label="Explore more"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </header>
  );
};

export default HubHeader;