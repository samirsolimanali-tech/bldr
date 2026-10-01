'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function ProviderEnrollRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/apply-provider');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        color: '#64748B',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      Redirecting to brand partnership application...
    </div>
  );
}

export default function ProviderEnrollPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F8FAFC' }} />}>
      <ProviderEnrollRedirect />
    </Suspense>
  );
}
