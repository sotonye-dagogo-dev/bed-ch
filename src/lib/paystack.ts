const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    ip_address: string;
    metadata: {
      custom_fields: Array<{ variable_name: string; value: string }>;
    };
    customer: {
      email: string;
    };
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: PaystackVerifyResponse['data'];
}

export async function initializePayment(
  email: string,
  amount: number,
  reference: string,
  callbackUrl: string,
  metadata?: Record<string, unknown>
): Promise<PaystackInitializeResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount, // in kobo
      reference,
      callback_url: callbackUrl,
      metadata: {
        ...metadata,
        custom_fields: [
          { variable_name: 'order_id', value: metadata?.orderId as string || '' },
        ],
      },
      channels: ['card', 'bank_transfer', 'ussd'],
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Failed to initialize payment');
  }

  return data;
}

export async function verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Failed to verify payment');
  }

  return data;
}

import { createHmac } from 'crypto';

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hash = createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

export async function handleWebhook(event: PaystackWebhookEvent): Promise<{ orderId: string; paymentStatus: 'PAID' | 'FAILED' } | null> {
  const { event: eventType, data } = event;

  if (eventType === 'charge.success') {
    const orderId = data.metadata?.custom_fields?.find(f => f.variable_name === 'order_id')?.value;
    if (!orderId) {
      console.error('No order_id in webhook metadata');
      return null;
    }
    return { orderId, paymentStatus: 'PAID' };
  }

  if (eventType === 'charge.failed') {
    const orderId = data.metadata?.custom_fields?.find(f => f.variable_name === 'order_id')?.value;
    if (!orderId) {
      console.error('No order_id in webhook metadata');
      return null;
    }
    return { orderId, paymentStatus: 'FAILED' };
  }

  return null;
}