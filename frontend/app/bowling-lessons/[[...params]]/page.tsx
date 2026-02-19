'use client';

import dynamic from 'next/dynamic';

const BowlingLessonsPage = dynamic(() => import('@/components/pages/BowlingLessonsPage'), {
  ssr: true,
});

export default function BowlingLessons({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <BowlingLessonsPage state={state} city={city} />;
}
