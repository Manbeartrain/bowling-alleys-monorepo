'use client';

import dynamic from 'next/dynamic';

const EscapeRoomsPage = dynamic(() => import('@/components/pages/EscapeRoomsPage'), {
  ssr: true,
});

export default function EscapeRooms({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <EscapeRoomsPage state={state} city={city} />;
}
