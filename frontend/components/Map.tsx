'use client';

import { useEffect, useRef } from "react";
import L from "leaflet";
import { Venue } from "@/lib/firestore";

interface MapProps {
  venues: Venue[];
  onVenueClick: (venueId: string) => void;
  className?: string;
}

// Create custom bowling-themed markers with different colors based on rating
const createCustomIcon = (rating: number) => {
  const getMarkerColor = (rating: number) => {
    if (rating >= 4.5) return '#22c55e'; // Green for excellent
    if (rating >= 4.0) return '#3b82f6'; // Blue for very good
    if (rating >= 3.5) return '#f59e0b'; // Orange for good
    if (rating >= 3.0) return '#ef4444'; // Red for fair
    return '#6b7280'; // Gray for poor/no rating
  };
  
  const color = getMarkerColor(rating);
  
  return L.divIcon({
    className: 'custom-marker',
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

export default function Map({ venues, onVenueClick, className }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([31.7619, -106.4850], 11);
    mapInstanceRef.current = map;

    // Add beautiful CartoDB Positron tiles for a cleaner look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    // Add subtle map styling
    map.getContainer().style.borderRadius = '12px';
    map.getContainer().style.overflow = 'hidden';
    map.getContainer().style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each venue
    venues.forEach(venue => {
      // Get coordinates from new or legacy format
      const lat = venue.location?.latitude || venue.lat;
      const lng = venue.location?.longitude || venue.lng;
      
      // Skip venues without valid coordinates
      if (!lat || !lng) {
        return;
      }

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
            </div>
            
            <button 
              onclick="window.handleVenueClick('${venue.id}')" 
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
          </div>
        `, {
          closeButton: true,
          maxWidth: 320,
          className: 'custom-popup'
        })
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Set up global click handler for popup buttons
    (window as any).handleVenueClick = onVenueClick;

    return () => {
      delete (window as any).handleVenueClick;
    };
  }, [venues, onVenueClick]);

  return (
    <div 
      ref={mapRef} 
      className={`${className} relative z-0`}
      data-testid="map-container"
      role="img"
      aria-label="Map indicating locations of bowling alleys for users to discover and review local bowling experiences."
    />
  );
}
