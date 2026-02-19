'use client';

import dynamic from 'next/dynamic';

const LaserTagPage = dynamic(() => import('@/components/pages/LaserTagPage'), {
  ssr: true,
});

export default function LaserTag({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <LaserTagPage state={state} city={city} />;
}
