// Maps city names to their hub page URLs
// Add new cities here as you create hub pages
export const cityHubMap: Record<string, string> = {
  "el paso": "/best-bowling-in-el-paso",
  "charleston": "/best-bowling-in-charleston-sc",
  "summerville": "/best-bowling-in-summerville-sc",
  "denver": "/best-bowling-in-denver",
  "el cajon": "/best-bowling-alleys-in-el-cajon",
  "atlanta": "/best-bowling-in-atlanta",
  "houston": "/best-bowling-in-houston",
  "baltimore": "/best-bowling-in-baltimore",
  "los angeles": "/best-bowling-in-los-angeles",
  "chicago": "/best-bowling-in-chicago",
  "boston": "/best-bowling-in-boston",
  "las vegas": "/best-bowling-in-las-vegas",
  "new york": "/best-bowling-in-new-york",
  "new york city": "/best-bowling-in-new-york",
  "phoenix": "/best-bowling-in-phoenix",
  "san diego": "/best-bowling-in-san-diego",
  "san francisco": "/best-bowling-in-san-francisco",
  "seattle": "/best-bowling-in-seattle",
  "miami": "/best-bowling-in-miami",
  "colorado springs": "/best-bowling-in-colorado-springs",
  "dallas": "/best-bowling-in-dallas-fort-worth",
  "fort worth": "/best-bowling-in-dallas-fort-worth",
  // Add more cities here:
  // "austin": "/best-bowling-in-austin-tx",
};

// Helper to get hub URL for a city (case-insensitive)
export function getCityHubUrl(city: string | undefined): string | null {
  if (!city) return null;
  const normalizedCity = city.toLowerCase().trim();
  return cityHubMap[normalizedCity] || null;
}

// Helper to check if a city has a hub page
export function hasCityHub(city: string | undefined): boolean {
  return getCityHubUrl(city) !== null;
}
