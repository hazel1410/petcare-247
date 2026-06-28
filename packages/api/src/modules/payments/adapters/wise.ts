import { v4 as uuid } from 'uuid';
import { PaymentAdapter } from './types';
import { AuthorizePaymentInput, PaymentAuthorization, CapturePaymentInput, PaymentCapture, PayoutInput, PayoutResult } from '../types';

export class WiseAdapter implements PaymentAdapter {
  // Stubbed: real integration requires Wise API credentials.
  // Wise supports low-cost international transfers to bank accounts in India.

  async authorize(input: AuthorizePaymentInput): Promise<PaymentAuthorization> {
    const id = `wise_auth_${uuid().replace(/-/g, '').slice(0, 20)}`;
    return {
      id,
      status: 'authorized',
      amountCents: input.amountCents,
      currency: input.currency,
    };
  }

  async capture(input: CapturePaymentInput): Promise<PaymentCapture> {
    const id = `wise_cap_${uuid().replace(/-/g, '').slice(0, 20)}`;
    return {
      id,
      status: 'captured',
      capturedAmountCents: input.amountCents,
    };
  }

  async refund(transactionId: string, amountCents: number): Promise<{ id: string; status: string }> {
    return {
      id: `wise_refund_${transactionId}`,
      status: 'succeeded',
    };
  }

  async payout(input: PayoutInput): Promise<PayoutResult> {
    const id = `wise_payout_${uuid().replace(/-/g, '').slice(0, 20)}`;
    return {
      id,
      status: 'processing',
      amountCents: input.amountCents,
      rail: 'wise',
      estimatedArrival: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // T+1 for Wise
    };
  }
}
