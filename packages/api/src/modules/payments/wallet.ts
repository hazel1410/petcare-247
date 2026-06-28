import { WalletBalance, WalletCreditOperation } from './types';

interface WalletStore {
  get(ownerId: string): Promise<WalletBalance | null>;
  credit(ownerId: string, amountCents: number): Promise<WalletCreditOperation>;
  debit(ownerId: string, amountCents: number): Promise<WalletCreditOperation>;
}

export class WalletLedger {
  private store: WalletStore;

  constructor(store: WalletStore) {
    this.store = store;
  }

  async getBalance(ownerId: string): Promise<WalletBalance | null> {
    return this.store.get(ownerId);
  }

  async addCredits(ownerId: string, amountCents: number): Promise<WalletCreditOperation> {
    return this.store.credit(ownerId, amountCents);
  }

  async deductCredits(ownerId: string, amountCents: number): Promise<WalletCreditOperation> {
    const balance = await this.store.get(ownerId);
    if (!balance || balance.balanceCents < amountCents) {
      throw new Error('insufficient_balance');
    }
    return this.store.debit(ownerId, amountCents);
  }

  async hasSufficientBalance(ownerId: string, amountCents: number): Promise<boolean> {
    const balance = await this.store.get(ownerId);
    return (balance?.balanceCents ?? 0) >= amountCents;
  }
}

// In-memory store for testing; Supabase replaces this in production
export class InMemoryWalletStore implements WalletStore {
  private wallets = new Map<string, WalletBalance>();

  async get(ownerId: string): Promise<WalletBalance | null> {
    return this.wallets.get(ownerId) ?? null;
  }

  async credit(ownerId: string, amountCents: number): Promise<WalletCreditOperation> {
    const existing = this.wallets.get(ownerId) ?? {
      ownerId,
      balanceCents: 0,
      lifetimeCreditsCents: 0,
      lifetimeDebitsCents: 0,
      version: 0,
      promoCreditsUsed: false,
    };
    existing.balanceCents += amountCents;
    existing.lifetimeCreditsCents += amountCents;
    existing.version += 1;
    this.wallets.set(ownerId, existing);
    return { ownerId, amountCents, newBalanceCents: existing.balanceCents };
  }

  async debit(ownerId: string, amountCents: number): Promise<WalletCreditOperation> {
    const existing = this.wallets.get(ownerId);
    if (!existing || existing.balanceCents < amountCents) {
      throw new Error('insufficient_balance');
    }
    existing.balanceCents -= amountCents;
    existing.lifetimeDebitsCents += amountCents;
    existing.version += 1;
    this.wallets.set(ownerId, existing);
    return { ownerId, amountCents, newBalanceCents: existing.balanceCents };
  }
}
