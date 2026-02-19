'use client';

import dynamic from 'next/dynamic';

const SavedAlleysPage = dynamic(() => import('@/components/pages/SavedAlleysPage'), {
  ssr: false,
});

export default function SavedAlleys() {
  return <SavedAlleysPage />;
}

