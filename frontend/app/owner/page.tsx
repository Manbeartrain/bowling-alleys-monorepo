'use client';

import dynamic from 'next/dynamic';

const OwnerPage = dynamic(() => import('@/components/pages/OwnerPage'), {
  ssr: true,
});

export default function Owner() {
  return <OwnerPage />;
}

