// src/components/UI/CheckoutUI.jsx
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { CheckoutModal } from "@/components/modal/checkoutModal";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { removeFromCart, clearCart as clearReduxCart } from "@/reduxStore/actions/cartActions";

export default function CheckoutUI() {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //eslint-disable-next-line
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Calculate totals considering local quantities
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const quantity = localQuantities[item._id] || item.quantity || 1;
      return sum + item.price * quantity;
    }, 0);
    const discount = subtotal > 1000 ? subtotal * 0.15 : 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  // Update local quantity without touching Redux
  const updateQuantity = (itemId, action) => {
    setLocalQuantities(prev => {
      const currentQuantity = prev[itemId] || 1;
      const newQuantity = action === "increase" 
        ? currentQuantity + 1 
        : Math.max(1, currentQuantity - 1);
      
      return {
        ...prev,
        [itemId]: newQuantity
      };
    });
  };

  // Handle cart clearing
  const handleClearCart = () => {
    dispatch(clearReduxCart());
    setCartItems([]);
    setLocalQuantities({});
    setIsModalOpen(false);
    localStorage.removeItem('persist:cart');
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    const updatedItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedItems);
    
    // Remove from local quantities
    const newQuantities = { ...localQuantities };
    delete newQuantities[itemId];
    setLocalQuantities(newQuantities);
    
    // Dispatch to Redux
    dispatch(removeFromCart(itemId));
  };

  // Fetch cart data from localStorage
  useEffect(() => {
    const eventsData = localStorage.getItem("persist:cart");
    if (eventsData) {
      try {
        const parsedData = JSON.parse(eventsData);
        const eventsArray = parsedData.items ? JSON.parse(parsedData.items) : [];
        setCartItems(eventsArray);
        
        // Initialize local quantities
        const initialQuantities = {};
        eventsArray.forEach(item => {
          initialQuantities[item._id] = item.quantity || 1;
        });
        setLocalQuantities(initialQuantities);
      } catch (error) {
        console.error("Error parsing events from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Update validity
  useEffect(() => {
    setIsValid(cartItems.length > 0);
  }, [cartItems]);

  const { subtotal, discount, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Shopping Cart</h1>
            <button
  onClick={() => setIsModalOpen(true)}
  disabled={cartItems.length === 0}
  className={`flex items-center gap-2 font-medium transition-colors duration-200
    ${cartItems.length === 0 
      ? 'text-gray-300 cursor-not-allowed' 
      : 'text-red-600 hover:text-red-800'}`}
>
  <X 
    size={20} 
    className={`transition-transform duration-200 transform
      ${cartItems.length > 0 ? 'hover:scale-110' : ''}`}
  />
  Clear Cart
</button>
          </div>

          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-lg">{item.eventName}</h3>
                      <p className="text-secondary">{item.venue}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.date).toISOString().split("T")[0]} at {item.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, "decrease")}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">
                          {localQuantities[item._id] || item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, "increase")}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-primary font-semibold">
                        ₦{(item.price || 0) * (localQuantities[item._id] || item.quantity || 1)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {cartItems.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 border-t border-gray-200 pt-8"
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={!isValid}
                  className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium ${
                    isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearCart}
      />
    </div>
  );
}