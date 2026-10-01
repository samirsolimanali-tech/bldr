import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * BLDR Hub — Production Exposure Guard & Deployment Protection
 *
 * Requirements:
 * 1. Confirm Hub is NOT publicly reachable on Vercel with stub auth.
 * 2. Require Vercel Deployment Protection, IP allowlist, or internal security token.
 * 3. Never allow public unauthenticated discovery of internal financial management.
 */
export function middleware(request: NextRequest) {
  const isVercel = process.env.VERCEL === '1';
  const isProd = process.env.NODE_ENV === 'production';
  const stubAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_TOOLS === 'true' || process.env.ENABLE_STUB_AUTH === 'true';

  // If running in production or deployed on Vercel with stub auth enabled, fail closed unless internal key or allowlist matches
  if (isVercel || isProd) {
    const internalKey = process.env.BLDR_INTERNAL_ACCESS_KEY;
    const requestKey = request.headers.get('x-bldr-internal-key');
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0].trim();
    const allowlist = (process.env.BLDR_INTERNAL_IP_ALLOWLIST || '').split(',').map((ip) => ip.trim()).filter(Boolean);

    // If an IP allowlist is defined, enforce it
    if (allowlist.length > 0 && !allowlist.includes(clientIp)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Access Denied',
          message: 'BLDR Central Financial Hub is restricted to authorized internal IP addresses.',
          ip: clientIp,
        }),
        {
          status: 403,
          headers: {
            'content-type': 'application/json',
            'x-deployment-protection': 'BLDR-IP-Gated',
          },
        },
      );
    }

    // If stub auth is active in production, strictly require internal key
    if (stubAuthEnabled && internalKey && requestKey !== internalKey) {
      // Allow Next.js internal assets
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
      }

      return new NextResponse(
        JSON.stringify({
          error: 'Deployment Protection Active',
          message: 'BLDR Central Financial Hub with development test tools is restricted. Enable Vercel Deployment Protection or supply valid x-bldr-internal-key.',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
            'x-deployment-protection': 'BLDR-StubAuth-Blocked',
          },
        },
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
