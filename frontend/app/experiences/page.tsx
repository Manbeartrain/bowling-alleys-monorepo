'use client';

import dynamic from 'next/dynamic';

const ExperiencesPage = dynamic(() => import('@/components/pages/ExperiencesPage'), {
  ssr: true,
});

export default function Experiences() {
  return <ExperiencesPage />;
}

