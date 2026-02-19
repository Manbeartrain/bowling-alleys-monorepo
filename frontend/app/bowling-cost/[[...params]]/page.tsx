'use client';

import dynamic from 'next/dynamic';

const BowlingCostPage = dynamic(() => import('@/components/pages/BowlingCostPage'), {
  ssr: true,
});

export default function BowlingCost({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingCostPage state={state} city={city} />;
}
