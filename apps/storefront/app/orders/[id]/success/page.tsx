'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

function OrderSuccessRedirect() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const orderId = (params?.id as string) || searchParams.get('order_id') || '';
    const sessionId = searchParams.get('session_id') || searchParams.get('sessionId') || '';
    const query = new URLSearchParams();
    if (orderId) query.set('order_id', orderId);
    if (sessionId) query.set('session_id', sessionId);
    router.replace(`/checkout/success?${query.toString()}`);
  }, [params, searchParams, router]);

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
      Redirecting to payment confirmation...
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F8FAFC' }} />}>
      <OrderSuccessRedirect />
    </Suspense>
  );
}
