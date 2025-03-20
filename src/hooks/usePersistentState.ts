
import { useState, useEffect } from 'react';

/**
 * Hook to persist state between tab focus changes
 * @param key A unique key to identify this state in storage
 * @param initialValue The initial value for the state
 * @returns A stateful value and a function to update it, like useState
 */
export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get stored value from sessionStorage
  const getStoredValue = (): T => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error retrieving stored value:', error);
      return initialValue;
    }
  };

  // State to store our value
  const [value, setValue] = useState<T>(getStoredValue);

  // Save to sessionStorage whenever the state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing value:', error);
    }
  }, [key, value]);

  // Handle visibility change events
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When tab becomes visible again, check if the value was updated in another tab
      if (document.visibilityState === 'visible') {
        try {
          const storedValue = sessionStorage.getItem(key);
          if (storedValue !== null) {
            const parsedValue = JSON.parse(storedValue);
            // Only update if the value is different to avoid unnecessary renders
            if (JSON.stringify(parsedValue) !== JSON.stringify(value)) {
              setValue(parsedValue);
            }
          }
        } catch (error) {
          console.error('Error handling visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add storage event listener to detect changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const newValue = JSON.parse(event.newValue);
          setValue(newValue);
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, value, setValue]);

  return [value, setValue];
}

export default usePersistentState;
