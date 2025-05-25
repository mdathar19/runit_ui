import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      // Don't set up the timer if there's no value
      if (!value) return;

      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      // Cleanup timeout on each value change or unmount
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
};

export default useDebounce;