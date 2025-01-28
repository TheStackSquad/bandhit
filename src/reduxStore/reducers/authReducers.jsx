// src/reduxStore/reducers/authReducer.js
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


const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  events: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: {
          _id: action.payload._id,
          role: action.payload.role,
          email: action.payload.email,
          name: action.payload.name,
          city: action.payload.city,
          phone: action.payload.phone,
          // Match the MongoDB schema structure for profileImage
          profileImage: action.payload.profileImage ? {
            url: action.payload.profileImage.url,
            publicId: action.payload.profileImage.publicId,
            uploadedAt: action.payload.profileImage.uploadedAt
          } : null,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        },
        isAuthenticated: true,
        error: null,
      };
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
      case CREATE_EVENT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_EVENT_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        events: [...state.events, action.payload],
        error: null

      }
     
    case CREATE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

   
    // Profile update cases
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload // Update user data, including profileImage
        },
        error: null
      };
    
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      case UPDATE_USER_IMAGE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: {
            url: action.payload.url,
            publicId: action.payload.publicId,
            uploadedAt: action.payload.uploadedAt
          }
        }
      };
      
      case UPDATE_USER_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload
        };

    default:
      return state;
  }
};

export default authReducer;