import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingBaltimore() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Baltimore, MD (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Baltimore, MD — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in Charm City."
      h1="Best Bowling in Baltimore, MD (2025)"
      intro="From the Inner Harbor to the surrounding neighborhoods, Baltimore offers great bowling experiences for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Baltimore"
      state="MD"
      year="2025"
      stateSlug="md"
      slug="best-bowling-in-baltimore"
      faqs={[
        {
          q: "What's the cheapest bowling in Baltimore?",
          a: "Weekday daytime rates are usually lowest. Many Baltimore bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Baltimore?",
          a: "Several Baltimore bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in Baltimore?",
          a: "Yes! Many Baltimore bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
