'use client';

import dynamic from 'next/dynamic';

const BowlingLeaguesPage = dynamic(() => import('@/components/pages/BowlingLeaguesPage'), {
  ssr: true,
});

export default function BowlingLeagues({ params }: { params: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingLeaguesPage state={state} city={city} />;
}

