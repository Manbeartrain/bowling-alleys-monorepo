import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({ 
  rating, 
  size = "md", 
  interactive = false, 
  onRatingChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-8 h-8"
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= Math.floor(rating);
    const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 >= 0.5;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(starValue)}
        className={cn(
          sizeClasses[size],
          interactive && "hover:scale-110 transition-transform cursor-pointer",
          !interactive && "cursor-default"
        )}
        data-testid={`star-${index + 1}`}
      >
        <Star
          className={cn(
            "w-full h-full transition-colors",
            isFilled || isHalfFilled 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-gray-300 text-gray-300",
            interactive && "hover:fill-yellow-400 hover:text-yellow-400"
          )}
        />
      </button>
    );
  });

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {stars}
    </div>
  );
}
