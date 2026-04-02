
"use client";

import { useCallback, useRef, useEffect } from 'react';

/**
 * Creates a debounced version of a callback function that will only be executed
 * after a specified delay has passed without any new calls.
 *
 * @param callback The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A debounced version of the callback function.
 */
export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  delay: number
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update ref to the latest callback function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // The debounced callback
  return useCallback(
    (...args: A) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
