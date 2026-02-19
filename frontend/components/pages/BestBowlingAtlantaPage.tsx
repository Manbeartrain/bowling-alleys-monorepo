import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingAtlanta() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Atlanta, GA (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Atlanta, GA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot for your next visit."
      h1="Best Bowling in Atlanta, GA (2025)"
      intro="From bustling downtown lanes to family-friendly suburban centers, Atlanta offers exceptional bowling options for all skill levels. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Atlanta"
      state="GA"
      year="2025"
      stateSlug="ga"
      slug="best-bowling-in-atlanta"
      faqs={[
        {
          q: "What's the cheapest bowling in Atlanta?",
          a: "Weekday daytime rates are usually lowest. Many Atlanta bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Atlanta?",
          a: "Several Atlanta bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in Atlanta?",
          a: "Yes! Many Atlanta bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
