import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "wouter";
import { Bookmark, ArrowLeft, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VenueCard from "@/components/VenueCard";
import { getSavedAlleys } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";

const ITEMS_PER_PAGE = 12;

export default function SavedAlleys() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: savedVenues = [], isLoading } = useQuery({
    queryKey: ["savedAlleys", user?.uid],
    queryFn: () => getSavedAlleys(user!.uid),
    enabled: !!user,
  });

  const handleViewDetails = (venueId: string) => {
    navigate(`/venue/${venueId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Saved Alleys | BowlingAlleys.io</title>
          <meta
            name="description"
            content="View your saved bowling alleys on BowlingAlleys.io"
          />
        </Helmet>

        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="p-12 text-center max-w-md">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign In to View Saved Alleys</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to save your favorite bowling alleys and access them anytime.
            </p>
            <Link href="/">
              <Button data-testid="button-go-home">
                Go to Home
              </Button>
            </Link>
          </Card>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>My Saved Alleys | BowlingAlleys.io</title>
        <meta
          name="description"
          content="View and manage your saved bowling alleys on BowlingAlleys.io"
        />
      </Helmet>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-4"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                My Saved Alleys
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {savedVenues.length > 0
                ? `You have ${savedVenues.length} saved ${savedVenues.length === 1 ? "alley" : "alleys"}`
                : "Save your favorite bowling alleys to access them quickly"}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && savedVenues.length === 0 && (
            <Card className="p-12 text-center">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                No Saved Alleys Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring bowling alleys and save your favorites by clicking
                the "Save" button on any venue page.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button data-testid="button-explore-home">
                    <MapPin className="w-4 h-4 mr-2" />
                    Explore Alleys
                  </Button>
                </Link>
                <Link href="/locations">
                  <Button variant="outline" data-testid="button-browse-locations">
                    Browse by Location
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Saved Venues Grid */}
          {!isLoading && savedVenues.length > 0 && (() => {
            const totalPages = Math.ceil(savedVenues.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedVenues = savedVenues.slice(startIndex, endIndex);

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      onViewDetails={handleViewDetails}
                      showRating={true}
                      data-testid={`saved-venue-${venue.id}`}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-9 h-9"
                          data-testid={`button-page-${page}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

    </div>
  );
}
