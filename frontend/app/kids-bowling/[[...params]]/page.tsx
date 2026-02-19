'use client';

import dynamic from 'next/dynamic';

const KidsBowlingPage = dynamic(() => import('@/components/pages/KidsBowlingPage'), {
  ssr: true,
});

export default function KidsBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <KidsBowlingPage state={state} city={city} />;
}
