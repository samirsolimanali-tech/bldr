import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * BLDR Admin Portal — Production Exposure Guard & Deployment Protection
 */
export function middleware(request: NextRequest) {
  const isVercel = process.env.VERCEL === '1';
  const isProd = process.env.NODE_ENV === 'production';
  const stubAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_TOOLS === 'true' || process.env.ENABLE_STUB_AUTH === 'true';

  if (isVercel || isProd) {
    const internalKey = process.env.BLDR_INTERNAL_ACCESS_KEY;
    const requestKey = request.headers.get('x-bldr-internal-key');
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0].trim();
    const allowlist = (process.env.BLDR_INTERNAL_IP_ALLOWLIST || '').split(',').map((ip) => ip.trim()).filter(Boolean);

    if (allowlist.length > 0 && !allowlist.includes(clientIp)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Access Denied',
          message: 'BLDR Executive Admin Portal is restricted to authorized internal corporate networks.',
          ip: clientIp,
        }),
        {
          status: 403,
          headers: {
            'content-type': 'application/json',
            'x-deployment-protection': 'BLDR-Admin-IP-Gated',
          },
        },
      );
    }

    if (stubAuthEnabled && internalKey && requestKey !== internalKey) {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
      }

      return new NextResponse(
        JSON.stringify({
          error: 'Deployment Protection Active',
          message: 'BLDR Executive Admin Portal with dev test auth is restricted. Enable Vercel Deployment Protection or supply valid x-bldr-internal-key.',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
            'x-deployment-protection': 'BLDR-Admin-StubAuth-Blocked',
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
