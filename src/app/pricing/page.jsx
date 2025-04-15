// src/app/pricing/page.jsx

"use client";

import React from 'react';
import PricingPlan from '@/components/UI/pricingLayout/pricingPlan';
import { useRouter } from 'next/navigation';

const PricingPage = () => {

      const router = useRouter();
      
        const handleBack = () => {
          router.push('/signup');
        };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">BandHit</h1>
                    <div className="flex space-x-4">
                        <button 
                            onClick={handleBack}
                            aria-label="sign up"
                        className="px-4 py-2 text-sm text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300">
                            Login
                        </button>
                        <button 
                            onClick={handleBack}
                            aria-label="sign up"
                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-6 py-12">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
                    Get Verified. Get Discovered. Get Booked.
                </h2>
                <p className="text-lg text-center text-gray-600 mb-8">
                    Join thousands of vendors and entertainers reaching new clients every day.
                </p>
                <PricingPlan />
            </main>
        </div>
    );
};

export default PricingPage;