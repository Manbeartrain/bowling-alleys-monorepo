'use client';

import { useEffect, useRef } from "react";
import L from "leaflet";
import { Venue } from "@/lib/firestore";
import "leaflet/dist/leaflet.css";

interface CityMapProps {
  venues: Venue[];
  onVenueClick?: (venueId: string) => void;
  className?: string;
}

const createCustomIcon = (rating: number) => {
  const getMarkerColor = (rating: number) => {
    if (rating >= 4.5) return '#22c55e';
    if (rating >= 4.0) return '#3b82f6';
    if (rating >= 3.5) return '#f59e0b';
    if (rating >= 3.0) return '#ef4444';
    return '#6b7280';
  };
  
  const color = getMarkerColor(rating);
  
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">
          🎳
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function CityMap({ venues, onVenueClick, className = "h-96 w-full rounded-lg" }: CityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const venuesWithCoords = venues.filter(venue => {
      const lat = venue.location?.latitude || venue.lat;
      const lng = venue.location?.longitude || venue.lng;
      return lat && lng;
    });

    if (venuesWithCoords.length === 0) return;

    // Clean up existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const firstVenue = venuesWithCoords[0];
    const centerLat = firstVenue.location?.latitude || firstVenue.lat!;
    const centerLng = firstVenue.location?.longitude || firstVenue.lng!;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false, // Only zoom with buttons, not scroll
      zoomControl: true // Keep zoom buttons visible
    }).setView([centerLat, centerLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    map.getContainer().style.borderRadius = '12px';
    map.getContainer().style.overflow = 'hidden';
    map.getContainer().style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [venues.length]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    const venuesWithCoords = venues.filter(venue => {
      const lat = venue.location?.latitude || venue.lat;
      const lng = venue.location?.longitude || venue.lng;
      return lat && lng;
    });

    if (venuesWithCoords.length === 0) return;

    const bounds: L.LatLngBoundsExpression = [];

    venuesWithCoords.forEach(venue => {
      const lat = venue.location?.latitude || venue.lat!;
      const lng = venue.location?.longitude || venue.lng!;
      
      bounds.push([lat, lng]);

      const avgRating = venue.avgRating || 0;
      const reviewCount = venue.reviewCount || 0;
      
      const customIcon = createCustomIcon(avgRating);
      
      const marker = L.marker([lat, lng], { icon: customIcon })
        .bindPopup(`
          <div style="
            padding: 16px;
            min-width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          ">
            <div style="margin-bottom: 12px;">
              <h3 style="
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin: 0 0 8px 0;
                line-height: 1.3;
              ">${venue.name}</h3>
              
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; color: #fbbf24; font-size: 16px;">
                  ${'★'.repeat(Math.floor(avgRating))}${'☆'.repeat(5 - Math.floor(avgRating))}
                </div>
                <span style="
                  font-size: 14px;
                  color: #6b7280;
                  font-weight: 500;
                ">${avgRating.toFixed(1)} (${reviewCount} reviews)</span>
              </div>
              
              <p style="
                font-size: 14px;
                color: #6b7280;
                margin: 0 0 12px 0;
                line-height: 1.4;
              ">📍 ${venue.address}</p>
              
              ${venue.lanes ? `
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
                padding: 8px;
                background: #f8fafc;
                border-radius: 8px;
              ">
                <span style="font-size: 14px; color: #4b5563;">🎳 ${venue.lanes} lanes</span>
              </div>
              ` : ''}
            </div>
            
            ${onVenueClick ? `
            <button 
              onclick="window.handleCityVenueClick('${venue.id}')" 
              style="
                width: 100%;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
              "
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)';" 
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(59, 130, 246, 0.2)';"
            >
              View Details & Reviews
            </button>
            ` : ''}
          </div>
        `, {
          closeButton: true,
          maxWidth: 320,
          className: 'custom-popup'
        })
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        mapInstanceRef.current.setView(bounds[0] as L.LatLngExpression, 13);
      } else {
        mapInstanceRef.current.fitBounds(bounds as L.LatLngBoundsLiteral, {
          padding: [50, 50],
          maxZoom: 15
        });
      }
    }

    if (onVenueClick) {
      (window as any).handleCityVenueClick = onVenueClick;
    }

    return () => {
      if (onVenueClick) {
        delete (window as any).handleCityVenueClick;
      }
    };
  }, [venues, onVenueClick]);

  if (venues.length === 0) {
    return null;
  }

  const venuesWithCoords = venues.filter(venue => {
    const lat = venue.location?.latitude || venue.lat;
    const lng = venue.location?.longitude || venue.lng;
    return lat && lng;
  });

  if (venuesWithCoords.length === 0) {
    return null;
  }

  return (
    <div 
      ref={mapRef} 
      className={`${className} relative z-0`}
      data-testid="city-map"
      role="img"
      aria-label={`Map showing ${venuesWithCoords.length} bowling ${venuesWithCoords.length === 1 ? 'alley' : 'alleys'} in this city`}
    />
  );
}
