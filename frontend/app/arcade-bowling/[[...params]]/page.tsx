'use client';

import dynamic from 'next/dynamic';

const ArcadeBowlingPage = dynamic(() => import('@/components/pages/ArcadeBowlingPage'), {
  ssr: true,
});

export default function ArcadeBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <ArcadeBowlingPage state={state} city={city} />;
}
