//src/reduxStore/reducers/cartReducer.jsx
import { 
  ADD_TO_CART_REQUEST, 
  ADD_TO_CART, 
  ADD_TO_CART_FAILURE, 
  REMOVE_FROM_CART, 
  CLEAR_CART, 
  FETCH_CART_REQUEST, 
  FETCH_CART_SUCCESS, 
  FETCH_CART_FAILURE 
} from "@/reduxStore/constants/actionTypes";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case FETCH_CART_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_TO_CART:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
      };

    case ADD_TO_CART_FAILURE:
    case FETCH_CART_FAILURE:
      return { ...state, loading: false, error: action.error };

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CLEAR_CART:
      return initialState;

    case FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
