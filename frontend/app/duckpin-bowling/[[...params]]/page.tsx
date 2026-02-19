'use client';

import dynamic from 'next/dynamic';

const DuckpinBowlingPage = dynamic(() => import('@/components/pages/DuckpinBowlingPage'), {
  ssr: true,
});

export default function DuckpinBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <DuckpinBowlingPage state={state} city={city} />;
}
