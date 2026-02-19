// Script to generate Next.js route pages from Wouter routes
// This helps migrate all 70+ pages systematically

const routes = [
  { path: '/cosmic-bowling', component: 'CosmicBowlingPage', params: '[[...params]]' },
  { path: '/open-bowling', component: 'OpenBowlingPage', params: '[[...params]]' },
  { path: '/specials', component: 'SpecialsPage', params: '[[...params]]' },
  { path: '/kids-bowling', component: 'KidsBowlingPage', params: '[[...params]]' },
  { path: '/batting-cages', component: 'BattingCagesPage', params: '[[...params]]' },
  { path: '/bowling-birthday-party', component: 'BowlingBirthdayPartyPage', params: '[[...params]]' },
  { path: '/bowling-cost', component: 'BowlingCostPage', params: '[[...params]]' },
  { path: '/experiences', component: 'ExperiencesPage', params: null },
  { path: '/arcade-bowling', component: 'ArcadeBowlingPage', params: '[[...params]]' },
  { path: '/bowling-lessons', component: 'BowlingLessonsPage', params: '[[...params]]' },
  { path: '/senior-bowling', component: 'SeniorBowlingPage', params: '[[...params]]' },
  { path: '/corporate-events', component: 'CorporateEventsPage', params: '[[...params]]' },
  { path: '/bowling-restaurant', component: 'BowlingRestaurantPage', params: '[[...params]]' },
  { path: '/bowling-bar', component: 'BowlingBarPage', params: '[[...params]]' },
  { path: '/sports-bar', component: 'SportsBarPage', params: '[[...params]]' },
  { path: '/snack-bar', component: 'SnackBarPage', params: '[[...params]]' },
  { path: '/bowling-billiards', component: 'BowlingBilliardsPage', params: '[[...params]]' },
  { path: '/ping-pong', component: 'BowlingPingPongPage', params: '[[...params]]' },
  { path: '/pro-shop', component: 'ProShopPage', params: '[[...params]]' },
  { path: '/laser-tag', component: 'LaserTagPage', params: '[[...params]]' },
  { path: '/karaoke-bowling', component: 'KaraokeBowlingPage', params: '[[...params]]' },
  { path: '/duckpin-bowling', component: 'DuckpinBowlingPage', params: '[[...params]]' },
  { path: '/candlepin-bowling', component: 'CandlepinBowlingPage', params: '[[...params]]' },
  { path: '/wheelchair-accessible', component: 'WheelchairAccessiblePage', params: '[[...params]]' },
  { path: '/escape-rooms', component: 'EscapeRoomsPage', params: '[[...params]]' },
  { path: '/tournaments', component: 'TournamentsPage', params: '[[...params]]' },
  { path: '/team', component: 'TeamPage', params: null },
  { path: '/team-logo-lab', component: 'TeamLogoLabPage', params: null },
  { path: '/profile', component: 'ProfilePage', params: null },
  { path: '/owner', component: 'OwnerPage', params: null },
  { path: '/founding-partners', component: 'FoundingPartnersPage', params: null },
  { path: '/pitch-deck', component: 'PitchDeckPage', params: null },
];

// This script would generate the route files
// For now, we'll create them manually for the most important ones

