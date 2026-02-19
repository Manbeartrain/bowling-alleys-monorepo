'use client';

import dynamic from 'next/dynamic';

const LocationsPage = dynamic(() => import('@/components/pages/LocationsPage'), {
  ssr: true,
});

export default function Locations({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <LocationsPage state={state} city={city} />;
}

