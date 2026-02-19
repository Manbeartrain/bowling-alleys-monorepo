'use client';

import dynamic from 'next/dynamic';

const BowlingRestaurantPage = dynamic(() => import('@/components/pages/BowlingRestaurantPage'), {
  ssr: true,
});

export default function BowlingRestaurant({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingRestaurantPage state={state} city={city} />;
}
