import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/types/foodwok';

// Authorized staff passwords and profile metadata
const AUTHORIZED_STAFF: Record<
  string,
  {
    passcode: string;
    role: UserRole;
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  }
> = {
  'admin@foodwok.ng': {
    passcode: 'FW#Admin!2026$9xKpZ*8Q',
    role: 'ADMIN',
    id: 'a1111111-1111-1111-1111-111111111111',
    firstName: 'Foodwok',
    lastName: 'Administrator',
    phone: '+2348000000001',
  },
  'kitchen@foodwok.ng': {
    passcode: 'FW#Kitch!2026*4vLmT$6Y',
    role: 'KITCHEN_STAFF',
    id: 'b2222222-2222-2222-2222-222222222222',
    firstName: 'Kitchen',
    lastName: 'Staff',
    phone: '+2348000000002',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    const staffRecord = AUTHORIZED_STAFF[email];

    if (!staffRecord || staffRecord.passcode !== password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid staff email or password. Please verify credentials.',
        },
        { status: 401 }
      );
    }

    const staffUser = {
      id: staffRecord.id,
      email,
      firstName: staffRecord.firstName,
      lastName: staffRecord.lastName,
      role: staffRecord.role,
      addresses: [],
      phone: staffRecord.phone,
      emailVerified: true,
      phoneVerified: true,
    };

    // Create session payload
    const sessionPayload = {
      id: staffRecord.id,
      email,
      role: staffRecord.role,
      issuedAt: Date.now(),
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      role: staffRecord.role,
      user: staffUser,
      redirectTo: '/admin/kds',
    });

    // Set authoritative cookies on the HTTP response
    response.cookies.set('foodwok_role', staffRecord.role, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      httpOnly: false, // accessible to client for instant UI state
      secure: process.env.NODE_ENV === 'production',
    });

    response.cookies.set('foodwok_staff_session', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      httpOnly: true, // protected from XSS
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: any) {
    console.error('Error in staff-login API:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal authentication error occurred.',
      },
      { status: 500 }
    );
  }
}
