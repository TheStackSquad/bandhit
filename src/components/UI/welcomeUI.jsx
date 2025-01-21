//src/components/UI/welcomeUI

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { josefin } from '@/app/fonts';

const WelcomePage = () => {
  const router = useRouter();

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isClient, setIsClient] = useState(false); // To prevent hydration mismatch

  const maxSelections = 5;

  const eventTypes = [
    "Book Launch",
    "Concert",
    "House Party",
    "Block Party",
    "Album Launch",
    "Cookout",
    "Beach Splash",
    "Music Festival",
    "Poetry Night",
    "Art Exhibition"
  ];

  // Ensure the component only renders animations on the client-side to avoid SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEventSelection = (event) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(prev => prev.filter(e => e !== event));
    } else if (selectedEvents.length < maxSelections) {
      setSelectedEvents(prev => [...prev, event]);
    }
  };

  if (!isClient) {
    return null; // Prevent SSR mismatch on initial render
  }

  return (
    <div className={`${josefin.variable} font-josefin min-h-screen p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Counter */}
        <div className="mb-8 text-center">
          <motion.div
            className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-white">
              Selected: {selectedEvents.length}/{maxSelections} Events
            </span>
          </motion.div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {eventTypes.map((event, index) => (
            <motion.button
              key={event}
              onClick={() => handleEventSelection(event)}
              className={`p-6 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                selectedEvents.includes(event)
                  ? 'bg-purple-600/30 ring-2 ring-purple-500 shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={selectedEvents.length >= maxSelections && !selectedEvents.includes(event)}
            >
              <span className="text-white text-lg font-medium">{event}</span>
            </motion.button>
          ))}
        </div>

        {/* Info Message */}
        <div className="mb-8">
          <motion.div
            className="flex items-center gap-2 justify-center text-white/80 bg-white/10 rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AlertCircle className="w-5 h-5" />
            <p>Sign up to enjoy discounts and get first access to upcoming shows!</p>
          </motion.div>
        </div>

        {/* Auth Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </button>
          <button
            className="w-full sm:w-auto px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            onClick={() => router.push('/signin')}
          >
            Sign In
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
