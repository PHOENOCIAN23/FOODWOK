import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email, firstName, lastName, phone, role, emailVerified, phoneVerified, addresses } = body;

    if (!id || !email) {
      return NextResponse.json({ status: false, message: 'User ID and Email are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const payload = {
      id,
      email,
      first_name: firstName || '',
      last_name: lastName || '',
      phone: phone || '',
      role: role || 'CUSTOMER',
      email_verified: !!emailVerified,
      phone_verified: !!phoneVerified,
      addresses: addresses || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase user_profiles sync warning:', error);
      return NextResponse.json({
        status: true,
        synced: false,
        message: 'Firebase Auth & Firestore synced. Supabase sync notice: ' + error.message,
      });
    }

    return NextResponse.json({
      status: true,
      synced: true,
      data,
      message: 'User profile record successfully pushed to Supabase storage!',
    });
  } catch (err: any) {
    console.error('Error syncing user to Supabase:', err);
    return NextResponse.json({ status: false, message: err.message || 'Sync error' }, { status: 500 });
  }
}
