'use client';

import dynamic from 'next/dynamic';

const SpecialsPage = dynamic(() => import('@/components/pages/SpecialsPage'), {
  ssr: true,
});

export default function Specials({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <SpecialsPage state={state} city={city} />;
}
