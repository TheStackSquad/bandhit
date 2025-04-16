import React from 'react';
import { CheckIcon, EyeIcon } from '@/lib/svgFonts/svgFonts';

const PricingHero = () => {
  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 animate-fade-in-up">
          Get Verified. Get Discovered. Get Booked.
        </h1>

        <p className="text-lg text-center text-gray-600 mt-4 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Join thousands of vendors and entertainers reaching new clients every day
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-8 md:gap-16">
          <div className="flex items-center gap-3 animate-fade-in-left delay-400">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              <CheckIcon />
            </div>
            <span className="text-gray-700">Stand out with a verified badge</span>
          </div>

          <div className="flex items-center gap-3 animate-fade-in-right delay-600">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <EyeIcon />
            </div>
            <span className="text-gray-700">Reach 10,000+ event planners monthly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingHero;