import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied' | null;
}

interface GeolocationContextValue extends GeolocationState {
  requestLocation: () => void;
  clearError: () => void;
}

const GeolocationContext = createContext<GeolocationContextValue | undefined>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    permissionStatus: null,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
          permissionStatus: 'granted',
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('user_location', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        }));
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            setState(prev => ({ ...prev, permissionStatus: 'denied' }));
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Only load cached location on mount - don't automatically request permission
  useEffect(() => {
    // Check if we have a recent location in localStorage
    const stored = localStorage.getItem('user_location');
    if (stored) {
      try {
        const { latitude, longitude, timestamp } = JSON.parse(stored);
        const age = Date.now() - timestamp;
        
        // If location is less than 24 hours old, use it
        if (age < 24 * 60 * 60 * 1000) {
          setState(prev => ({
            ...prev,
            latitude,
            longitude,
            permissionStatus: 'granted',
          }));
          return;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  const value: GeolocationContextValue = {
    ...state,
    requestLocation,
    clearError,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
}

// Haversine formula to calculate distance between two coordinates in miles
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
