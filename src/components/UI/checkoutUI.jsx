// src/components/UI/checkoutUI.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';

export default function CheckoutUI() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  
  // Calculate totals and check for bulk discount
  const calculateTotals = () => {
    const itemGroups = cartItems.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + 1;
      return acc;
    }, {});

    let subtotal = 0;
    let discount = 0;

    cartItems.forEach(item => {
      subtotal += parseFloat(item.price.replace('₦', ''));
      // Apply discount for items with 10 or more quantities
      if (itemGroups[item.id] >= 10) {
        discount += parseFloat(item.price.replace('₦', '')) * 0.15; // 15% discount
      }
    });

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: (subtotal - discount).toFixed(2)
    };
  };

  const { subtotal, discount, total } = calculateTotals();

  // Handle quantity updates
  const updateQuantity = (itemId, action) => {
    dispatch({
      type: action === 'increase' ? 'cart/addItem' : 'cart/removeItem',
      payload: itemId
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'cart/clearCart' });
  };

  // Check if cart has items to enable/disable checkout
  useEffect(() => {
    setIsValid(cartItems.length > 0);
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
            >
              <X size={20} />
              Clear Cart
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div key={index} className="py-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-500">{item.venue}</p>
                      <p className="text-sm text-gray-500">{item.date} at {item.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, 'decrease')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{
                          cartItems.filter(cartItem => cartItem.id === item.id).length
                        }</span>
                        <button
                          onClick={() => updateQuantity(item.id, 'increase')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-gray-900 font-medium">{item.price}</span>
                      <button
                        onClick={() => dispatch({ type: 'cart/removeItem', payload: item.id })}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">₦{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount (15%)</span>
                      <span>-₦{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₦{total}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-8">
                <button
                  onClick={() => router.push('/payment')}
                  disabled={!isValid}
                  className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium 
                    ${isValid 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}