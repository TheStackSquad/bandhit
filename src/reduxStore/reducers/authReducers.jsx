// src/reduxStore/reducers/authReducer.js
import {
  SIGN_IN,
  SIGN_OUT,
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  CREATE_EVENT_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_USER_IMAGE_SUCCESS,
  UPDATE_USER_IMAGE_FAILURE,
  UPDATE_ARTIST_PROFILE_REQUEST,
  UPDATE_ARTIST_PROFILE_SUCCESS,
  UPDATE_ARTIST_PROFILE_FAILURE,
  UPDATE_VENDOR_PROFILE_REQUEST,
  UPDATE_VENDOR_PROFILE_SUCCESS,
  UPDATE_VENDOR_PROFILE_FAILURE
} from '@/reduxStore/constants/actionTypes';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  events: [],
  // Add new profile states
  artistProfile: null,
  artistProfileLoading: false,
  artistProfileError: null,
  vendorProfile: null,
  vendorProfileLoading: false,
  vendorProfileError: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
 
    case SIGN_IN: { // Added curly braces to create a block scope
      const userData = action.payload.session?.user || action.payload;

      if (userData) {
        return {
          ...state,
          user: {
            _id: userData.id,
            email: userData.email,
            name: userData.user_metadata?.full_name || userData.user_metadata?.name,
            profileImage: {
              url: userData.user_metadata?.picture || userData.user_metadata?.avatar_url,
            },
            // Store provider information for potential provider-specific features
            provider: userData.app_metadata?.provider,
            // Store tokens if available
            accessToken: action.payload.session?.access_token,
            refreshToken: action.payload.session?.refresh_token,
          },
          isAuthenticated: true,
          error: null,
        };
      } else {
        return {
          ...state,
          error: 'Invalid sign-in payload',
        };
      }
    } ;
    case SIGN_OUT: // Handle sign-out action
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    // Artist Profile Cases
    case UPDATE_ARTIST_PROFILE_REQUEST:
      return {
        ...state,
        artistProfileLoading: true,
        artistProfileError: null
      };
    case UPDATE_ARTIST_PROFILE_SUCCESS:
      return {
        ...state,
        artistProfileLoading: false,
        artistProfile: action.payload,
        artistProfileError: null
      };
    case UPDATE_ARTIST_PROFILE_FAILURE:
      return {
        ...state,
        artistProfileLoading: false,
        artistProfileError: action.payload
      };

    // Vendor Profile Cases
    case UPDATE_VENDOR_PROFILE_REQUEST:
      return {
        ...state,
        vendorProfileLoading: true,
        vendorProfileError: null
      };
    case UPDATE_VENDOR_PROFILE_SUCCESS:
      return {
        ...state,
        vendorProfileLoading: false,
        vendorProfile: action.payload,
        vendorProfileError: null
      };
    case UPDATE_VENDOR_PROFILE_FAILURE:
      return {
        ...state,
        vendorProfileLoading: false,
        vendorProfileError: action.payload
      };

    case CREATE_EVENT_REQUEST: // Handle create event request
      return { ...state, loading: true, error: null };
    case CREATE_EVENT_SUCCESS: // Handle create event success
      return {
        ...state,
        loading: false,
        events: [...state.events, action.payload],
        error: null,
      };
    case CREATE_EVENT_FAILURE: // Handle create event failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PROFILE_REQUEST: // Handle profile update request
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PROFILE_SUCCESS: // Handle profile update success
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload, // Update user data
        },
        error: null,
      };
    case UPDATE_PROFILE_FAILURE: // Handle profile update failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_USER_IMAGE_SUCCESS: // Handle user image update success
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: {
            url: action.payload.url,
            publicId: action.payload.publicId,
            uploadedAt: action.payload.uploadedAt,
          },
        },
      };
    case UPDATE_USER_IMAGE_FAILURE: // Handle user image update failure
      return {
        ...state,
        error: action.payload,
      };
    default: // Return current state for other actions
      return state;
  }
};

export default authReducer;