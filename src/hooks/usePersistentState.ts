
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

  return [value, setValue];
}

export default usePersistentState;
