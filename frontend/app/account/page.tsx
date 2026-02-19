'use client';

import dynamic from 'next/dynamic';

const AccountPage = dynamic(() => import('@/components/pages/AccountPage'), {
  ssr: false,
});

export default function Account() {
  return <AccountPage />;
}

