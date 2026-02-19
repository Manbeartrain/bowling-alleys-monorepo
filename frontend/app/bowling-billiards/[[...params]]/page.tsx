'use client';

import dynamic from 'next/dynamic';

const BowlingBilliardsPage = dynamic(() => import('@/components/pages/BowlingBilliardsPage'), {
  ssr: true,
});

export default function BowlingBilliards({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingBilliardsPage state={state} city={city} />;
}
