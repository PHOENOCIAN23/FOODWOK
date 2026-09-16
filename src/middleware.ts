import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const staffRoleCookie = request.cookies.get('foodwok_role')?.value;

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

  if (isSupabaseConfigured) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
              cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const role = profile?.role || staffRoleCookie;
        if (role === 'ADMIN' || role === 'KITCHEN_STAFF') {
          // Accounting ledger is strictly for ADMIN
          if (request.nextUrl.pathname.startsWith('/admin/accounting') && role === 'KITCHEN_STAFF') {
            return NextResponse.redirect(new URL('/admin/kds?notice=accounting_restricted', request.url));
          }
          return response;
        }

        return NextResponse.redirect(new URL('/staff-login?notice=forbidden_admin', request.url));
      }
    } catch (err) {
      console.warn('Middleware Supabase authentication error:', err);
    }
  }

  // Fallback to verified staff session cookie
  if (staffRoleCookie === 'ADMIN' || staffRoleCookie === 'KITCHEN_STAFF') {
    if (request.nextUrl.pathname.startsWith('/admin/accounting') && staffRoleCookie === 'KITCHEN_STAFF') {
      return NextResponse.redirect(new URL('/admin/kds?notice=accounting_restricted', request.url));
    }
    return response;
  }

  return NextResponse.redirect(new URL('/staff-login?notice=forbidden_admin', request.url));
}

export const config = { matcher: ['/admin/:path*'] };