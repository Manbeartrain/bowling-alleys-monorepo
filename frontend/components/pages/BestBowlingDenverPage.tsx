import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingDenver() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Denver, CO (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Denver, CO — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot for your next visit."
      h1="Best Bowling in Denver, CO (2025)"
      intro="From downtown lanes to suburban bowling centers, Denver offers excellent options for bowlers of all levels. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Denver"
      state="CO"
      year="2025"
      stateSlug="co"
      slug="best-bowling-in-denver"
      faqs={[
        {
          q: "What's the cheapest bowling in Denver?",
          a: "Weekday daytime rates are usually lowest. Many Denver bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Denver?",
          a: "Several Denver bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in Denver?",
          a: "Yes! Many Denver bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
