'use client';

import dynamic from 'next/dynamic';

const SeniorBowlingPage = dynamic(() => import('@/components/pages/SeniorBowlingPage'), {
  ssr: true,
});

export default function SeniorBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <SeniorBowlingPage state={state} city={city} />;
}
