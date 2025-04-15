// src/reduxStore/reducers/reelReducers.js
// src/reduxStore/reducers/reelReducers.jsx
import { REEL_ACTION_TYPES } from '@/reduxStore/constants/actionTypes';

const initialState = {
    reels: [],       // Only persisted data
    error: null      // Only global errors
};

export const reelReducer = (state = initialState, action) => {
    switch (action.type) {
        case REEL_ACTION_TYPES.ADD_REEL:
            return {
                ...state,
                reels: [action.payload, ...state.reels],
                error: null
            };

        case REEL_ACTION_TYPES.SET_ERROR:
            return { ...state, error: action.payload };

        default:
            return state;
    }
};
