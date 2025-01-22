// src/reduxStore/store.js
'use client';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
import authReducer from '@/reduxStore/reducers/authReducers';
import cartReducer from '@/reduxStore/reducers/cartReducer';

// Custom storage implementation for Next.js
const createNoopStorage = () => {
  return {
    //eslint-disable-next-line
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
     //eslint-disable-next-line
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalAmount'], // Adjust based on your cart state structure
};

const createStore = () => {
  const middleware = [];

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    middleware.push(createLogger({ collapsed: true }));
  }

  return configureStore({
    reducer: {
      auth: persistReducer(authPersistConfig, authReducer),
      cart: persistReducer(cartPersistConfig, cartReducer),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'persist/REGISTER',
          ],
        },
      }).concat(middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Initialize store with type checking
let store;

if (typeof window !== 'undefined') {
  store = createStore();
} else {
  store = createStore(); // Create a store with noop storage for SSR
}

export { store };
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null;

// Add a helper to check if we're on client side
export const isClient = typeof window !== 'undefined';
