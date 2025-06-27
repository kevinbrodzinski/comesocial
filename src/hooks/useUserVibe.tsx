
import { useState, useEffect } from 'react';
import { UserVibe, Vibe, createVibeExpiry, isVibeExpired } from '@/types/vibeTypes';

export const useUserVibe = () => {
  const [currentVibe, setCurrentVibe] = useState<UserVibe | null>(null);

  // Load vibe from localStorage on mount
  useEffect(() => {
    const storedVibe = localStorage.getItem('userVibe');
    if (storedVibe) {
      try {
        const parsedVibe: UserVibe = JSON.parse(storedVibe);
        if (!isVibeExpired(parsedVibe)) {
          setCurrentVibe(parsedVibe);
        } else {
          localStorage.removeItem('userVibe');
        }
      } catch (error) {
        console.error('Error parsing stored vibe:', error);
        localStorage.removeItem('userVibe');
      }
    }
  }, []);

  // Check for expiry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentVibe && isVibeExpired(currentVibe)) {
        setCurrentVibe(null);
        localStorage.removeItem('userVibe');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentVibe]);

  const setVibe = (vibe: Vibe, customText?: string) => {
    const userVibe: UserVibe = {
      vibe,
      customText,
      setAt: new Date().toISOString(),
      expiresAt: createVibeExpiry()
    };

    setCurrentVibe(userVibe);
    localStorage.setItem('userVibe', JSON.stringify(userVibe));
  };

  const clearVibe = () => {
    setCurrentVibe(null);
    localStorage.removeItem('userVibe');
  };

  return {
    currentVibe,
    setVibe,
    clearVibe,
    hasActiveVibe: currentVibe && !isVibeExpired(currentVibe)
  };
};
