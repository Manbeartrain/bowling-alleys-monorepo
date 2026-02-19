import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICING_COLORS } from "@/lib/pricing";
import { Sparkles, Infinity, Star, Package } from "lucide-react";

export function PricingLegend() {
  const legendItems = [
    {
      ...PRICING_COLORS.specialEvent,
      icon: Sparkles,
      description: "Cosmic bowling, theme nights, etc.",
    },
    {
      ...PRICING_COLORS.allYouCanBowl,
      icon: Infinity,
      description: "Bowl as much as you want",
    },
    {
      ...PRICING_COLORS.shoesIncluded,
      icon: Star,
      description: "Shoe rental included in price",
    },
    {
      ...PRICING_COLORS.package,
      icon: Package,
      description: "Bundle deals and packages",
    },
  ];

  return (
    <Card data-testid="pricing-legend">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Pricing Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {legendItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-start gap-3"
              data-testid={`legend-${item.key}`}
            >
              <div
                className={`w-8 h-8 rounded-md ${item.bgClass} border-2 ${item.borderClass} flex items-center justify-center shrink-0`}
              >
                <Icon className={`h-4 w-4 ${item.textClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
