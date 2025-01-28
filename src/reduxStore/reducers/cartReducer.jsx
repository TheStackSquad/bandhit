//src/reduxStore/reducers/cartReducer.jsx
import { ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART } from "@/reduxStore/constants/actionTypes";

const initialState = {
  items: [], // Changed from cart to items for clarity
  totalItems: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // Check if item already exists in cart
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.items.length + 1
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.items.length - 1
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;