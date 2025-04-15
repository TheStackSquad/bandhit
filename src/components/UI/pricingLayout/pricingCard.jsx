//src/components/UI/pricingLayout/pricingCard.jsx

import React from 'react';

const PricingCard = ({
    title,
    price,
    description,
    features,
    isPopular,
    ctaText,
    currency = '₦',
    isSelected,
    onSelect,
}) => {
    // Handle keyboard events (e.g., Enter or Space key)
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Prevent default behavior (e.g., scrolling on Space)
            onSelect();
        }
    };

    return (
        <div
            role="button" // Make the div behave like a button
            tabIndex={0} // Make the div focusable
            className={`relative flex flex-col p-6 bg-white rounded-lg shadow-md border ${isSelected ? 'border-blue-500 scale-105' : 'border-gray-200'
                } transition-all duration-300 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={onSelect}
            onKeyDown={handleKeyDown} // Add keyboard event listener
            aria-pressed={isSelected} // Indicate selected state for screen readers
        >
            {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-4 py-1 rounded-full">
                    MOST POPULAR
                </div>
            )}
            <h3 className="text-2xl font-semibold text-center text-gray-800">{title}</h3>
            <div className="my-4 text-center">
                <span className="text-4xl font-bold text-gray-900">{currency}{price}</span>
                <span className="text-gray-600">/{description}</span>
            </div>
            <ul className="flex-1 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                        <span className="mr-2">{feature.icon}</span>
                        {feature.text}
                    </li>
                ))}
            </ul>
            <button
                className={`mt-6 w-full py-2 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    } transition-all duration-300 hover:bg-blue-600 hover:text-white`}
            >
                {ctaText}
            </button>
        </div>
    );
};

export default PricingCard;