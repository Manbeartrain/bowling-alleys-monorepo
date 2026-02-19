'use client';

import dynamic from 'next/dynamic';

const CosmicBowlingPage = dynamic(() => import('@/components/pages/CosmicBowlingPage'), {
  ssr: true,
});

export default function CosmicBowling({ params }: { params: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <CosmicBowlingPage state={state} city={city} />;
}

