//src/reduxStore/store.jsx

'use client';

import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import { createLogger } from 'redux-logger';
import authReducer from '@/reduxStore/reducers/authReducers';
import cartReducer from '@/reduxStore/reducers/cartReducer';
import eventReducer from '@/reduxStore/reducers/eventReducer';

// We need to dynamically import storage for Next.js client-side only
let storage;

// Custom storage implementation for SSR compatibility
const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: (key, item) => Promise.resolve(item),
    removeItem: () => Promise.resolve()
  };
};

// Initialize storage based on environment
if (typeof window !== 'undefined') {
  storage = require('redux-persist/lib/storage').default;
} else {
  storage = createNoopStorage();
}

// Redux action types for logging
const WATCHED_ACTIONS = {
  UPDATE_USER_IMAGE_SUCCESS: 'UPDATE_USER_IMAGE_SUCCESS',
  SIGN_IN: 'SIGN_IN'
};

// Persistence configurations
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
  debug: process.env.NODE_ENV !== 'production'
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalAmount']
};

const eventPersistConfig = {
  key: 'events',
  storage, 
};


// Redux logger configuration
const createReduxLogger = () => {
  return createLogger({ 
    collapsed: true,
    predicate: (getState, action) => {
      return action.type === WATCHED_ACTIONS.UPDATE_USER_IMAGE_SUCCESS || 
             action.type === WATCHED_ACTIONS.SIGN_IN;
    }
  });
};

// Middleware configuration
const getMiddleware = () => {
  const middleware = [];

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    middleware.push(createReduxLogger());
  }

  return middleware;
};

// Create store with all configurations
const createStore = () => {
  return configureStore({
    reducer: {
      auth: persistReducer(authPersistConfig, authReducer),
      cart: persistReducer(cartPersistConfig, cartReducer),
      event: persistReducer(eventPersistConfig, eventReducer)
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
      }).concat(getMiddleware()),
    devTools: process.env.NODE_ENV !== 'production'
  });
};

// Store singleton initialization
let store = null;
let persistor = null;

// Ensure store is only created on client side
if (typeof window !== 'undefined') {
  store = createStore();
  persistor = persistStore(store);
}

export { store, persistor };

// Helper function to check if we're on client side
export const isClient = typeof window !== 'undefined';
