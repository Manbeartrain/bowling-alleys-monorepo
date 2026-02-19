import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingLasVegas() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Las Vegas, NV (2025) | Prices, Hours & Reviews"
      metaDesc="Discover the top bowling alleys in Las Vegas, NV — compare prices, hours, cosmic nights, and leagues for 2025. Find the perfect bowling spot in Sin City."
      h1="Best Bowling in Las Vegas, NV (2025)"
      intro="From the Strip to the suburbs, Las Vegas offers exciting bowling experiences for tourists and locals alike. Whether you're looking for upscale bowling lounges, family-friendly centers, or late-night cosmic sessions, Vegas has it all. Here are the local favorites with pricing, shoe rental, and cosmic details."
      city="Las Vegas"
      state="NV"
      year="2025"
      stateSlug="nv"
      slug="best-bowling-in-las-vegas"
      faqs={[
        {
          q: "What's the cheapest bowling in Las Vegas?",
          a: "Weekday daytime rates are usually lowest. Many Las Vegas bowling alleys offer affordable per-game pricing and shoe specials during off-peak hours. Look for locals' discounts at venues away from the Strip.",
        },
        {
          q: "Where can I find cosmic bowling in Las Vegas?",
          a: "Several Las Vegas bowling alleys run regular cosmic bowling nights with black lights, music, and party atmospheres. Many venues near the Strip offer late-night cosmic sessions. Check individual venue pages for specific schedules.",
        },
        {
          q: "Do I need bowling shoes?",
          a: "Yes, bowling shoes are required at all alleys for safety. Rentals are available at every bowling center, typically around $4-$6 per person.",
        },
        {
          q: "Are there bowling leagues in Las Vegas?",
          a: "Yes! Many Las Vegas bowling alleys host seasonal leagues for all skill levels, including recreational and competitive options. Check venue details for league schedules and how to join.",
        },
        {
          q: "What are the best bowling alleys on the Las Vegas Strip?",
          a: "Several upscale bowling lounges are located on or near the Strip, offering premium experiences with full bars, gourmet food, and VIP lanes. Check our venue listings for Strip-area options.",
        },
      ]}
    />
  );
}
