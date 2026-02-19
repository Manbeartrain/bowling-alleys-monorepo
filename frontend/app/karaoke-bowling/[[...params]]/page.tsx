'use client';

import dynamic from 'next/dynamic';

const KaraokeBowlingPage = dynamic(() => import('@/components/pages/KaraokeBowlingPage'), {
  ssr: true,
});

export default function KaraokeBowling({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <KaraokeBowlingPage state={state} city={city} />;
}
