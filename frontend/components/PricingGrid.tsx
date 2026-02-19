import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles } from "lucide-react";
import {
  DayPricingMap,
  PricingPeriodWithMetadata,
  WEEKDAY_ORDER,
  getPricingTypeLabel,
  PRICING_COLORS,
} from "@/lib/pricing";

interface PricingGridProps {
  dayMap: DayPricingMap;
}

export function PricingGrid({ dayMap }: PricingGridProps) {
  return (
    <div className="grid grid-cols-7 gap-2" data-testid="pricing-grid">
      {WEEKDAY_ORDER.map((day) => (
        <div key={day} className="flex flex-col gap-2">
          <div
            className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b"
            data-testid={`pricing-day-header-${day}`}
          >
            <h3 className="text-sm font-semibold text-center">{day.slice(0, 3)}</h3>
          </div>
          
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
            {dayMap[day].length === 0 ? (
              <div className="text-xs text-center text-muted-foreground py-4">
                No pricing
              </div>
            ) : (
              dayMap[day].map((period) => (
                <PricingCard key={period.id} period={period} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingCard({ period }: { period: PricingPeriodWithMetadata }) {
  const colorInfo = Object.values(PRICING_COLORS).find(c => c.key === period.colorKey) || PRICING_COLORS.default;
  
  return (
    <Card
      className={`${colorInfo.bgClass} ${colorInfo.borderClass} ${period.colorKey !== 'default' ? 'border-2' : 'border'} shadow-sm hover:shadow-md transition-shadow`}
      data-testid={`pricing-card-${period.id}`}
    >
      <CardContent className={`p-3 space-y-2 ${colorInfo.textClass}`}>
        {period.timeRange && (
          <div className="flex items-center gap-1 text-xs" data-testid="pricing-card-time">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{period.timeRange}</span>
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold" data-testid="pricing-card-price">
            ${period.price.toFixed(2)}
          </div>
          <div className="text-xs opacity-80">
            {getPricingTypeLabel(period.pricingType)}
          </div>
        </div>

        {(period.isSpecialEvent || period.shoesIncluded || period.pricingType === "all_you_can_bowl") && (
          <div className="flex flex-wrap gap-1">
            {period.isSpecialEvent && (
              <Badge variant="default" className="text-xs h-5 gap-1" data-testid="pricing-card-special-event">
                <Sparkles className="h-3 w-3" />
                Special
              </Badge>
            )}
            {period.shoesIncluded && (
              <Badge variant="secondary" className="text-xs h-5" data-testid="pricing-card-shoes">
                Shoes
              </Badge>
            )}
            {period.pricingType === "all_you_can_bowl" && (
              <Badge variant="secondary" className="text-xs h-5" data-testid="pricing-card-unlimited">
                Unlimited
              </Badge>
            )}
          </div>
        )}

        {period.description && (
          <p className="text-xs opacity-80 leading-relaxed" data-testid="pricing-card-description">
            {period.description}
          </p>
        )}

        {period.conditions && period.conditions.length > 0 && (
          <div className="text-xs opacity-80">
            {period.conditions.join(" • ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
