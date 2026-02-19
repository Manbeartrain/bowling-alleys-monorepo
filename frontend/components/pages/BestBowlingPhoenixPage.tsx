import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingPhoenix() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Phoenix, AZ (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Phoenix, AZ — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the Valley of the Sun."
      h1="Best Bowling in Phoenix, AZ (2025)"
      intro="From Scottsdale to Tempe, the Greater Phoenix area offers fantastic bowling options for families, leagues, and casual bowlers. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Phoenix"
      state="AZ"
      year="2025"
      stateSlug="az"
      slug="best-bowling-in-phoenix"
      faqs={[
        {
          q: "What's the cheapest bowling in Phoenix?",
          a: "Weekday daytime rates are usually lowest. Many Phoenix-area bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in Phoenix?",
          a: "Several Phoenix bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $4-$7 per person in Phoenix.",
        },
        {
          q: "Are there bowling leagues in Phoenix?",
          a: "Yes! Many Phoenix-area bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
        {
          q: "What are the best bowling alleys in Scottsdale?",
          a: "Scottsdale and the East Valley have several excellent bowling options. Use our venue listings to find alleys with ratings, prices, and hours.",
        },
      ]}
    />
  );
}
