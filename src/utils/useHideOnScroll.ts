
import { useState, useEffect, useRef } from 'react';

export const useHideOnScroll = (threshold: number = 10, ignoreProgrammaticMs: number = 0) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Skip scroll handling within the programmatic ignore period
      if (ignoreProgrammaticMs > 0 && Date.now() - mountTimeRef.current < ignoreProgrammaticMs) {
        return;
      }
      
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, threshold, ignoreProgrammaticMs]);

  return isVisible;
};
