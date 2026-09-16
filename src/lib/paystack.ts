import crypto from 'crypto';

export interface PaystackInitializeParams {
  email: string;
  amountInKobo: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(params: PaystackInitializeParams) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_key';

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountInKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  return data;
}

export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_key';

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  return data;
}

export function verifyPaystackHmacSignature(bodyString: string, signatureHeader: string): boolean {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  if (!secretKey || !signatureHeader) return false;

  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(bodyString)
    .digest('hex');

  try {
    const hashBuffer = Buffer.from(hash, 'utf8');
    const signatureBuffer = Buffer.from(signatureHeader, 'utf8');
    if (hashBuffer.length !== signatureBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, signatureBuffer);
  } catch {
    return false;
  }
}
