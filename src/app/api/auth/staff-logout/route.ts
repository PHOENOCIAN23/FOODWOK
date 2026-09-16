import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    redirectTo: '/staff-login?notice=logged_out',
  });

  // Expire the staff cookies immediately
  response.cookies.set('foodwok_role', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: false,
  });

  response.cookies.set('foodwok_staff_session', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: true,
  });

  return response;
}
