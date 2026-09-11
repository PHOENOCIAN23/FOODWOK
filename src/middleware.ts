import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const roleCookie = request.cookies.get('foodwok_role')?.value;
    const authHeaderRole = request.headers.get('x-foodwok-role');
    const effectiveRole = roleCookie || authHeaderRole || 'CUSTOMER';

    // Allow ADMIN or KITCHEN_STAFF
    if (effectiveRole === 'ADMIN' || effectiveRole === 'KITCHEN_STAFF') {
      return NextResponse.next();
    }

    // Return 403 Forbidden or redirect unauthorized users to login/home
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('notice', 'forbidden_admin');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
