// Google Analytics hook for javascript_google_analytics blueprint

import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Default/generic titles to ignore - wait for real title
const DEFAULT_TITLES = [
  'Find Bowling Alleys: Reviews & Locations - BowlingAlleys.io',
  'Bowling Alley Details | BowlingAlleys.io',
  'BowlingAlleys.io',
];

export const useAnalytics = () => {
  const [location] = useLocation();
  const lastSentRef = useRef<{ path: string; title: string }>({ path: '', title: '' });
  
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId || typeof window === 'undefined' || !window.gtag) return;
    
    // Function to check and send page view
    const trySendPageView = () => {
      const currentTitle = document.title;
      const isDefaultTitle = DEFAULT_TITLES.includes(currentTitle);
      
      // Don't send if it's a default title (still loading)
      if (isDefaultTitle) return false;
      
      // Don't send if we already sent this exact path+title combo
      if (lastSentRef.current.path === location && lastSentRef.current.title === currentTitle) {
        return true; // Already sent
      }
      
      // Send the page view
      window.gtag('config', measurementId, {
        page_path: location,
        page_title: currentTitle
      });
      
      lastSentRef.current = { path: location, title: currentTitle };
      return true;
    };
    
    // Try immediately
    if (trySendPageView()) return;
    
    // Set up observer to watch for title changes
    const titleElement = document.querySelector('title');
    let observer: MutationObserver | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const cleanup = () => {
      if (observer) observer.disconnect();
      if (checkInterval) clearInterval(checkInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
    
    if (titleElement) {
      observer = new MutationObserver(() => {
        if (trySendPageView()) {
          cleanup();
        }
      });
      
      observer.observe(titleElement, { 
        childList: true, 
        characterData: true,
        subtree: true 
      });
    }
    
    // Also poll every 200ms for title changes (catches async data loading)
    checkInterval = setInterval(() => {
      if (trySendPageView()) {
        cleanup();
      }
    }, 200);
    
    // Final fallback: after 3 seconds, send whatever title we have
    fallbackTimeout = setTimeout(() => {
      const currentTitle = document.title;
      if (lastSentRef.current.path !== location) {
        window.gtag('config', measurementId, {
          page_path: location,
          page_title: currentTitle
        });
        lastSentRef.current = { path: location, title: currentTitle };
      }
      cleanup();
    }, 3000);
    
    return cleanup;
  }, [location]);
};
