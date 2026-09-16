import { NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amountInKobo, reference, metadata, callbackUrl } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || !amountInKobo || typeof amountInKobo !== 'number' || amountInKobo <= 0 || !reference) {
      return NextResponse.json(
        { status: false, message: 'Invalid or missing required payment fields (email, amountInKobo > 0, reference)' },
        { status: 400 }
      );
    }

    const paystackRes = await initializePaystackTransaction({
      email,
      amountInKobo,
      reference,
      metadata,
      callbackUrl,
    });

    return NextResponse.json(paystackRes);
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message || 'Internal payment error' },
      { status: 500 }
    );
  }
}
