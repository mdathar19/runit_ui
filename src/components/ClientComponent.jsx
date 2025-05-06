"use client"

import { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from '../redux/store';
import LoadingComponent from './global/Loading';

// This is the client component that wraps Redux providers
export default function ClientComponent({ children }) {
  // Add a state to track if we're in the browser
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If we're still on the server or hydrating, show a minimal loading state
  if (!isClient) {
    return <LoadingComponent />;
  }

  // Once we're on the client, render the full app with Redux
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}