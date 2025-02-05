//src/components/modal/validationModal.jsx
'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const ValidationModal = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'success', // 'success' or 'error'
  autoCloseDelay = 2000 
}) => {
  // Only auto-close for success messages
  useEffect(() => {
    if (isOpen && type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay, type]);

  // Determine icon and colors based on type
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={type === 'error' ? undefined : onClose}
          />

          {/* Modal Container with improved positioning */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4">
                  <Icon className={`w-12 h-12 ${iconColor}`} />
                </div>

                {/* Message */}
                <p className="text-gray-800 text-lg font-medium mb-4">
                  {message}
                </p>

                {/* Error-specific retry button */}
                {type === 'error' && (
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                )}

                {/* Close button - only shown for success or when explicitly needed */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ValidationModal;