import React, { useState, useRef, useEffect } from 'react';

type Screen = 'home' | 'search' | 'report';

export const useNavigationWithLoading = (initialScreen: Screen = 'home') => {
  const [activeScreen, setActiveScreen] = useState<Screen>(initialScreen);
  const [isLoading, setIsLoading] = useState(false);
  const pendingTimeoutRef = useRef<number | null>(null);

  const navigate = (screen: Screen) => {
    setIsLoading(true);
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }
    pendingTimeoutRef.current = setTimeout(() => {
      setActiveScreen(screen);
      setIsLoading(false);
      pendingTimeoutRef.current = null;
    }, 500) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  return { activeScreen, isLoading, navigate };
};