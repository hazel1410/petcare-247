import { v4 as uuid } from 'uuid';
import { PaymentAdapter } from './types';
import { AuthorizePaymentInput, PaymentAuthorization, CapturePaymentInput, PaymentCapture, PayoutInput, PayoutResult } from '../types';

export class StripeConnectAdapter implements PaymentAdapter {
  // Stubbed: real integration requires Stripe API keys + Connect account onboarding.
  // Returns correctly typed responses simulating a successful Stripe flow.

  async authorize(input: AuthorizePaymentInput): Promise<PaymentAuthorization> {
    const id = `pi_${uuid().replace(/-/g, '').slice(0, 24)}`;
    return {
      id,
      status: 'authorized',
      amountCents: input.amountCents,
      currency: input.currency,
    };
  }

  async capture(input: CapturePaymentInput): Promise<PaymentCapture> {
    const id = `capture_${uuid().replace(/-/g, '').slice(0, 24)}`;
    return {
      id,
      status: 'captured',
      capturedAmountCents: input.amountCents,
    };
  }

  async refund(transactionId: string, amountCents: number): Promise<{ id: string; status: string }> {
    return {
      id: `refund_${transactionId}`,
      status: 'succeeded',
    };
  }

  async payout(input: PayoutInput): Promise<PayoutResult> {
    const id = `po_${uuid().replace(/-/g, '').slice(0, 24)}`;
    return {
      id,
      status: 'processing',
      amountCents: input.amountCents,
      rail: 'stripe_connect',
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // T+2
    };
  }
}
