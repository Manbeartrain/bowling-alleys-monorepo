'use client';

import dynamic from 'next/dynamic';

const TeamPage = dynamic(() => import('@/components/pages/TeamPage'), {
  ssr: true,
});

export default function Team() {
  return <TeamPage />;
}

