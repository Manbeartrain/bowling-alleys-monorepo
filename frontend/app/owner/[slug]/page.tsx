'use client';

import dynamic from 'next/dynamic';

const OwnerProfilePage = dynamic(() => import('@/components/pages/OwnerProfilePage'), {
  ssr: true,
});

export default function OwnerProfile({ params }: { params: { slug: string } }) {
  return <OwnerProfilePage slug={params.slug} />;
}

