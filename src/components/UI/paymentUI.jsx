//src/components/UI/paymentUI.jsx

// src/app/payment/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// import Link from 'next/link';
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Lock,
  X,
} from "lucide-react";

const PaymentPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        cardHolder: user.name,
      }));
    }
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.cartItem?.price * (item.cartItem?.quantity || 1);
    }, 0);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={
                  user?.profileImage ||
                  "/uploads/dashboardDefault/drgnimages.jpeg"
                }
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Details
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4242 4242 4242 4242"
                    maxLength="19"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cardHolder"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Card Holder
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.cardHolder}
                    onChange={(e) =>
                      setFormData({ ...formData, cardHolder: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Expiry Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    CVV
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.cartItem.eventName}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.cartItem.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₦{item.cartItem.price * item.cartItem.quantity}
                    </p>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₦{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transform transition-transform duration-200 hover:scale-[1.02]"
            >
              Pay ₦{calculateTotal()}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Processing Payment</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-center text-gray-600">
                Please wait while we process your payment...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentPage;
