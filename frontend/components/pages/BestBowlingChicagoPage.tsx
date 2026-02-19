import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingChicago() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Chicago, IL (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Chicago, IL — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the Windy City."
      h1="Best Bowling in Chicago, IL (2025)"
      intro="From downtown Chicago to the neighborhoods, the Windy City offers excellent bowling options for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Chicago"
      state="IL"
      year="2025"
      stateSlug="il"
      slug="best-bowling-in-chicago"
      faqs={[
        {
          q: "What's the cheapest bowling in Chicago?",
          a: "Weekday daytime rates are usually lowest. Many Chicago bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Chicago?",
          a: "Several Chicago bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in Chicago?",
          a: "Yes! Many Chicago bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
