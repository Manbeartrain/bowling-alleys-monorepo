'use client';

import dynamic from 'next/dynamic';

const ProShopPage = dynamic(() => import('@/components/pages/ProShopPage'), {
  ssr: true,
});

export default function ProShop({ params }: { params?: { params?: string[] } }) {
  const state = params?.params?.[0];
  const city = params?.params?.[1];
  return <ProShopPage state={state} city={city} />;
}
