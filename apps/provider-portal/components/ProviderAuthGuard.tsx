'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { isProviderAuthenticated } from '../lib/auth';

interface ProviderAuthGuardProps {
  children: React.ReactNode;
}

export default function ProviderAuthGuard({ children }: ProviderAuthGuardProps) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/pay');

  const verifyAuthentication = useCallback(() => {
    if (isPublicRoute) {
      setIsAuthorized(true);
      return true;
    }

    const authed = isProviderAuthenticated();
    if (!authed) {
      setIsAuthorized(false);
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return false;
    }

    setIsAuthorized(true);
    return true;
  }, [isPublicRoute]);

  useEffect(() => {
    verifyAuthentication();

    if (typeof window === 'undefined') return;

    // bfcache / Back button protection
    const handlePageShow = () => {
      verifyAuthentication();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        verifyAuthentication();
      }
    };

    const handlePopState = () => {
      verifyAuthentication();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bldr_token' && !e.newValue) {
        verifyAuthentication();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorage);
    };
  }, [verifyAuthentication]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isAuthorized !== true) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid #0EA5E9',
              borderTopColor: 'transparent',
              animation: 'provSpin 0.7s linear infinite',
              margin: '0 auto 14px',
            }}
          />
          <style>{`
            @keyframes provSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
            Verifying Brand Session...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
