import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ exists: false });
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from('user_profiles')
      .select('id')
      .ilike('email', email.trim())
      .maybeSingle();

    return NextResponse.json({ exists: !!data });
  } catch (err) {
    return NextResponse.json({ exists: false });
  }
}
