// src/reduxStore/constants/actionTypes.js
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";

export const ADD_TO_CART_REQUEST = "ADD_TO_CART_REQUEST";
export const ADD_TO_CART_FAILURE = "ADD_TO_CART_FAILURE";

export const LIKE_EVENT_REQUEST = 'LIKE_EVENT_REQUEST'
export const LIKE_EVENT_SUCCESS = 'LIKE_EVENT_SUCCESS'
export const LIKE_EVENT_FAILURE = 'LIKE_EVENT_FAILURE'

export const UNLIKE_EVENT_REQUEST = 'UNLIKE_EVENT_REQUEST';
export const UNLIKE_EVENT_SUCCESS = 'UNLIKE_EVENT_SUCCESS';
export const UNLIKE_EVENT_FAILURE = 'UNLIKE_EVENT_FAILURE';
export const FETCH_EVENT_LIKES_REQUEST = 'FETCH_EVENT_LIKES_REQUEST';
export const FETCH_EVENT_LIKES_SUCCESS = 'FETCH_EVENT_LIKES_SUCCESS';
export const FETCH_EVENT_LIKES_FAILURE = 'FETCH_EVENT_LIKES_FAILURE';

export const CREATE_EVENT_REQUEST = 'CREATE_EVENT_REQUEST'
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS'
export const CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE'

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';

export const UPDATE_USER_IMAGE_SUCCESS = 'UPDATE_PROFILE_IMAGE_SUCCESS';
export const UPDATE_USER_IMAGE_FAILURE = 'UPDATE_PROFILE_IMAGE_FAILURE';

// Add these to existing action types
export const UPDATE_ARTIST_PROFILE_REQUEST = 'UPDATE_ARTIST_PROFILE_REQUEST';
export const UPDATE_ARTIST_PROFILE_SUCCESS = 'UPDATE_ARTIST_PROFILE_SUCCESS';
export const UPDATE_ARTIST_PROFILE_FAILURE = 'UPDATE_ARTIST_PROFILE_FAILURE';

export const UPDATE_VENDOR_PROFILE_REQUEST = 'UPDATE_VENDOR_PROFILE_REQUEST';
export const UPDATE_VENDOR_PROFILE_SUCCESS = 'UPDATE_VENDOR_PROFILE_SUCCESS';
export const UPDATE_VENDOR_PROFILE_FAILURE = 'UPDATE_VENDOR_PROFILE_FAILURE';

export const SET_EVENTS = 'SET_EVENTS';

// reel constants 
// src/reduxStore/constants/actionType.jsx
export const REEL_ACTION_TYPES = {
    ADD_REEL: 'REELS/ADD_REEL',
    SET_ERROR: 'REELS/SET_ERROR'
};
