import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingSeattle() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Seattle, WA (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Seattle, WA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the Emerald City."
      h1="Best Bowling in Seattle, WA (2025)"
      intro="From downtown Seattle to the surrounding neighborhoods, the Emerald City offers excellent bowling options for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Seattle"
      state="WA"
      year="2025"
      stateSlug="wa"
      slug="best-bowling-in-seattle"
      faqs={[
        {
          q: "What's the cheapest bowling in Seattle?",
          a: "Weekday daytime rates are usually lowest. Many Seattle bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Seattle?",
          a: "Several Seattle bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $4-$6 per person.",
        },
        {
          q: "Are there bowling leagues in Seattle?",
          a: "Yes! Many Seattle bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
