//src/utils/cartUtils.jsx
//src/utils/cartUtils.jsx
import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Function to get current cart items from localStorage
  const getCurrentCart = () => {
    try {
      return JSON.parse(localStorage.getItem("events")) || [];
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  };

  // Function to update cart items and trigger updates
  const updateCartItems = (newItems) => {
    try {
      // Update localStorage
      localStorage.setItem("events", JSON.stringify(newItems));
      // Update state
      setCartItems(newItems);
      // Dispatch custom event for cross-component communication
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cartItems: newItems }
      }));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Listen for both storage events and custom events
  useEffect(() => {
    const handleCartUpdate = (event) => {
      if (event.type === 'cartUpdated') {
        setCartItems(event.detail.cartItems);
      } else {
        // Storage event from other tabs
        const newCart = getCurrentCart();
        setCartItems(newCart);
      }
    };

    // Initial cart load
    setCartItems(getCurrentCart());

    // Add event listeners
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return {
    cartItems,
    cartCount: cartItems.length,
    updateCartItems,
  };
};