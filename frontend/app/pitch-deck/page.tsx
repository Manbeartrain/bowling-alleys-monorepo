'use client';

import dynamic from 'next/dynamic';

const PitchDeckPage = dynamic(() => import('@/components/pages/PitchDeckPage'), {
  ssr: true,
});

export default function PitchDeck() {
  return <PitchDeckPage />;
}

