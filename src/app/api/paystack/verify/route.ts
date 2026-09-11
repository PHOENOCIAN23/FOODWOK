import { NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Missing reference query parameter' },
        { status: 400 }
      );
    }

    const verificationRes = await verifyPaystackTransaction(reference);
    return NextResponse.json(verificationRes);
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message || 'Verification error' },
      { status: 500 }
    );
  }
}
