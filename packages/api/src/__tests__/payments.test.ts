import { describe, it, expect } from 'vitest';
import { calculateChargeAmount, calculateVetPayout, shouldApplyFreeQuestion, DEFAULT_PRICING } from '../modules/payments/pricing';
import { InMemoryWalletStore, WalletLedger } from '../modules/payments/wallet';
import { PaymentService, OwnerForPricing } from '../modules/payments/service';

// ═══════════════════════════════════════════════════════════════
// PRICING LOGIC
// ═══════════════════════════════════════════════════════════════

describe('shouldApplyFreeQuestion', () => {
  it('returns true for new owner with unused promo', () => {
    const createdAt = new Date();
    expect(shouldApplyFreeQuestion('owner-1', false, createdAt)).toBe(true);
  });

  it('returns false if promo already used', () => {
    const createdAt = new Date();
    expect(shouldApplyFreeQuestion('owner-1', true, createdAt)).toBe(false);
  });

  it('returns false if firstQuestionFree is disabled', () => {
    const createdAt = new Date();
    const config = { ...DEFAULT_PRICING, firstQuestionFree: false };
    expect(shouldApplyFreeQuestion('owner-1', false, createdAt, config)).toBe(false);
  });

  it('returns false if promo credits expired (over 90 days)', () => {
    const createdAt = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
    expect(shouldApplyFreeQuestion('owner-1', false, createdAt)).toBe(false);
  });

  it('returns true on exactly day 90', () => {
    const createdAt = new Date(Date.now() - 89 * 24 * 60 * 60 * 1000);
    expect(shouldApplyFreeQuestion('owner-1', false, createdAt)).toBe(true);
  });
});

describe('calculateChargeAmount', () => {
  it('returns 0 when first question is free', () => {
    expect(calculateChargeAmount(true, 0)).toBe(0);
  });

  it('returns 0 even with credits when first question is free', () => {
    expect(calculateChargeAmount(true, 500)).toBe(0);
  });

  it('returns full price when not a free question', () => {
    expect(calculateChargeAmount(false, 0)).toBe(499);
  });
});

describe('calculateVetPayout', () => {
  it('calculates 80/20 split by default', () => {
    const result = calculateVetPayout(499, 0.20);
    expect(result.vetPayoutCents).toBe(399);
    expect(result.platformFeeCents).toBe(100);
  });

  it('handles custom fee percentage', () => {
    const result = calculateVetPayout(1000, 0.15);
    expect(result.vetPayoutCents).toBe(850);
    expect(result.platformFeeCents).toBe(150);
  });

  it('rounds to integer cents', () => {
    const result = calculateVetPayout(99, 0.20);
    expect(result.platformFeeCents).toBe(20);
    expect(result.vetPayoutCents).toBe(79);
  });
});

// ═══════════════════════════════════════════════════════════════
// WALLET LEDGER
// ═══════════════════════════════════════════════════════════════

describe('InMemoryWalletStore', () => {
  it('returns null for unknown owner', async () => {
    const store = new InMemoryWalletStore();
    const balance = await store.get('nonexistent');
    expect(balance).toBeNull();
  });

  it('credits and tracks balance', async () => {
    const store = new InMemoryWalletStore();
    await store.credit('owner-1', 199);
    const balance = await store.get('owner-1');
    expect(balance!.balanceCents).toBe(199);
    expect(balance!.lifetimeCreditsCents).toBe(199);
    expect(balance!.version).toBe(1);
  });

  it('debits and tracks balance', async () => {
    const store = new InMemoryWalletStore();
    await store.credit('owner-1', 500);
    await store.debit('owner-1', 200);
    const balance = await store.get('owner-1');
    expect(balance!.balanceCents).toBe(300);
    expect(balance!.lifetimeDebitsCents).toBe(200);
  });

  it('throws on insufficient balance debit', async () => {
    const store = new InMemoryWalletStore();
    await store.credit('owner-1', 100);
    await expect(store.debit('owner-1', 200)).rejects.toThrow('insufficient_balance');
  });

  it('throws on debit from non-existent wallet', async () => {
    const store = new InMemoryWalletStore();
    await expect(store.debit('owner-1', 100)).rejects.toThrow('insufficient_balance');
  });
});

describe('WalletLedger', () => {
  it('wraps store and checks sufficient balance', async () => {
    const store = new InMemoryWalletStore();
    await store.credit('owner-1', 500);
    const ledger = new WalletLedger(store);
    expect(await ledger.hasSufficientBalance('owner-1', 300)).toBe(true);
    expect(await ledger.hasSufficientBalance('owner-1', 600)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════
// PAYMENT SERVICE
// ═══════════════════════════════════════════════════════════════

describe('PaymentService', () => {
  const makeOwner = (overrides?: Partial<OwnerForPricing>): OwnerForPricing => ({
    id: 'owner-1',
    promoCreditsUsed: false,
    createdAt: new Date(),
    walletBalanceCents: 199,
    ...overrides,
  });

  it('processes free first question — no payment authorization needed', async () => {
    const walletStore = new InMemoryWalletStore();
    await walletStore.credit('owner-1', 199);
    const service = new PaymentService(new WalletLedger(walletStore));

    const result = await service.processConsultPayment(
      makeOwner({ promoCreditsUsed: false }),
      'pm_test',
      'stripe_connect',
      'acct_test',
    );

    expect(result.isFreeQuestion).toBe(true);
    expect(result.authorization.status).toBe('captured');
    expect(result.authorization.amountCents).toBe(0);
  });

  it('processes free question regardless of wallet balance', async () => {
    const walletStore = new InMemoryWalletStore();
    // No wallet credits at all
    const service = new PaymentService(new WalletLedger(walletStore));

    const result = await service.processConsultPayment(
      makeOwner({ walletBalanceCents: 0 }),
      'pm_test',
      'stripe_connect',
      'acct_test',
    );

    expect(result.isFreeQuestion).toBe(true);
    expect(result.authorization.amountCents).toBe(0);
  });

  it('processes paid consult when promo already used', async () => {
    const walletStore = new InMemoryWalletStore();
    await walletStore.credit('owner-1', 500);
    const service = new PaymentService(new WalletLedger(walletStore));

    const result = await service.processConsultPayment(
      makeOwner({ promoCreditsUsed: true }),
      'pm_test',
      'stripe_connect',
      'acct_test',
    );

    expect(result.isFreeQuestion).toBe(false);
    expect(result.authorization.amountCents).toBe(499); // full price
  });

  it('processes vet payout with 80/20 split', async () => {
    const service = new PaymentService();

    const result = await service.processVetPayout(
      'vet-1',
      499,
      'stripe_connect',
      'acct_connect_test',
    );

    expect(result.amountCents).toBe(399); // 499 * 0.8 = 399
    expect(result.status).toBe('processing');
  });

  it('uses correct adapter based on payment rail', async () => {
    const service = new PaymentService();
    const wiseResult = await service.processVetPayout(
      'vet-in-1',
      499,
      'wise',
      'wise_recipient_test',
    );

    expect(wiseResult.rail).toBe('wise');
    expect(wiseResult.status).toBe('processing');
  });
});
