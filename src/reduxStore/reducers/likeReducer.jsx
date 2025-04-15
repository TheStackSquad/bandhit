// src/reduxStore/reducers/likeReducer.jsx

import {
    LIKE_EVENT_REQUEST,
    LIKE_EVENT_SUCCESS,
    LIKE_EVENT_FAILURE,
    UNLIKE_EVENT_REQUEST,
    UNLIKE_EVENT_SUCCESS,
    UNLIKE_EVENT_FAILURE,
    FETCH_EVENT_LIKES_REQUEST,
    FETCH_EVENT_LIKES_SUCCESS,
    FETCH_EVENT_LIKES_FAILURE,
} from "@/reduxStore/constants/actionTypes";

const initialState = {
    likedEvents: {}, // Map of eventId -> true/false
    likesCount: {},  // Map of eventId -> count
    loading: false,
    error: null,
};

const likeReducer = (state = initialState, action) => {
    switch (action.type) {
        case LIKE_EVENT_REQUEST:
        case UNLIKE_EVENT_REQUEST:
        case FETCH_EVENT_LIKES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case LIKE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                likedEvents: {
                    ...state.likedEvents,
                    [action.payload.eventId]: true,
                },
                likesCount: {
                    ...state.likesCount,
                    [action.payload.eventId]: action.payload.likesCount,
                },
            };

        case UNLIKE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                likedEvents: {
                    ...state.likedEvents,
                    [action.payload.eventId]: false,
                },
                likesCount: {
                    ...state.likesCount,
                    [action.payload.eventId]: action.payload.likesCount,
                },
            };

        case FETCH_EVENT_LIKES_SUCCESS:
            return {
                ...state,
                loading: false,
                likedEvents: {
                    ...state.likedEvents,
                    [action.payload.eventId]: action.payload.liked,
                },
                likesCount: {
                    ...state.likesCount,
                    [action.payload.eventId]: action.payload.likesCount,
                },
            };

        case LIKE_EVENT_FAILURE:
        case UNLIKE_EVENT_FAILURE:
        case FETCH_EVENT_LIKES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default likeReducer;