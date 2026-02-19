'use client';

import dynamic from 'next/dynamic';

const CorporateEventsPage = dynamic(() => import('@/components/pages/CorporateEventsPage'), {
  ssr: true,
});

export default function CorporateEvents({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <CorporateEventsPage state={state} city={city} />;
}
