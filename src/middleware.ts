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

    // Redirect unauthorized users to dedicated hidden staff login portal
    const staffLoginUrl = new URL('/staff-login', request.url);
    staffLoginUrl.searchParams.set('notice', 'forbidden_admin');
    return NextResponse.redirect(staffLoginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
