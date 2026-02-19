import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingMiami() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Miami, FL (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Miami, FL — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the Magic City."
      h1="Best Bowling in Miami, FL (2025)"
      intro="From South Beach to the surrounding neighborhoods, Miami offers excellent bowling options for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Miami"
      state="FL"
      year="2025"
      stateSlug="fl"
      slug="best-bowling-in-miami"
      faqs={[
        {
          q: "What's the cheapest bowling in Miami?",
          a: "Weekday daytime rates are usually lowest. Many Miami bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Miami?",
          a: "Several Miami bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $4-$6 per person.",
        },
        {
          q: "Are there bowling leagues in Miami?",
          a: "Yes! Many Miami bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
