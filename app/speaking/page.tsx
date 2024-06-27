// Page.tsx
import React from 'react';
import dynamic from 'next/dynamic';

export default function Dashboard() {
  const DynamicPage = dynamic(() => import('./record'), { ssr: false });
  return (
    <>
    <DynamicPage />
    </>
  );
}