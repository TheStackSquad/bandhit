//src/reduxStore/store.jsx

'use client'; // Marks this as a client-side component for Next.js

import { configureStore, combineReducers } from '@reduxjs/toolkit'; // Imports Redux Toolkit utilities
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'; // Imports for state persistence across sessions
import { createLogger } from 'redux-logger'; // Development logging tool
import authReducer from '@/reduxStore/reducers/authReducers'; // Authentication state management
import cartReducer from '@/reduxStore/reducers/cartReducer'; // Shopping cart state management
import likesReducer from '@/reduxStore/reducers/likeReducer'; // Likes state management
import eventReducer from '@/reduxStore/reducers/eventReducer'; // Events feature state management
import { reelReducer } from '@/reduxStore/reducers/reelReducers'; // Reels feature state management
import { eventApi } from '@/reduxStore/api/eventsApi'; // RTK Query API for events
import { hubApi } from '@/reduxStore/api/hubApi'; // RTK Query API for hub features
import { reelApi } from '@/reduxStore/api/reelApi'; // RTK Query API for reels
import { likeApi } from '@/reduxStore/api/likeApi'; // RTK Query API for likes
import { eventMetricsApi } from "@/reduxStore/api/eventMetricsApi"; 


// Handle storage differently based on environment (browser vs server)
let storage;

// Provides a non-operational storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null), // Returns empty value when accessed on server
    setItem: (key, item) => Promise.resolve(item), // Pretends to store but doesn't actually persist
    removeItem: () => Promise.resolve() // Pretends to remove but no actual effect
  };
};

// Safely initialize storage based on execution environment
if (typeof window !== 'undefined') {
  storage = require('redux-persist/lib/storage').default; // Use local storage in browser
} else {
  storage = createNoopStorage(); // Use no-op storage on server
}

// Specific action types to watch for detailed logging
const WATCHED_ACTIONS = {
  UPDATE_USER_IMAGE_SUCCESS: 'UPDATE_USER_IMAGE_SUCCESS', // Track profile image updates
  SIGN_IN: 'SIGN_IN' // Track authentication events
};

// Configuration for auth state persistence
const authPersistConfig = {
  key: 'auth', // Storage key for auth data
  storage, // Storage engine (local storage in browser)
  whitelist: ['user', 'isAuthenticated'], // Only persist these specific fields
  debug: process.env.NODE_ENV !== 'production' // Enable debug in development
};

// Configuration for shopping cart persistence
const cartPersistConfig = {
  key: 'cart', // Storage key for cart data
  storage, // Storage engine (local storage in browser)
  whitelist: ['items', 'totalAmount'] // Only persist cart items and total
};

// Configuration for likes state persistence
const likesPersistConfig = {
  key: 'likes',
  storage,
  whitelist: ['likedEvents', 'likesCount'] // Save these values between sessions
};

// Configuration for event metrics data persistence
const eventMetricsPersistConfig = {
  key: 'metrics',
  storage,
  // whitelist: ['data', 'queries'], // Example: persist the fetched data and query states
};

// Configuration for events data persistence
const eventPersistConfig = {
  key: 'events', // Storage key for events data
  storage, // Storage engine (local storage in browser)
};

// Configuration for reels data persistence
const reelPersistConfig = {
  key: 'reels', // Storage key for reels data
  storage, // Storage engine (local storage in browser)
};


// Create a configured logger for development debugging
const createReduxLogger = () => {
  return createLogger({
    collapsed: true, // Collapse action details by default
    predicate: (getState, action) => {
      // Only log specific important actions to reduce noise
      return action.type === WATCHED_ACTIONS.UPDATE_USER_IMAGE_SUCCESS ||
        action.type === WATCHED_ACTIONS.SIGN_IN;
    }
  });
};

// Import websocket middleware for real-time features
import socketMiddleware from '@/reduxStore/middleware/socketMiddleware';

// Prepare custom middleware based on environment
//eslint-disable-next-line no-unused-vars
const getMiddleware = () => {
  const middleware = [];

  // Only add logger in development and browser environment
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    middleware.push(createReduxLogger());
  }

  middleware.push(socketMiddleware); // Add WebSocket support for real-time features

  return middleware;
};

// Performance optimization: Critical reducers loaded first
const essentialReducers = {
  auth: persistReducer(authPersistConfig, authReducer), // Authentication is always needed
  [reelApi.reducerPath]: reelApi.reducer, // Reels API is primary feature
};


// Secondary reducers that can load after essential features
const nonEssentialReducers = {
  cart: persistReducer(cartPersistConfig, cartReducer), // Shopping cart can load later
  likes: persistReducer(likesPersistConfig, likesReducer),
  metrics: persistReducer(eventMetricsPersistConfig, eventMetricsApi.reducer), // If you choose to persist
  event: persistReducer(eventPersistConfig, eventReducer), // Events are secondary feature
  reels: persistReducer(reelPersistConfig, reelReducer), // Local reel state
  [eventApi.reducerPath]: eventApi.reducer, // Events API
  [hubApi.reducerPath]: hubApi.reducer, // Hub API
  [likeApi.reducerPath]: likeApi.reducer, // Add the likeApi reducer
  [eventMetricsApi.reducerPath]: eventMetricsApi.reducer,
};

// Combine all reducers into unified application state
const rootReducer = combineReducers({
  ...essentialReducers, // Priority reducers
  ...nonEssentialReducers, // Secondary reducers
});

// Prioritize middleware for critical features
const essentialMiddleware = [
  reelApi.middleware, // Ensure reels API requests are handled immediately
];

// Secondary middleware for non-critical features
const nonEssentialMiddleware = [
  eventApi.middleware, // Events API requests
  hubApi.middleware, // Hub API requests
  likeApi.middleware,
  eventMetricsApi.middleware
];

// Factory function to create the Redux store with all configurations
const createStore = () => {
  return configureStore({
    reducer: rootReducer, // Combined application state reducer
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore Redux Persist actions in serializable checks
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
      })
        .concat(essentialMiddleware) // Add critical middleware first
        .concat(process.env.NODE_ENV !== 'production' ? createReduxLogger() : []) // Add logger in development
        .concat(nonEssentialMiddleware), // Add secondary middleware last
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  });
};

// Singleton pattern for store instance
let store = null;
let persistor = null;

// Safely initialize store only on client-side
if (typeof window !== 'undefined') {
  store = createStore(); // Create the Redux store
  persistor = persistStore(store); // Create persistence manager
}

// Export store and persistor for application use
export { store, persistor };

// Utility function to check execution environment
export const isClient = typeof window !== 'undefined';