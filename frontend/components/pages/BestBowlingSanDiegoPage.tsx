import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingSanDiego() {
  return (
    <CityHubPage
      titleTag="Best Bowling in San Diego, CA (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in San Diego, CA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in America's Finest City."
      h1="Best Bowling in San Diego, CA (2025)"
      intro="From the beaches to downtown, San Diego offers incredible bowling options for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="San Diego"
      state="CA"
      year="2025"
      stateSlug="ca"
      slug="best-bowling-in-san-diego"
      faqs={[
        {
          q: "What's the cheapest bowling in San Diego?",
          a: "Weekday daytime rates are usually lowest. Many San Diego bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in San Diego?",
          a: "Several San Diego bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $4-$6 per person in San Diego.",
        },
        {
          q: "Are there bowling leagues in San Diego?",
          a: "Yes! Many San Diego bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
        {
          q: "What are the best bowling alleys near the beach?",
          a: "San Diego has excellent bowling options throughout the city including areas near Pacific Beach, La Jolla, and Mission Valley. Use our venue listings to find alleys with ratings, prices, and hours.",
        },
      ]}
    />
  );
}
