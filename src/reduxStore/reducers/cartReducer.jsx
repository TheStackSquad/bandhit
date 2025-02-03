//src/reduxStore/reducers/cartReducer.jsx

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  LIKE_EVENT_SUCCESS,
  LIKE_EVENT_FAILURE
} from "@/reduxStore/constants/actionTypes";

const initialState = {
  items: [],
  likedEvents: [],
  error: null,
};



const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };

    case CLEAR_CART:
      return initialState;

    case LIKE_EVENT_SUCCESS:
      if (state.likedEvents.includes(action.payload.eventId)) {
        return state;
      }
      return {
        ...state,
        likedEvents: [...state.likedEvents, action.payload.eventId],
      };

    case LIKE_EVENT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;