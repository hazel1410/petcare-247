import { AuthorizePaymentInput, PaymentAuthorization, CapturePaymentInput, PaymentCapture, PayoutInput, PayoutResult } from '../types';

export interface PaymentAdapter {
  authorize(input: AuthorizePaymentInput): Promise<PaymentAuthorization>;
  capture(input: CapturePaymentInput): Promise<PaymentCapture>;
  refund(transactionId: string, amountCents: number): Promise<{ id: string; status: string }>;
  payout(input: PayoutInput): Promise<PayoutResult>;
}
