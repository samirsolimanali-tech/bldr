import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Guard /simulate/*: strictly only when NEXT_PUBLIC_ENABLE_TEST_TOOLS=true and never in production ───
  if (pathname.startsWith('/simulate')) {
    const isProduction = process.env.NODE_ENV === 'production';
    const enableTestTools = process.env.NEXT_PUBLIC_ENABLE_TEST_TOOLS === 'true';

    if (isProduction || !enableTestTools) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/simulate/:path*'],
};
