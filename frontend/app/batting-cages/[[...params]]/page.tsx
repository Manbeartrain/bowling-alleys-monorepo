'use client';

import dynamic from 'next/dynamic';

const BattingCagesPage = dynamic(() => import('@/components/pages/BattingCagesPage'), {
  ssr: true,
});

export default function BattingCages({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BattingCagesPage state={state} city={city} />;
}
