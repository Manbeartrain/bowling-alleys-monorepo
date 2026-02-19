export interface PricingPeriod {
  id: string;
  days: string[];
  timeRange?: string;
  price: number;
  pricingType: "per_game" | "per_person_per_game" | "hourly" | "all_you_can_bowl" | "package";
  isSpecialEvent?: boolean;
  shoesIncluded?: boolean;
  conditions?: string[];
  description?: string;
}

export interface PricingPeriodWithMetadata extends PricingPeriod {
  colorClass: string;
  colorKey: string;
  startTime?: number;
}

export interface DayPricingMap {
  Monday: PricingPeriodWithMetadata[];
  Tuesday: PricingPeriodWithMetadata[];
  Wednesday: PricingPeriodWithMetadata[];
  Thursday: PricingPeriodWithMetadata[];
  Friday: PricingPeriodWithMetadata[];
  Saturday: PricingPeriodWithMetadata[];
  Sunday: PricingPeriodWithMetadata[];
}

export const WEEKDAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const PRICING_COLORS = {
  specialEvent: {
    key: "specialEvent",
    label: "Special Event",
    bgClass: "bg-purple-100 dark:bg-purple-950/30",
    borderClass: "border-purple-300 dark:border-purple-800",
    textClass: "text-purple-900 dark:text-purple-100",
  },
  allYouCanBowl: {
    key: "allYouCanBowl",
    label: "All-You-Can-Bowl",
    bgClass: "bg-blue-100 dark:bg-blue-950/30",
    borderClass: "border-blue-300 dark:border-blue-800",
    textClass: "text-blue-900 dark:text-blue-100",
  },
  shoesIncluded: {
    key: "shoesIncluded",
    label: "Shoes Included",
    bgClass: "bg-green-100 dark:bg-green-950/30",
    borderClass: "border-green-300 dark:border-green-800",
    textClass: "text-green-900 dark:text-green-100",
  },
  package: {
    key: "package",
    label: "Package Deal",
    bgClass: "bg-amber-100 dark:bg-amber-950/30",
    borderClass: "border-amber-300 dark:border-amber-800",
    textClass: "text-amber-900 dark:text-amber-100",
  },
  default: {
    key: "default",
    label: "Standard Pricing",
    bgClass: "bg-card",
    borderClass: "border-border",
    textClass: "text-foreground",
  },
} as const;

export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

export function getPricingColor(period: PricingPeriod): typeof PRICING_COLORS[keyof typeof PRICING_COLORS] {
  if (period.isSpecialEvent) return PRICING_COLORS.specialEvent;
  if (period.pricingType === "all_you_can_bowl") return PRICING_COLORS.allYouCanBowl;
  if (period.shoesIncluded) return PRICING_COLORS.shoesIncluded;
  if (period.pricingType === "package") return PRICING_COLORS.package;
  return PRICING_COLORS.default;
}

export function groupPeriodsByDay(periods: PricingPeriod[]): DayPricingMap {
  const dayMap: DayPricingMap = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  periods.forEach((period) => {
    const color = getPricingColor(period);
    const startTime = period.timeRange 
      ? parseTimeToMinutes(period.timeRange.split("-")[0]?.trim() || "") 
      : null;

    const periodWithMetadata: PricingPeriodWithMetadata = {
      ...period,
      colorClass: color.bgClass,
      colorKey: color.key,
      startTime: startTime ?? undefined,
    };

    period.days.forEach((day) => {
      const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      if (normalizedDay in dayMap) {
        dayMap[normalizedDay as keyof DayPricingMap].push({ ...periodWithMetadata });
      }
    });
  });

  WEEKDAY_ORDER.forEach((day) => {
    dayMap[day].sort((a, b) => {
      if (a.startTime === undefined && b.startTime === undefined) return 0;
      if (a.startTime === undefined) return 1;
      if (b.startTime === undefined) return -1;
      return a.startTime - b.startTime;
    });
  });

  return dayMap;
}

export function getPricingTypeLabel(pricingType: PricingPeriod["pricingType"]): string {
  switch (pricingType) {
    case "per_game":
      return "per game";
    case "per_person_per_game":
      return "per person per game";
    case "hourly":
      return "per hour";
    case "all_you_can_bowl":
      return "all-you-can-bowl";
    case "package":
      return "package";
    default:
      return pricingType;
  }
}
