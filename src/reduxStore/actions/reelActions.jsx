// src/reduxStore/actions/reelActions.js

import { REEL_ACTION_TYPES } from '@/reduxStore/constants/actionTypes';
import { handleReelUpload } from '@/utils/reelUtils/reelUtils';

import { isCriticalError } from '@/components/utilsDir/errorUtils';

export const reelActions = {
    // Only store the final uploaded reel
    addReel: (reelData) => ({
        type: REEL_ACTION_TYPES.ADD_REEL,
        payload: reelData
    }),

    // Only store errors that need global handling
    setError: (error) => ({
        type: REEL_ACTION_TYPES.SET_ERROR,
        payload: error
    })
};

// Thunk handles upload but only dispatches final state
export const uploadReel = (file, componentSetters, metadata) => async (dispatch) => {
    const { setUploadProgress } = componentSetters;
    const { caption, accessToken } = metadata;

    try {
        const response = await handleReelUpload(
            file,
            {
                ...componentSetters,
                setUploadProgress: (progress) => {
                    setUploadProgress(progress); // Local UI update
                }
            },
            {
                caption,
                accessToken
            }
        );

        dispatch(reelActions.addReel(response));
        return response; // Allow component to handle success UI
    } catch (error) {
        if (isCriticalError(error)) {
            dispatch(reelActions.setError(error.message));
        }
        throw error; // Let component handle error display
    }
};