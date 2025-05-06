"use client"

import { useEffect, useState } from 'react';
import JsCompiler from "@/activePages/JsCompiler";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from '../redux/store';

const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2>Loading...</h2>
  </div>
);

export default function Home() {
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
        <JsCompiler />
      </PersistGate>
    </Provider>
  );
}