//src/components/UI/checkoutUI.jsx

"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { calculateTotals, updateQuantity, clearCart, removeFromCart } from "@/utils/checkoutUtils";
import { CheckoutModal } from "@/components/modal/checkoutModal";
//eslint-disable-next-line
//import { PaymentModal } from "@/components/Modal/paymentModal";

export default function CheckoutUI() {
  // const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //eslint-disable-next-line
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // Handle cart clearing logic
  const handleClearCart = () => {
    clearCart(setCartItems);
    setIsModalOpen(false);
  };

  // Fetch cart data from localStorage
  useEffect(() => {
    const eventsData = localStorage.getItem("events");
  
    try {
      const parsedEvents = JSON.parse(eventsData);
      const eventsArray = Array.isArray(parsedEvents) ? parsedEvents : [];
      setCartItems(eventsArray);
    } catch (error) {
      console.error("Error parsing events from localStorage:", error);
      setCartItems([]); // Default to an empty array
    }
  }, []);
  
  // Calculate totals
  const { subtotal, discount, total } = calculateTotals(cartItems);

  // Check if cart has items to enable/disable checkout
  useEffect(() => {
    setIsValid(cartItems.length > 0);
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Shopping Cart</h1>
          <button
              onClick={() => setIsModalOpen(true)}
              className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X size={20} className="transition-transform duration-200 transform hover:scale-110" />
              Clear Cart
            </button>
          </div>

          {/* Modal to show if there are items in the cart */}
          {cartItems.length > 0 && (
            <CheckoutModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleClearCart}
            />
          )}

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
          
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, index) => {
            //    console.log(item);
                const { id,
                  eventName,
                  venue,
                  date,
                  time,
                  price,
                  quantity } = item;

                const formattedDate = new Date(date).toISOString().split("T")[0];

                return (
                  <div key={index} className="py-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-lg">{eventName}</h3>
                      <p className="text-secondary">{venue}</p>
                      <p className="text-sm text-gray-600">{formattedDate} at {time}</p>
                    </div>
                    <div className="flex items-center gap-4">

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(id, "decrease", setCartItems)}
                          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-200 transform hover:scale-110"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(id, "increase", setCartItems)}
                          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-200 transform hover:scale-110"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <span className="text-primary font-semibold">  ₦{(price || 0) * (quantity || 1)}</span>
                      <button
                        onClick={() => removeFromCart(id, setCartItems)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-200 transform hover:scale-110"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 font-semibold">₦{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount (15%)</span>
                    <span>-₦{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="font-bold text-primary">₦{total}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-8">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={!isValid}
                className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Payment Modal (optional for when you integrate the payment) */}
    {isPaymentModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        {/* Your payment modal component goes here */}
      </div>
    )}
  </div>
  );
}
