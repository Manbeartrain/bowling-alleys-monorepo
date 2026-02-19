'use client';

import dynamic from 'next/dynamic';

const PrivacyPage = dynamic(() => import('@/components/pages/PrivacyPage'), {
  ssr: true,
});

export default function Privacy() {
  return <PrivacyPage />;
}

