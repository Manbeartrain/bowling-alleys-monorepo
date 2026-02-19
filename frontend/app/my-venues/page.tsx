'use client';

import dynamic from 'next/dynamic';

const MyVenuesPage = dynamic(() => import('@/components/pages/MyVenuesPage'), {
  ssr: false,
});

export default function MyVenues() {
  return <MyVenuesPage />;
}

