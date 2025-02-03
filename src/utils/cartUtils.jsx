// src/utils/cartUtils.jsx
import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize with current cart items from localStorage
    try {
      return JSON.parse(localStorage.getItem("events")) || [];
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  });

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
      // Update state immediately
      setCartItems(newItems);
      // Dispatch custom event for cross-component communication
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cartItems: newItems }
      }));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "events") {
        const newCart = getCurrentCart();
        setCartItems(newCart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    cartItems,
    cartCount: cartItems.length,
    updateCartItems,
  };
};

