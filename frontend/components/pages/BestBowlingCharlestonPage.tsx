import CityHubPage from "@/components/CityHubPage";

export default function BestBowlingCharleston() {
  return (
    <CityHubPage
      titleTag="Best Bowling in Charleston, SC (2025) | Prices, Hours & Reviews"
      metaDesc="Top bowling in the Charleston area — compare prices, hours, cosmic bowling and leagues. Find the perfect bowling alley for your group or family outing."
      h1="Best Bowling in Charleston, SC (2025)"
      intro="Greater Charleston's bowling scene offers family-friendly lanes and late-night options. Start with these local favorites."
      city="Charleston"
      state="SC"
      year="2025"
      stateSlug="sc"
      slug="best-bowling-in-charleston-sc"
      faqs={[
        {
          q: "Which alley is best for parties near Charleston?",
          a: "Several Charleston-area bowling alleys offer robust party packages with arcade add-ons and cosmic bowling options. Check individual venue pages for party package details and pricing.",
        },
        {
          q: "Where's the most affordable open bowling?",
          a: "Prices vary by day and time. Weeknight open bowling sessions typically offer the best value. Check current specials on individual venue pages.",
        },
        {
          q: "Is there cosmic bowling in Charleston?",
          a: "Yes! Many Charleston-area bowling alleys run weekend cosmic bowling sessions with black lights and music. Confirm times on venue detail pages close to your visit.",
        },
        {
          q: "Do bowling alleys in Charleston have leagues?",
          a: "Yes, several Charleston bowling centers host seasonal leagues for all skill levels and age groups. Visit venue pages to find league schedules.",
        },
      ]}
    />
  );
}
