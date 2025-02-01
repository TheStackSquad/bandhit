// src/components/modal/paymentModal.jsx

"use client";
import { Eye, X } from "lucide-react"; // Importing icons

export const PaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 md:p-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Information</h2>

        <form className="space-y-4">
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600"
              placeholder="youremail@example.com"
              required
            />
          </div>

          {/* Card Number Field */}
          <div className="flex flex-col">
            <label htmlFor="cardNumber" className="text-gray-700 font-medium">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          {/* Expiry Date & CVC Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="expiryDate" className="text-gray-700 font-medium">Expiry Date</label>
              <input
                type="month"
                id="expiryDate"
                className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="cvc" className="text-gray-700 font-medium">CVC</label>
              <input
                type="text"
                id="cvc"
                className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600"
                placeholder="123"
                required
              />
            </div>
          </div>

          {/* Password Field with Eye Icon */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="mt-1 p-3 border rounded-lg text-gray-900 w-full focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
              >
                <Eye size={20} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
