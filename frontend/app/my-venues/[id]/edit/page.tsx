'use client';

import dynamic from 'next/dynamic';

const EditVenuePage = dynamic(() => import('@/components/pages/EditVenuePage'), {
  ssr: false,
});

export default function EditVenue({ params }: { params: { id: string } }) {
  return <EditVenuePage venueId={params.id} />;
}

