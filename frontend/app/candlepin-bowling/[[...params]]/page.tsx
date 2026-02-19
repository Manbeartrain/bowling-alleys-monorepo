'use client';

import dynamic from 'next/dynamic';

const CandlepinBowlingPage = dynamic(() => import('@/components/pages/CandlepinBowlingPage'), {
  ssr: true,
});

export default function CandlepinBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <CandlepinBowlingPage state={state} city={city} />;
}
