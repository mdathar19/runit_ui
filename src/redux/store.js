import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import customStorage from './customStorage';

import compilerReducer from './slices/compilerSlice';
import editorReducer from './slices/editorSlice';
import authReducer from './slices/authSlice';
import socketMiddleware from './middleware/socketMiddleware';
import portfolioReducer from './slices/portfolioSlice';

const persistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: ['code', 'deviceInfo', 'activeTab', 'editor', 'auth'],
};

const rootReducer = combineReducers({
  compiler: compilerReducer,
  editor: editorReducer,
  auth: authReducer,
  portfolio: portfolioReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// We need to check if we're in a browser environment before creating the store
// to avoid issues during server-side rendering
const createStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredPaths: ['compiler.cursorPosition'],
        },
      }).concat(socketMiddleware()),
    devTools: process.env.NODE_ENV !== 'production',
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

// For client-side only
let storeInstance;

export const getStoreInstance = () => {
  if (typeof window === 'undefined') {
    // Server-side - create a new store
    return createStore();
  }
  
  // Client-side - create store once and reuse
  if (!storeInstance) {
    storeInstance = createStore();
  }
  
  return storeInstance;
};

export const { store, persistor } = getStoreInstance();

export default { store, persistor };