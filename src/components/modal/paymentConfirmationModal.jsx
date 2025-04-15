// src/components/modal/PaymentConfirmationModal.jsx

import React from "react";
import { X } from "lucide-react";

export const PaymentConfirmationModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70 z-50 transition-opacity animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 relative transform transition-all duration-300 animate-scaleIn">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Payment Successful!
        </h2>

        <div className="text-center mb-6">
          <p className="text-gray-700 mb-3">
            Thank you, <span className="font-medium">{userData?.fullName || "valued customer"}</span>!
          </p>
          <p className="text-gray-700 mb-4">
            Your payment has been processed successfully. We have sent a confirmation 
            with your e-ticket to <span className="font-medium">{userData?.email || "your email"}</span>.
          </p>
          <p className="text-sm text-gray-500">
            Please check your inbox and spam folder if you do not see it.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};