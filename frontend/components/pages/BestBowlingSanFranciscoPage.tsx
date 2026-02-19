import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingSanFrancisco() {
  return (
    <CityHubPage
      titleTag="Best Bowling in San Francisco, CA (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in San Francisco, CA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the City by the Bay."
      h1="Best Bowling in San Francisco, CA (2025)"
      intro="From the Mission to the Marina, San Francisco offers unique bowling experiences for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="San Francisco"
      state="CA"
      year="2025"
      stateSlug="ca"
      slug="best-bowling-in-san-francisco"
      faqs={[
        {
          q: "What's the cheapest bowling in San Francisco?",
          a: "Weekday daytime rates are usually lowest. Many SF bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in San Francisco?",
          a: "Several San Francisco bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $5-$8 per person in San Francisco.",
        },
        {
          q: "Are there bowling leagues in San Francisco?",
          a: "Yes! Many SF bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
        {
          q: "What are the best bowling alleys near downtown San Francisco?",
          a: "San Francisco has several excellent bowling options near downtown and SOMA. Use our venue listings to find alleys with ratings, prices, and hours.",
        },
      ]}
    />
  );
}
