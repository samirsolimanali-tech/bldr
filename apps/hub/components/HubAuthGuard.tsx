'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { isHubAuthenticated } from '../lib/auth';

interface HubAuthGuardProps {
  children: React.ReactNode;
}

export default function HubAuthGuard({ children }: HubAuthGuardProps) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Determine if this is an unprotected public route
  const isPublicRoute =
    pathname === '/login' ||
    pathname.startsWith('/pay/') ||
    pathname === '/pay';

  const verifyAuthentication = useCallback(() => {
    if (isPublicRoute) {
      setIsAuthorized(true);
      return true;
    }

    const authed = isHubAuthenticated();
    if (!authed) {
      setIsAuthorized(false);
      // Immediately replace location to redirect to /login
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return false;
    }

    setIsAuthorized(true);
    return true;
  }, [isPublicRoute]);

  useEffect(() => {
    // 1. Immediate check on mount and pathname change
    verifyAuthentication();

    if (typeof window === 'undefined') return;

    // 2. bfcache / back-forward cache handler (CRITICAL for browser "Back" button)
    const handlePageShow = (event: PageTransitionEvent) => {
      // Regardless of event.persisted, re-validate authentication status
      verifyAuthentication();
    };

    // 3. Tab visibility change (when user returns to tab after logging out elsewhere)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        verifyAuthentication();
      }
    };

    // 4. Popstate handler (history back/forward clicks)
    const handlePopState = () => {
      verifyAuthentication();
    };

    // 5. Cross-tab logout handler
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bldr_hub_session' && !e.newValue) {
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

  // Public route: render children immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Not authenticated or pending verification: render clean security backdrop
  if (isAuthorized !== true) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: '#0B132B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid #2E6F5E',
              borderTopColor: 'transparent',
              animation: 'hubSpin 0.7s linear infinite',
              margin: '0 auto 14px',
            }}
          />
          <style>{`
            @keyframes hubSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
            Verifying Central Hub Security Session...
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
            ADR-001 Zero-Trust Session Verification
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
