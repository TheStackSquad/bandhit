// src/reduxStore/actions/cartActions.jsx

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "@/reduxStore/constants/actionTypes";

// Add to Cart
export const addToCart = (eventDetails) => (dispatch, getState) => {
  const { cart } = getState();

  // Check if event already exists in cart
  const existingEvent = cart.items.find(event => event.id === eventDetails.id);

  if (!existingEvent) {
    // Only add if event doesn't exist
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...eventDetails,
        quantity: 1,
        price: eventDetails.price || 0,
      },
    });
  }
};

export const removeFromCart = (itemId) => ({
  type: REMOVE_FROM_CART,
  payload: itemId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});