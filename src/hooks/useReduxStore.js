'use client';

import { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from '../redux/store';
import BrandLoadingComponent from '../components/global/Loading';

// Higher Order Component (HOC) pattern
export default function useReduxStore(Component) {
  // Return a new component that wraps the original component with Redux
  return function WithReduxStore(props) {
    // Add a state to track if we're in the browser
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    // If we're still on the server or hydrating, show a minimal loading state
    if (!isClient) {
      return <BrandLoadingComponent />;
    }

    // Once we're on the client, render the component with Redux
    return (
      <Provider store={store}>
        <PersistGate loading={<BrandLoadingComponent />} persistor={persistor}>
          <Component {...props} />
        </PersistGate>
      </Provider>
    );
  };
}