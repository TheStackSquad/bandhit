// src/components/modal/paymentModal.jsx

"use client";
import { Eye, X } from "lucide-react"; // Importing icons
import { useEffect, useState } from "react";
import { validatePaymentForm } from "@/utils/otherUtils/feedbackValidation";
import { submitPayment } from "@/utils/checkoutUtils/paymentUtils";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { useDispatch } from "react-redux";
import {
  clearCart as clearReduxCart,
} from "@/reduxStore/actions/cartActions";
import { showError } from "@/lib/alertManager";

export const PaymentModal = ({ isOpen, onClose, total }) => {
  const [formData, setFormData] = useState({
    userId: "", // Add this field to store the user ID
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    pin: "",
    amount: total || ""
  });

  const [showPin, setShowPin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const dispatch = useDispatch();
  // Toggle pin visibility function
  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
  //    console.log("Retrieved user data from localStorage:", {
  //       id: userData.id,
  //       full_name: userData.user_metadata?.full_name,
  //       email: userData.user_metadata?.email
  //     });

      setFormData(prev => ({
        ...prev,
        userId: userData.id || prev.userId,
        fullName: prev.fullName || userData.user_metadata?.full_name || "",
        email: prev.email || userData.user_metadata?.email || ""
      }));
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTotal = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Alternative: explicitly check required fields
  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.cardNumber &&
      formData.cardNumber.trim() !== '' &&
      formData.expiryDate &&
      formData.cvc &&
      formData.cvc.trim() !== '' &&
      formData.pin &&
      formData.pin.trim() !== '' &&
      formData.amount > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  //  console.log("Form submission started with data:", formData);

    // Validate form
    const { isValid, errors } = validatePaymentForm(formData);

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      showError(firstError);
//      console.log("Validation failed:", errors);
      return;
    }

//    console.log("Form validation passed, submitting payment");

    // Submit payment with clearCart function
    const result = await submitPayment(formData, handleClearCart);

    if (result.success) {
//      console.log("Payment successful, showing confirmation modal");
      setConfirmationData({
        fullName: formData.fullName,
        email: formData.email
      });
      setShowConfirmation(true);
    } else {
  //    console.log("Payment failed:", result.error);
    }
  };

  // Handle cart clearing
  const handleClearCart = () => {
    dispatch(clearReduxCart());
    // setCartItems([]);
    // setLocalQuantities({});
    // setIsModalOpen(false);
    localStorage.removeItem("persist:cart");
  };
  // Handle when user closes the confirmation modal
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Now close the payment modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 py-5 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-opacity animate-fadeIn p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="bg-white mt-12 rounded-lg shadow-2xl max-w-lg w-full py-12 md:p-8 relative transform transition-all duration-300">
          {/* Modal Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                value={formData.fullName}
                onChange={handleChange}
              />

            </div>

            {/* Email Field */}
            <div className="flex flex-col mb-2">
              <label htmlFor="email" className="text-gray-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Amount and PIN Fields in the same row */}
            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col">
                <label htmlFor="amount" className="text-gray-700 font-medium mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₦</span>
                  <input
                    type="number"
                    id="amount"
                    className="mt-1 p-3 pl-10 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleTotal}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="pin" className="text-gray-700 font-medium mb-1">PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    id="pin"
                    className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                    placeholder="••••"
                    maxLength="4"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePinVisibility}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card Number Field */}
            <div className="flex flex-col mb-2">
              <label htmlFor="cardNumber" className="text-gray-700 font-medium mb-1">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Expiry Date & CVC Fields */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col">
                <label htmlFor="expiryDate" className="text-gray-700 font-medium mb-1">Expiry Date</label>
                <input
                  type="month"
                  id="expiryDate"
                  className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="cvc" className="text-gray-700 font-medium mb-1">CVC</label>
                <input
                  type="text"
                  id="cvc"
                  className="mt-1 p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-400 outline-none w-full"
                  placeholder="123"
                  maxLength="4"
                  value={formData.cvc}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className={`w-full py-4 px-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-0.5 ${isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                  : "bg-gray-400 cursor-not-allowed text-gray-700"
                  }`}
                disabled={!isFormValid}
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        userData={confirmationData}
      />
    </>
  );
};

