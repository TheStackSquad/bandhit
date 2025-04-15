//src/components/welcomeLayout/attendeeFeatures.jsx

'use client';

import { motion } from "framer-motion";

// Mock categories (replace with real data)
const categories = [
  { id: 1, name: "Concerts", icon: "🎤" },
  { id: 2, name: "Weddings", icon: "💍" },
  { id: 3, name: "Corporate Events", icon: "💼" },
  { id: 4, name: "Sports", icon: "🏀" },
  { id: 5, name: "Festivals", icon: "🎪" },
];

// Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const AttendeeFeatures = () => {
  return (
    <div className="py-16 bg-white">
      {/* Headline */}
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold text-center text-gray-800 mb-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        Find Your Next Unforgettable Experience
      </motion.h2>

      {/* Search Bar */}
      <motion.div
        className="max-w-lg mx-auto mb-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <input
          type="text"
          placeholder="Search for events..."
          className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </motion.div>

      {/* Event Categories */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-5xl mb-4">{category.icon}</span>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{category.name}</h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AttendeeFeatures;
