// src/reduxStore/actions/authActions.js
import axios from 'axios'

import { SIGN_IN,
  SIGN_OUT,
CREATE_EVENT_REQUEST,
CREATE_EVENT_SUCCESS,
CREATE_EVENT_FAILURE,
UPDATE_PROFILE_REQUEST,
UPDATE_PROFILE_SUCCESS,
UPDATE_PROFILE_FAILURE,
UPDATE_USER_IMAGE_SUCCESS,
UPDATE_USER_IMAGE_FAILURE} from '@/reduxStore/constants/actionTypes';


export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user
});

export const signOut = () => ({
  type: SIGN_OUT
});

export const createEvent = (eventData, token) => async (dispatch) => {
//  console.log("EVENTS:", eventData, token);

  dispatch({ type: CREATE_EVENT_REQUEST });

  try {
    const response = await axios.post("/api/auth/dashboard", eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

  //  console.log("API response:", response.data);

    dispatch({
      type: CREATE_EVENT_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error.message);
    dispatch({
      type: CREATE_EVENT_FAILURE,
      payload: error.response?.data || "Event creation failed",
    });

    throw error;
  }
};


// updateProfile action creator
export const updateProfile = (profileData, token) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });

  try {
    const response = await axios.put(
      '/api/auth/dashboard',
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: error.response?.data?.error || 'Profile update failed',
    });
    throw error;
  }
};


export const updateProfileImage = (formData, token) => async (dispatch) => {
  if (!token) {
    console.error("Token not available. User might not be authenticated.");
    throw new Error("User not authenticated.");
  }

//  console.log("Using token for authentication:", token);

  // Log formData keys for debugging
//  for (const pair of formData.entries()) {
  //  console.log(pair[0], pair[1]);
 // }

  try {
    const response = await axios.post(
      '/api/auth/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Add the token here
        },
      }
    );

  //  console.log("API response for profile image update:", response.data);

    const { profileImage } = response.data; // Adjust response structure as needed.

    // Dispatch success with the updated profile image data
    dispatch({
      type: UPDATE_USER_IMAGE_SUCCESS,
      payload: {
        url: profileImage.url,
        publicId: profileImage.publicId,
        uploadedAt: profileImage.uploadedAt,
      },
    });

    return profileImage;
  } catch (error) {
    console.error("Error during profile image update:", error);

    dispatch({
      type: UPDATE_USER_IMAGE_FAILURE,
      payload: error.response?.data?.message || 'Failed to update profile image',
    });

    throw error;
  }
};


