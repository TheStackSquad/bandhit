// //src/components/loadingUI.jsx

// "use client";

// import React from 'react';
// import { motion } from 'framer-motion'; // Import framer-motion

// export default function LoadingScreen({ message = "Loading..." }) {
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-200 dark:bg-gray-800 backdrop-blur-sm"
//             style={{ zIndex: 9999 }} // Ensure it's on top of other elements
//         >
//             <motion.div
//                 className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md"
//                 initial={{ opacity: 0, scale: 0.8 }} // Initial animation state
//                 animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and scale
//                 transition={{ duration: 0.3 }} // Smooth transition
//             >
//                 {/* Spinner */}
//                 <motion.div
//                     className="w-10 h-10 border-4 border-t-transparent border-gray-600 dark:border-gray-300 rounded-full animate-spin"
//                     animate={{ rotate: 360 }} // Rotate indefinitely
//                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }} // Infinite rotation
//                 />

//                 {/* Loading Message */}
//                 <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm font-jetbrains">
//                     {message}
//                 </p>
//             </motion.div>
//         </div>
//     );
// }



// src/components/loadingUI.jsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ isProcessing, message = "Loading..." }) {
    if (!isProcessing) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-200 dark:bg-gray-800 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      <motion.div
        className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-10 h-10 border-4 border-t-transparent border-gray-600 dark:border-gray-300 rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm font-jetbrains">
          {message}
        </p>
      </motion.div>
    </div>
  );
}