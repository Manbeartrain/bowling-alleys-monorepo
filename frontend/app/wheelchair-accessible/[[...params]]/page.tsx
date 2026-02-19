'use client';

import dynamic from 'next/dynamic';

const WheelchairAccessiblePage = dynamic(() => import('@/components/pages/WheelchairAccessiblePage'), {
  ssr: true,
});

export default function WheelchairAccessible({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <WheelchairAccessiblePage state={state} city={city} />;
}
