import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StarRating from "./StarRating";
import { createOrUpdateReview, getUserReviewForVenue } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

interface ReviewFormProps {
  venueId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewForm({ venueId, isOpen, onClose }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  // Check if user has existing review
  const { data: existingReview } = useQuery({
    queryKey: ['user-review', venueId, user?.uid],
    queryFn: () => user ? getUserReviewForVenue(venueId, user.uid) : null,
    enabled: !!user && isOpen,
  });

  // Pre-fill form with existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setText(existingReview.text || "");
    } else {
      setRating(0);
      setText("");
    }
  }, [existingReview]);

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      if (rating === 0) throw new Error("Please select a rating");

      await createOrUpdateReview(
        venueId,
        user.uid,
        user.displayName || "Anonymous",
        user.photoURL || undefined,
        rating,
        text.trim() || undefined // Pass undefined if empty
      );
    },
    onSuccess: () => {
      // Track review submission
      trackEvent(existingReview ? 'review_updated' : 'review_submitted', 'engagement', 'review_form', rating);
      
      toast({
        title: "Success",
        description: existingReview ? "Review updated successfully!" : "Review submitted successfully!",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['venue-reviews', venueId] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      queryClient.invalidateQueries({ queryKey: ['user-review', venueId, user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['hub-by-slug'] }); // Invalidate all city hub pages
      
      onClose();
      setRating(0);
      setText("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewMutation.mutate();
  };

  const getRatingText = (rating: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || 'Click to rate';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="review-modal">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Rating
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
                data-testid="star-rating-input"
              />
              <span 
                className="text-sm text-muted-foreground"
                data-testid="text-rating-label"
              >
                {getRatingText(rating)}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label 
              htmlFor="review-text" 
              className="block text-sm font-medium text-foreground mb-2"
            >
              Your Review <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Share your experience at this bowling alley... (or just leave a star rating!)"
              data-testid="textarea-review-text"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add a written review or just submit your star rating
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={submitReviewMutation.isPending || rating === 0}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-submit-review"
            >
              {submitReviewMutation.isPending 
                ? "Submitting..." 
                : existingReview 
                  ? "Update Review" 
                  : "Submit Review"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
