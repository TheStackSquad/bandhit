// src/reduxStore/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/reduxStore/reducers/authReducers';
import { createLogger } from 'redux-logger';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

// Create store with type safety
const createStore = () => {
  const middleware = [];
  
  // Only add logger in development and client-side
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    middleware.push(createLogger({ collapsed: true }));
  }

  return configureStore({
    reducer: {
      auth: persistReducer(authPersistConfig, authReducer),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Ensure store is only created on the client side
let store;
if (typeof window !== 'undefined') {
  store = createStore();
}

export { store };
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null;

