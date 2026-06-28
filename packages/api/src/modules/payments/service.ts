import { v4 as uuid } from 'uuid';
import { PaymentAdapter } from './adapters/types';
import { StripeConnectAdapter } from './adapters/stripe';
import { WiseAdapter } from './adapters/wise';
import { WalletLedger, InMemoryWalletStore } from './wallet';
import { calculateChargeAmount, calculateVetPayout, shouldApplyFreeQuestion, DEFAULT_PRICING } from './pricing';
import {
  PaymentConfig,
  PaymentRail,
  PaymentAuthorization,
  PayoutResult,
  WalletBalance,
} from './types';

const adapterRegistry: Record<PaymentRail, PaymentAdapter> = {
  stripe_connect: new StripeConnectAdapter(),
  wise: new WiseAdapter(),
};

export interface OwnerForPricing {
  id: string;
  promoCreditsUsed: boolean;
  createdAt: Date;
  walletBalanceCents: number;
}

export class PaymentService {
  private walletLedger: WalletLedger;
  private config: PaymentConfig;

  constructor(
    walletLedger?: WalletLedger,
    config?: Partial<PaymentConfig>,
  ) {
    this.walletLedger = walletLedger ?? new WalletLedger(new InMemoryWalletStore());
    this.config = { ...DEFAULT_PRICING, ...config };
  }

  async processConsultPayment(
    owner: OwnerForPricing,
    paymentMethodId: string,
    vetRail: PaymentRail,
    vetDestinationId: string,
  ): Promise<{
    authorization: PaymentAuthorization;
    walletBalance: WalletBalance | null;
    isFreeQuestion: boolean;
  }> {
    const isFree = shouldApplyFreeQuestion(
      owner.id,
      owner.promoCreditsUsed,
      owner.createdAt,
      this.config,
    );

    const chargeAmount = calculateChargeAmount(
      isFree,
      owner.walletBalanceCents,
      this.config,
    );

    // Free question — no payment needed
    if (isFree) {
      const walletBalance = await this.walletLedger.getBalance(owner.id);
      return {
        authorization: {
          id: `free_${uuid()}`,
          status: 'captured',
          amountCents: 0,
          currency: this.config.currency,
        },
        walletBalance,
        isFreeQuestion: true,
      };
    }

    // Paid consult — authorize via payment rail
    const adapter = adapterRegistry[vetRail] ?? adapterRegistry.stripe_connect;
    const authorization = await adapter.authorize({
      ownerId: owner.id,
      amountCents: chargeAmount,
      currency: this.config.currency,
      paymentMethodId,
      description: `PetCare 24/7 consultation`,
    });

    if (authorization.status === 'authorized') {
      await adapter.capture({
        authorizationId: authorization.id,
        amountCents: chargeAmount,
      });
    }

    return {
      authorization,
      walletBalance: await this.walletLedger.getBalance(owner.id),
      isFreeQuestion: false,
    };
  }

  async processVetPayout(
    vetId: string,
    chargeAmountCents: number,
    rail: PaymentRail,
    destinationId: string,
  ): Promise<PayoutResult> {
    const { vetPayoutCents } = calculateVetPayout(chargeAmountCents, 0.20);
    const adapter = adapterRegistry[rail] ?? adapterRegistry.stripe_connect;

    return adapter.payout({
      vetId,
      amountCents: vetPayoutCents,
      currency: this.config.currency,
      rail,
      destinationId,
    });
  }

  getWalletLedger(): WalletLedger {
    return this.walletLedger;
  }
}
