//src/reduxSore/actions/cartActions.jsx
import { ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART } from "@/reduxStore/constants/actionTypes";

// Add to Cart Action
export const addToCart = (item) => {
  if (!item || !item.id) {
    console.error("Invalid item passed to addToCart:", item);
    return { type: ADD_TO_CART, payload: {} }; // Use the constant here
  }
  return {
    type: ADD_TO_CART, // Use the constant here
    payload: item,
  };
};

export const removeFromCart = (id) => {
  if (!id) {
    console.error("Invalid ID passed to removeFromCart:", id);
    return { type: REMOVE_FROM_CART, payload: null }; // Use the constant here
  }
  return {
    type: REMOVE_FROM_CART, // Use the constant here
    payload: id,
  };
};

// Clear Cart Action
export const clearCart = () => {
  return {
    type: CLEAR_CART, // Use the constant here
  };
};
