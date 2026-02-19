'use client';

import dynamic from 'next/dynamic';

const SportsBarPage = dynamic(() => import('@/components/pages/SportsBarPage'), {
  ssr: true,
});

export default function SportsBar({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <SportsBarPage state={state} city={city} />;
}
