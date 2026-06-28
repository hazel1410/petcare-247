export type PaymentRail = 'stripe_connect' | 'wise';
export type TransactionStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PaymentConfig {
  consultationPriceCents: number;
  currency: string;
  firstQuestionFree: boolean;
  promoCreditCents: number;     // 199 = $1.99 (covers one free question)
  promoCreditExpiryDays: number; // 90
}

export interface AuthorizePaymentInput {
  ownerId: string;
  amountCents: number;
  currency: string;
  paymentMethodId: string;
  description: string;
}

export interface CapturePaymentInput {
  authorizationId: string;
  amountCents: number;
}

export interface PaymentAuthorization {
  id: string;
  status: TransactionStatus;
  amountCents: number;
  currency: string;
  error?: string;
}

export interface PaymentCapture {
  id: string;
  status: TransactionStatus;
  capturedAmountCents: number;
  error?: string;
}

export interface PayoutInput {
  vetId: string;
  amountCents: number;
  currency: string;
  rail: PaymentRail;
  destinationId: string; // Stripe Connect account ID or Wise recipient ID
}

export interface PayoutResult {
  id: string;
  status: PayoutStatus;
  amountCents: number;
  rail: PaymentRail;
  estimatedArrival: string;
  error?: string;
}

export interface WalletBalance {
  ownerId: string;
  balanceCents: number;
  lifetimeCreditsCents: number;
  lifetimeDebitsCents: number;
  version: number;
  promoCreditsUsed: boolean;
}

export interface WalletCreditOperation {
  ownerId: string;
  amountCents: number;
  newBalanceCents: number;
}
