// src/reduxStore/actions/likeActions.jsx

import {
    LIKE_EVENT_REQUEST,
    LIKE_EVENT_SUCCESS,
    LIKE_EVENT_FAILURE,
    UNLIKE_EVENT_SUCCESS,
    FETCH_EVENT_LIKES_REQUEST,
    FETCH_EVENT_LIKES_SUCCESS,
    FETCH_EVENT_LIKES_FAILURE,
} from "@/reduxStore/constants/actionTypes";
import { getOrCreateSessionId } from '@/utils/eventUtils/eventsUtils';

// Toggle like/unlike
export const toggleEventLike = (eventId, sessionId) => async (dispatch) => {
    dispatch({ type: LIKE_EVENT_REQUEST });

    try {
        const response = await fetch('/api/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId, sessionId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Like operation failed');
        }

        const data = await response.json();

        if (data.liked) {
            dispatch({
                type: LIKE_EVENT_SUCCESS,
                payload: {
                    eventId: data.eventId,
                    likesCount: data.likesCount,
                },
            });
        } else {
            dispatch({
                type: UNLIKE_EVENT_SUCCESS,
                payload: {
                    eventId: data.eventId,
                    likesCount: data.likesCount,
                },
            });
        }

        return data;
    } catch (error) {
        dispatch({
            type: LIKE_EVENT_FAILURE,
            payload: error.message || 'Error processing like action',
        });
        throw error;
    }
};

// Fetch event like status
export const fetchEventLikeStatus = (eventId, sessionId) => async (dispatch) => {
    dispatch({ type: FETCH_EVENT_LIKES_REQUEST });

    try {
        const response = await fetch(`/api/like?eventId=${eventId}&sessionId=${sessionId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch like status');
        }

        const data = await response.json();

        dispatch({
            type: FETCH_EVENT_LIKES_SUCCESS,
            payload: {
                eventId: data.eventId,
                liked: data.liked,
                likesCount: data.likesCount,
            },
        });

        return data;
    } catch (error) {
        dispatch({
            type: FETCH_EVENT_LIKES_FAILURE,
            payload: error.message || 'Error fetching like status',
        });
        throw error;
    }
};

// Selective loading for visible events
export const loadVisibleEventLikes = (eventIds) => async (dispatch, getState) => {
    if (!eventIds || eventIds.length === 0) return;

    const sessionId = getOrCreateSessionId();
    const { likes } = getState();

    // Process in batches of 5 to not overwhelm the network
    const batchSize = 5;
    for (let i = 0; i < eventIds.length; i += batchSize) {
        const batch = eventIds.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (eventId) => {
                // Skip if we already have fresh data
                if (likes.likedEvents[eventId] !== undefined) return;

                try {
                    await dispatch(fetchEventLikeStatus(eventId, sessionId));
                } catch (error) {
                    // Silent fail for batch operations
                    console.error(`Failed to load likes for event ${eventId}:`, error);
                }
            })
        );
    }
};

// Enhanced action for updating like state with optimistic update support
export const updateEventLike = (eventId, liked, likesCount, isOptimistic = false) => ({
    type: liked ? LIKE_EVENT_SUCCESS : UNLIKE_EVENT_SUCCESS,
    payload: {
        eventId,
        liked,
        likesCount,
        isOptimistic
    }
});

// Set event likes in bulk (for batch operations)
export const setEventLikes = (likesData) => ({
    type: FETCH_EVENT_LIKES_SUCCESS,
    payload: likesData
});