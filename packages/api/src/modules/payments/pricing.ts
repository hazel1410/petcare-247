import { PaymentConfig } from './types';

export const DEFAULT_PRICING: PaymentConfig = {
  consultationPriceCents: 499,  // $4.99 per consult after free question
  currency: 'USD',
  firstQuestionFree: true,
  promoCreditCents: 199,        // $1.99 covers the first question
  promoCreditExpiryDays: 90,    // Must use within 90 days of signup
};

export function shouldApplyFreeQuestion(
  ownerId: string,
  promoCreditsUsed: boolean,
  ownerCreatedAt: Date,
  config: PaymentConfig = DEFAULT_PRICING,
): boolean {
  if (!config.firstQuestionFree) return false;
  if (promoCreditsUsed) return false;

  const ageDays = (Date.now() - ownerCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays > config.promoCreditExpiryDays) return false;

  return true;
}

export function calculateChargeAmount(
  isFreeQuestion: boolean,
  _promoBalanceCents: number,
  config: PaymentConfig = DEFAULT_PRICING,
): number {
  if (isFreeQuestion) return 0;
  return config.consultationPriceCents;
}

export function calculateVetPayout(
  chargeAmountCents: number,
  platformFeePercent: number = 0.20, // 20% platform fee
): { vetPayoutCents: number; platformFeeCents: number } {
  const platformFeeCents = Math.round(chargeAmountCents * platformFeePercent);
  const vetPayoutCents = chargeAmountCents - platformFeeCents;
  return { vetPayoutCents, platformFeeCents };
}
