//src/components/UI/pricingLayout/pricingToggle.jsx

import React from 'react';
import { motion } from 'framer-motion';

const PricingToggle = ({ userType, setUserType, billingCycle, setBillingCycle }) => {
    const userTypes = ['Organizers', 'Vendors', 'Entertainers'];

    return (
        <div className="w-full bg-white py-6">
            <div className="container mx-auto px-4">
                {/* User Type Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-full flex items-center">
                        {userTypes.map((type, 
                        //eslint-disable-next-line
                        index) => (
                            <button
                                key={type}
                                onClick={() => setUserType(type)}
                                className={`relative px-6 py-2 text-sm md:text-base rounded-full transition-all duration-300 ${userType === type
                                        ? 'text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                {userType === type && (
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500 rounded-full"
                                        layoutId="userTypeBackground"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm md:text-base ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        Monthly
                    </span>

                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                        className="w-12 h-6 rounded-full bg-gray-200 flex items-center p-1 cursor-pointer"
                    >
                        <motion.div
                            className="w-4 h-4 bg-blue-500 rounded-full"
                            animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className={`text-sm md:text-base ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            Annual
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            20% off
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingToggle;