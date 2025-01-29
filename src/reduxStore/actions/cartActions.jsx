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
export const addToCart = (item, token) => async (dispatch) => {
  // console.log('token in cart action:', token);
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post("/api/auth/cart", item, config);
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

// Remove from Cart
export const removeFromCart = (id, token) => async (dispatch) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`/api/auth/cart/${id}`, config);
    dispatch({ type: REMOVE_FROM_CART, payload: id });
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// Clear Cart
export const clearCart = () => ({ type: CLEAR_CART });
