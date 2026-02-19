import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Sparkles } from "lucide-react";
import {
  DayPricingMap,
  PricingPeriodWithMetadata,
  WEEKDAY_ORDER,
  getPricingTypeLabel,
  PRICING_COLORS,
} from "@/lib/pricing";

interface PricingAccordionProps {
  dayMap: DayPricingMap;
}

export function PricingAccordion({ dayMap }: PricingAccordionProps) {
  const daysWithPricing = WEEKDAY_ORDER.filter((day) => dayMap[day].length > 0);

  if (daysWithPricing.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No pricing information available
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full" data-testid="pricing-accordion">
      {WEEKDAY_ORDER.map((day) => {
        const periods = dayMap[day];
        if (periods.length === 0) return null;
        
        return (
          <AccordionItem key={day} value={day} data-testid={`pricing-accordion-${day}`}>
            <AccordionTrigger 
              className="hover:no-underline"
              data-testid={`pricing-accordion-trigger-${day}`}
            >
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-semibold">{day}</span>
                <span className="text-sm text-muted-foreground">
                  {periods.length} {periods.length === 1 ? "rate" : "rates"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {periods.map((period) => {
                  const colorInfo = Object.values(PRICING_COLORS).find(c => c.key === period.colorKey) || PRICING_COLORS.default;
                  
                  return (
                  <Card
                    key={period.id}
                    className={`${colorInfo.bgClass} ${colorInfo.borderClass} ${period.colorKey !== 'default' ? 'border-2' : 'border'}`}
                    data-testid={`pricing-accordion-card-${period.id}`}
                  >
                    <CardContent className={`p-4 space-y-3 ${colorInfo.textClass}`}>
                      {period.timeRange && (
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <Clock className="h-4 w-4" />
                          <span>{period.timeRange}</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">${period.price.toFixed(2)}</span>
                        <span className="text-sm opacity-80">
                          {getPricingTypeLabel(period.pricingType)}
                        </span>
                      </div>

                      {(period.isSpecialEvent || period.shoesIncluded || period.pricingType === "all_you_can_bowl") && (
                        <div className="flex flex-wrap gap-1.5">
                          {period.isSpecialEvent && (
                            <Badge variant="default" className="gap-1" data-testid="pricing-accordion-special">
                              <Sparkles className="h-3 w-3" />
                              Special Event
                            </Badge>
                          )}
                          {period.shoesIncluded && (
                            <Badge variant="secondary" data-testid="pricing-accordion-shoes">
                              Shoes Included
                            </Badge>
                          )}
                          {period.pricingType === "all_you_can_bowl" && (
                            <Badge variant="secondary" data-testid="pricing-accordion-unlimited">
                              Unlimited Bowling
                            </Badge>
                          )}
                        </div>
                      )}

                      {period.description && (
                        <p className="text-sm opacity-80 leading-relaxed">
                          {period.description}
                        </p>
                      )}

                      {period.conditions && period.conditions.length > 0 && (
                        <p className="text-sm opacity-80">
                          {period.conditions.join(" • ")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
