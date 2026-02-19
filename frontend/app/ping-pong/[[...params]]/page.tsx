'use client';

import dynamic from 'next/dynamic';

const BowlingPingPongPage = dynamic(() => import('@/components/pages/BowlingPingPongPage'), {
  ssr: true,
});

export default function BowlingPingPong({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingPingPongPage state={state} city={city} />;
}
