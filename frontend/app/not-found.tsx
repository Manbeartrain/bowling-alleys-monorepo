'use client';

import dynamic from 'next/dynamic';

const NotFoundPage = dynamic(() => import('@/components/pages/not-foundPage'), {
  ssr: true,
});

export default function NotFound() {
  return <NotFoundPage />;
}

