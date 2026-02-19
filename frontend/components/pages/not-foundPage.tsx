'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import VenueCard from "@/components/VenueCard";
import { getVenues } from "@/lib/firestore";
import { trackEvent } from "@/lib/analytics";
import { Search, Home, MapPin } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("rating");

  const {
    data: venues = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });

  const handleVenueClick = (venueId: string) => {
    // Find venue details for tracking
    const venue = venues.find((v) => v.id === venueId);
    trackEvent("venue_card_click_404", "navigation", venue?.name || venueId);

    router.push(`/venue/${venueId}`);
  };

  const sortedVenues = [...venues].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.avgRating - a.avgRating;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "distance":
        // TODO: Implement geolocation-based distance sorting
        return 0;
      default:
        return 0;
    }
  });

  // Show only top 6 venues on 404 page
  const featuredVenues = sortedVenues.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* 404 Header Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-12 h-12 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We couldn't find what you're looking for
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. But
            don't worry — we've got some great bowling alleys for you to
            discover!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="px-8" data-testid="button-404-home">
                <Home className="w-5 h-5 mr-2" aria-hidden="true" />
                Go Home
              </Button>
            </Link>
            <Link href="/locations">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                data-testid="button-404-locations"
              >
                <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                Find Bowling Alleys
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* City Hub Links Section */}
      <section className="py-16 bg-muted/20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular City Bowling Guides
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive guides for top bowling destinations across the country with detailed venue information, pricing, and local insights.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/best-bowling-in-el-paso">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-el-paso"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">El Paso, Texas</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete guide to bowling alleys in West Texas's largest city
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-charleston-sc">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-charleston"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Charleston, South Carolina</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Historic charm meets modern bowling in the Lowcountry
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-summerville-sc">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-summerville"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Summerville, South Carolina</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Family-friendly bowling in Charleston's charming suburb
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-denver">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-denver"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Denver, Colorado</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mile High bowling with stunning Rocky Mountain views
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-alleys-in-el-cajon">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-el-cajon"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">El Cajon, California</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      San Diego County bowling with year-round sunshine
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-ashburn-va">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-ashburn"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ashburn, Virginia</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Northern Virginia's premier bowling destination
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-atlanta">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-atlanta"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Atlanta, Georgia</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The South's bowling capital with diverse options across the metro
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-houston">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-houston"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Houston, Texas</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Space City bowling with top-rated alleys across Greater Houston
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-chicago">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-chicago"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Chicago, Illinois</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Windy City bowling with diverse options across Chicagoland
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-los-angeles">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-los-angeles"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Los Angeles, California</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      City of Angels bowling from Hollywood to Santa Monica
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-baltimore">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-baltimore"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Baltimore, Maryland</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Charm City bowling with great options across the Baltimore area
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-boston">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-boston"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Boston, Massachusetts</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Beantown bowling with great options across Greater Boston
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-las-vegas">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-las-vegas"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Las Vegas, Nevada</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sin City bowling from the Strip to local neighborhood centers
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-new-york">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-new-york"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">New York City, New York</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Big Apple bowling across Manhattan, Brooklyn, Queens, and the Bronx
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-phoenix">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-phoenix"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Phoenix, Arizona</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Valley of the Sun bowling from Scottsdale to Tempe
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-san-diego">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-san-diego"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">San Diego, California</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      America's Finest City bowling from downtown to the beaches
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-san-francisco">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-san-francisco"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">San Francisco, California</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      City by the Bay bowling from the Mission to the Marina
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-seattle">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-seattle"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Seattle, Washington</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Emerald City bowling from downtown Seattle to the surrounding area
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-miami">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-miami"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Miami, Florida</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Magic City bowling from South Beach to the greater Miami area
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-colorado-springs">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-colorado-springs"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Colorado Springs, Colorado</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Olympic City bowling at the base of Pikes Peak
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/best-bowling-in-dallas-fort-worth">
              <Card
                className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid="link-hub-dallas-fort-worth"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Dallas-Fort Worth, Texas</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Metroplex bowling from uptown Dallas to Fort Worth stockyards
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">Guide Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
          <div className="text-center mt-10">
            <Link href="/locations">
              <Button variant="outline" size="lg" data-testid="button-view-all-cities">
                View All Cities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
