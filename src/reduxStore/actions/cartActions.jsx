//src/reduxStore/actions/cartActions.jsx
import axios from "axios";
import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART,
  CLEAR_CART,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
} from "@/reduxStore/constants/actionTypes";

// Add to Cart
export const addToCart = (eventCart, token) => async (dispatch) => {
  //  console.log('token in cart action:', token);
    //  console.log('items in cart action:', eventCart);
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post("/api/auth/cart", eventCart, config);
    dispatch({ type: ADD_TO_CART, payload: response.data });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    dispatch({ type: ADD_TO_CART_FAILURE, error: error.message });
  }
};

// Fetch Cart
export const fetchCart = (token) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get("/api/auth/cart", config);
    dispatch({ type: FETCH_CART_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching cart:", error);
    dispatch({ type: FETCH_CART_FAILURE, error: error.message });
  }
};

//src/reduxStore/actions/cartActions.jsx
export const removeFromCart = (itemId, token) => async (dispatch) => {
  //  console.log('removeFromCart action creator called:', {
  //   itemId,
  //   tokenExists: !!token,
  //   timestamp: new Date().toISOString()
  // });

  try {
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    // console.log('Making DELETE request to:', `/api/auth/cart/${itemId}`, {
      // headers: {
        // ...config.headers,
        // Authorization: 'Bearer [REDACTED]' // Don't log actual token
      // }
    // });
    
    const response = await axios.delete(`/api/auth/cart/${itemId}`, config);
    
    // console.log('Delete API Response:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   data: response.data
    // });

    if (response.status === 200) {
      dispatch({ type: REMOVE_FROM_CART, payload: itemId });
      // console.log('Successfully dispatched REMOVE_FROM_CART action:', {
        // itemId,
        // timestamp: new Date().toISOString()
      // });
      return true;
    }
  } catch (error) {
    console.error('Error in removeFromCart:', {
      itemId,
      errorMessage: error.message,
      errorResponse: error.response?.data,
      errorStatus: error.response?.status,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Clear Cart
export const clearCart = () => ({ type: CLEAR_CART });
