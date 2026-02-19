import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingElCajon() {
  return (
    <CityHubPage
      titleTag="Best Bowling Alleys in El Cajon, CA (2025) | Prices & Reviews"
      metaDesc="Discover the top bowling alleys in El Cajon, CA — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in the San Diego area."
      h1="Best Bowling Alleys in El Cajon, CA (2025)"
      intro="El Cajon's bowling scene offers family-friendly lanes and competitive leagues in the San Diego area. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="El Cajon"
      state="CA"
      year="2025"
      stateSlug="ca"
      slug="best-bowling-alleys-in-el-cajon"
      faqs={[
        {
          q: "What's the cheapest bowling in El Cajon?",
          a: "Weekday daytime rates are usually lowest. Many El Cajon bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours.",
        },
        {
          q: "Where can I find cosmic bowling in El Cajon?",
          a: "Several El Cajon bowling alleys run regular weekend cosmic bowling nights with black lights and music. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $3-$5 per person.",
        },
        {
          q: "Are there bowling leagues in El Cajon?",
          a: "Yes! Many El Cajon bowling alleys host seasonal leagues for all skill levels. Check venue details for league schedules and how to join.",
        },
      ]}
    />
  );
}
