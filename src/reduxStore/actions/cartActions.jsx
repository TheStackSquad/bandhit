//src/reduxStore/actions/cartActions.jsx

import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  LIKE_EVENT_REQUEST,
  LIKE_EVENT_SUCCESS,
  LIKE_EVENT_FAILURE
} from "@/reduxStore/constants/actionTypes";

// Add to Cart


export const addToCart = (eventDetails) => (dispatch, getState) => {
  const { cart } = getState();
  
  // Check if event already exists in cart
  const existingEvent = cart.items.find(event => event._id === eventDetails._id);

  if (!existingEvent) {
    // Only add if event doesn't exist
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...eventDetails,
        quantity: 1,
        price: eventDetails.price || 0,
      }
    });
  }
};

export const removeFromCart = (itemId) => ({
  type: REMOVE_FROM_CART,
  payload: itemId
});

export const clearCart = () => ({ 
  type: CLEAR_CART 
});

export const likeEventAction = (eventId, token) => async (dispatch) => {
  dispatch({ type: LIKE_EVENT_REQUEST });

  try {
    const response = await axios.post(
      '/api/auth/eventLike',
      { eventId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      dispatch({ type: LIKE_EVENT_SUCCESS, payload: response.data });
    }
  } catch (error) {
    dispatch({
      type: LIKE_EVENT_FAILURE,
      payload: error.response?.data?.message || 'Error liking event'
    });
  }
};
