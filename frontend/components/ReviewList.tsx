import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import { getVenueReviews, deleteReview, Review } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ReviewListProps {
  venueId: string;
  onWriteReviewClick?: () => void;
}

export default function ReviewList({ venueId, onWriteReviewClick }: ReviewListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingReviews, setDeletingReviews] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = 
    useQuery({
      queryKey: ['venue-reviews', venueId],
      queryFn: async () => {
        const result = await getVenueReviews(venueId, 20); // Get more reviews at once
        return result;
      },
    });

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    setDeletingReviews(prev => {
      const newSet = new Set(prev || []);
      newSet.add(reviewId);
      return newSet;
    });

    try {
      await deleteReview(venueId, user.uid);
      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['venue-reviews', venueId] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      queryClient.invalidateQueries({ queryKey: ['hub-by-slug'] }); // Invalidate all city hub pages
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setDeletingReviews(prev => {
        const newSet = new Set(prev || []);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading reviews. Please try again.</p>
      </div>
    );
  }

  const allReviews: Review[] = data?.reviews || [];
  
  // Filter out reviews that are only ratings (no text content)
  const reviewsWithText = allReviews.filter(review => review.text && review.text.trim().length > 0);

  if (reviewsWithText.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-reviews-state">
        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m3 5l2 2 4-4"></path>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-2">No reviews yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Be the first to write a review for this bowling alley!</p>
        {onWriteReviewClick && (
          <Button 
            onClick={onWriteReviewClick}
            data-testid="button-write-first-review"
          >
            Write a Review
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviewsWithText.map((review) => (
        <div 
          key={review.id} 
          className="border-b border-border pb-6 last:border-b-0"
          data-testid={`review-${review.id}`}
        >
          <div className="flex items-start space-x-4">
            <Avatar data-testid={`avatar-${review.id}`}>
              <AvatarImage src={review.userPhotoURL} />
              <AvatarFallback>
                {review.userDisplayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Username */}
              <div className="flex items-center justify-between mb-1">
                <h4 
                  className="font-semibold text-foreground"
                  data-testid={`text-reviewer-name-${review.id}`}
                >
                  {review.userDisplayName}
                </h4>
                {user?.uid === review.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingReviews.has(review.id)}
                    data-testid={`button-delete-review-${review.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Stars and Date */}
              <div className="flex items-center space-x-3 mb-3">
                <StarRating rating={review.rating} size="sm" />
                <span 
                  className="text-sm text-muted-foreground"
                  data-testid={`text-review-date-${review.id}`}
                >
                  {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                </span>
              </div>
              
              {/* Review Text */}
              <p 
                className="text-foreground break-words overflow-wrap-anywhere leading-relaxed"
                data-testid={`text-review-content-${review.id}`}
              >
                {review.text}
              </p>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}
