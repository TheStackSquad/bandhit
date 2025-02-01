//src/components/motion/animatedIcon.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/utils/cartUtils';

const AnimatedCartIcon = () => {
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);

  useEffect(() => {
    // Only animate when cart count changes
    if (prevCount !== cartCount) {
      setIsAnimating(true);
      setPrevCount(cartCount);
      
      // Reset animation after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [cartCount, prevCount]);

  return (
    <button
      className="relative flex items-center justify-center w-12 h-12 text-white bg-blue-600 rounded-full shadow-md focus:outline-none hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      aria-label="Cart"
    >
      <ShoppingCart 
        size={20} 
        className={`text-gray-800 w-6 h-6 ${
          isAnimating ? 'animate-bounce' : ''
        }`}
      />
      {cartCount > 0 && (
        <span 
          className={`absolute top-0 right-0 
            flex items-center justify-center 
            w-5 h-5 text-sm font-bold 
            text-white bg-red-600 rounded-full
            transform transition-all duration-300
            ${isAnimating ? 'scale-125' : 'scale-100'}
            `}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default AnimatedCartIcon;