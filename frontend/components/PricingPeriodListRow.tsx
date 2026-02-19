import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Clock, DollarSign, Star } from "lucide-react";
import type { PricingPeriod } from "@/lib/firestore";

interface PricingPeriodListRowProps {
  period: PricingPeriod;
  periodNumber: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function PricingPeriodListRow({
  period,
  periodNumber,
  onEdit,
  onDelete,
}: PricingPeriodListRowProps) {
  // Format days display
  const daysDisplay = () => {
    if (period.days.length === 7) return "Every day";
    if (period.days.length === 0) return "No days";
    
    // Check for weekday/weekend patterns
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weekends = ["Saturday", "Sunday"];
    
    const isWeekdays = period.days.length === 5 && 
      weekdays.every(day => period.days.includes(day));
    const isWeekends = period.days.length === 2 && 
      weekends.every(day => period.days.includes(day));
    
    if (isWeekdays) return "Weekdays";
    if (isWeekends) return "Weekends";
    
    // Otherwise show abbreviated days
    return period.days.map(day => day.slice(0, 3)).join(", ");
  };

  // Format pricing type
  const pricingTypeDisplay = () => {
    switch (period.pricingType) {
      case "per_game": return "per game";
      case "per_person_per_game": return "per person/game";
      case "hourly": return "per hour";
      case "all_you_can_bowl": return "all-you-can-bowl";
      case "package": return "package";
      default: return period.pricingType;
    }
  };

  return (
    <div
      className="flex items-center gap-4 p-4 border rounded-lg hover-elevate"
      data-testid={`pricing-period-row-${periodNumber}`}
    >
      {/* Period Number Badge */}
      <Badge variant="outline" className="shrink-0">
        #{periodNumber}
      </Badge>

      {/* Days */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium">{daysDisplay()}</span>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">
          {period.timeRange || "All day"}
        </span>
      </div>

      {/* Price & Type */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary">
            ${period.price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">
            {pricingTypeDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Badges */}
      <div className="flex flex-wrap gap-2 flex-1">
        {period.isSpecialEvent && (
          <Badge variant="default" className="text-xs">
            Special Event
          </Badge>
        )}
        {period.shoesIncluded && (
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Shoes
          </Badge>
        )}
        {period.conditions && period.conditions.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {period.conditions.length} condition{period.conditions.length > 1 ? "s" : ""}
          </Badge>
        )}
        {period.description && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {period.description}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          data-testid={`button-edit-period-${periodNumber}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          data-testid={`button-delete-period-${periodNumber}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
