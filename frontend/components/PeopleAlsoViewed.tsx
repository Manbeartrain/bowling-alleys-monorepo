import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VenueCard from "@/components/VenueCard";
import { getVenuesByProximity, VenueWithDistance } from "@/lib/firestore";

interface PeopleAlsoViewedProps {
  latitude: number;
  longitude: number;
  excludeVenueId?: string;
  maxResults?: number;
  radiusMiles?: number;
  title?: string;
}

export default function PeopleAlsoViewed({
  latitude,
  longitude,
  excludeVenueId,
  maxResults = 9,
  radiusMiles = 25,
  title = "People Also Viewed",
}: PeopleAlsoViewedProps) {
  const [venues, setVenues] = useState<VenueWithDistance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNearbyVenues = async () => {
      if (!latitude || !longitude) {
        return;
      }

      setLoading(true);
      try {
        const proximityVenues = await getVenuesByProximity(
          latitude,
          longitude,
          radiusMiles,
        );

        // Filter out excluded venue and limit results
        const filteredVenues = proximityVenues
          .filter((v) => v.id !== excludeVenueId)
          .slice(0, maxResults);

        setVenues(filteredVenues);
      } catch (error) {
        console.error("Error fetching nearby venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyVenues();
  }, [latitude, longitude, excludeVenueId, maxResults, radiusMiles]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-8">{title}</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading venues...</div>
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-bold text-foreground"
          data-testid="heading-people-also-viewed"
        >
          {title}
        </h2>

        {/* Navigation Arrows */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const container = document.getElementById(
                "venues-scroll-container",
              );
              if (container) {
                container.scrollBy({ left: -320, behavior: "smooth" });
              }
            }}
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const container = document.getElementById(
                "venues-scroll-container",
              );
              if (container) {
                container.scrollBy({ left: 320, behavior: "smooth" });
              }
            }}
            data-testid="button-scroll-right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Venue Cards - Horizontal Scroll */}
      <div className="mb-8">
        <div
          id="venues-scroll-container"
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="flex-none w-96"
              data-testid={`venue-card-${venue.id}`}
            >
              <VenueCard
                venue={venue}
                onViewDetails={(venueId) => {
                  window.location.href = `/venue/${venueId}`;
                }}
                showRating={true}
                showPrice={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
