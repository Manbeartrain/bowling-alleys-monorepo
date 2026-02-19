# Next.js Migration Status

## Completed ✅

1. **Infrastructure Setup**
   - ✅ Next.js project structure created
   - ✅ Tailwind config migrated
   - ✅ TypeScript config set up
   - ✅ API client created (works with both server and client)
   - ✅ Firebase Auth setup (client-side only)
   - ✅ Query Client provider created
   - ✅ Auth provider created
   - ✅ Root layout with providers

2. **API Endpoints**
   - ✅ All venue endpoints created
   - ✅ All review endpoints created
   - ✅ All user endpoints created
   - ✅ All saved alleys endpoints created
   - ✅ All suggestions, pricing, amenities, hubs endpoints created
   - ✅ CORS configured on Express API
   - ✅ Vite integration removed from Express

3. **Frontend Migration**
   - ✅ Firestore operations replaced with API client calls
   - ✅ API client supports both server and client components
   - ✅ Essential files copied (hooks, UI components, firestore.ts)
   - ✅ Blog content copied
   - ✅ Public assets copied

4. **Routes Created** (26/70)
   - ✅ Home (/)
   - ✅ Venue Detail (/venue/[id])
   - ✅ Locations (/locations/[[...params]])
   - ✅ Blog List (/blog)
   - ✅ Blog Post (/blog/[slug])
   - ✅ About (/about)
   - ✅ Contact (/contact)
   - ✅ Terms (/terms)
   - ✅ Privacy (/privacy)
   - ✅ Account (/account)
   - ✅ Saved Alleys (/saved-alleys)
   - ✅ My Venues (/my-venues, /my-venues/[id]/edit)
   - ✅ User Profile (/u/[slug])
   - ✅ Owner Profile (/owner/[slug])
   - ✅ Bowling Leagues (/bowling-leagues/[[...params]])
   - ✅ Cosmic Bowling (/cosmic-bowling/[[...params]])
   - ✅ Open Bowling (/open-bowling/[[...params]])
   - ✅ Experiences (/experiences)
   - ✅ Tournaments (/tournaments/[[...params]])
   - ✅ Owner (/owner)
   - ✅ Founding Partners (/founding-partners)
   - ✅ Pitch Deck (/pitch-deck)
   - ✅ Profile (/profile)
   - ✅ Team (/team)
   - ✅ Team Logo Lab (/team-logo-lab)
   - ✅ Not Found (404)

## Remaining Routes to Create (44)

All remaining routes should follow this pattern:

```tsx
'use client';
import dynamic from 'next/dynamic';

const PageComponent = dynamic(() => import('@/components/PageComponent'), {
  ssr: true, // or false for auth-required pages
});

export default function Page({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <PageComponent state={state} city={city} />;
}
```

### Routes with [[...params]] pattern:
- /specials
- /kids-bowling
- /batting-cages
- /bowling-birthday-party
- /bowling-cost
- /arcade-bowling
- /bowling-lessons
- /senior-bowling
- /corporate-events
- /bowling-restaurant
- /bowling-bar
- /sports-bar
- /snack-bar
- /bowling-billiards
- /ping-pong
- /pro-shop
- /laser-tag
- /karaoke-bowling
- /duckpin-bowling
- /candlepin-bowling
- /wheelchair-accessible
- /escape-rooms

### City-specific hub pages:
- /best-bowling-in-el-paso
- /best-bowling-in-charleston-sc
- /best-bowling-in-summerville-sc
- /best-bowling-in-denver
- /best-bowling-alleys-in-el-cajon
- /best-bowling-in-ashburn-va
- /best-bowling-in-atlanta
- /best-bowling-in-houston
- /best-bowling-in-chicago
- /best-bowling-in-los-angeles
- /best-bowling-in-baltimore
- /best-bowling-in-boston
- /best-bowling-in-las-vegas
- /best-bowling-in-new-york
- /best-bowling-in-phoenix
- /best-bowling-in-san-francisco
- /best-bowling-in-san-diego
- /best-bowling-in-seattle
- /best-bowling-in-miami
- /best-bowling-in-colorado-springs
- /best-bowling-in-dallas-fort-worth

## Component Migration Required

All page components need to be migrated from `client/src/pages/` to `frontend/components/` with these changes:

1. **Replace Wouter imports:**
   - `import { Link, useLocation } from "wouter"` → `import Link from "next/link"` and `import { usePathname } from "next/navigation"`
   - `useLocation()` → `usePathname()`
   - `<Link href="/path">` → `<Link href="/path">` (same, but from next/link)

2. **Replace Helmet:**
   - `react-helmet-async` → Next.js `Metadata` API for Server Components
   - Or keep Helmet for Client Components (already works)

3. **Update imports:**
   - `@/lib/firestore` → Already uses API client ✅
   - `@/lib/api-client` → Use this for new API calls
   - `@/lib/firebase` → Only auth, no Firestore ✅

4. **Data Fetching:**
   - Server Components: Use `serverApiRequest()` from `@/lib/api-client`
   - Client Components: Use React Query with `api` from `@/lib/api-client`

## Next Steps

1. Create remaining route pages (44 routes)
2. Migrate all page components (70 components)
3. Update all components to use Next.js Link/navigation
4. Set up MDX support for blog
5. Test all routes
6. Update environment variables
7. Remove old Vite client code
8. Update build scripts

## Environment Variables Needed

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
```

### API (.env):
```
FRONTEND_URL=http://localhost:3000
PORT=5000
# ... existing Firebase Admin config
```

