import { NextResponse } from 'next/server';
import { verifyPaystackHmacSignature } from '@/lib/paystack';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-paystack-signature') || '';
    const rawBody = await req.text();

    // Verify HMAC SHA512 signature from Paystack
    const isValidSignature = verifyPaystackHmacSignature(rawBody, signature);
    if (!isValidSignature) {
      return NextResponse.json({ status: false, message: 'Invalid HMAC signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountInKobo = data.amount;
      const customerEmail = data.customer?.email;

      console.log(`[Paystack Webhook] Verified payment charge.success for ref: ${reference}, amount: ${amountInKobo} kobo, email: ${customerEmail}`);

      // Here the order is marked as verified & paid in database / memory
    }

    return NextResponse.json({ status: true, message: 'Webhook received successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message || 'Webhook processing error' },
      { status: 500 }
    );
  }
}
