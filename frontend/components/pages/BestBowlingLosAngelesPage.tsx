import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingLosAngeles() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Los Angeles, CA (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Los Angeles, CA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the City of Angels."
      h1="Best Bowling in Los Angeles, CA (2025)"
      intro="From Hollywood to Santa Monica, Los Angeles offers diverse bowling experiences for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Los Angeles"
      state="CA"
      year="2025"
      stateSlug="ca"
      slug="best-bowling-in-los-angeles"
      faqs={[
        {
          q: "What's the cheapest bowling in Los Angeles?",
          a: "Weekday daytime rates are usually lowest. Many Los Angeles bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Los Angeles?",
          a: "Several Los Angeles bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in Los Angeles?",
          a: "Yes! Many Los Angeles bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
