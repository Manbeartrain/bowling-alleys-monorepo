'use client';

import dynamic from 'next/dynamic';

const TournamentsPage = dynamic(() => import('@/components/pages/TournamentsPage'), {
  ssr: true,
});

export default function Tournaments({ params }: { params: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <TournamentsPage state={state} city={city} />;
}

