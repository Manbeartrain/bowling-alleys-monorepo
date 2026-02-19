'use client';

import dynamic from 'next/dynamic';

const OpenBowlingPage = dynamic(() => import('@/components/pages/OpenBowlingPage'), {
  ssr: true,
});

export default function OpenBowling({ params }: { params: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <OpenBowlingPage state={state} city={city} />;
}

