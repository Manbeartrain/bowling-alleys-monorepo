'use client';

import dynamic from 'next/dynamic';

const UserProfilePage = dynamic(() => import('@/components/pages/UserProfilePage'), {
  ssr: true,
});

export default function UserProfile({ params }: { params: { slug: string } }) {
  return <UserProfilePage slug={params.slug} />;
}

