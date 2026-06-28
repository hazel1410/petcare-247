import { z } from 'zod';
import { router, publicProcedure } from '../../trpc';
import { PaymentService } from './service';

const paymentService = new PaymentService();

export const paymentsRouter = router({
  processConsultPayment: publicProcedure
    .input(
      z.object({
        ownerId: z.string().uuid(),
        promoCreditsUsed: z.boolean(),
        ownerCreatedAt: z.string().datetime(),
        walletBalanceCents: z.number().int().min(0),
        paymentMethodId: z.string().min(1),
        vetRail: z.enum(['stripe_connect', 'wise']),
        vetDestinationId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      return paymentService.processConsultPayment(
        {
          id: input.ownerId,
          promoCreditsUsed: input.promoCreditsUsed,
          createdAt: new Date(input.ownerCreatedAt),
          walletBalanceCents: input.walletBalanceCents,
        },
        input.paymentMethodId,
        input.vetRail as 'stripe_connect' | 'wise',
        input.vetDestinationId,
      );
    }),

  processVetPayout: publicProcedure
    .input(
      z.object({
        vetId: z.string().uuid(),
        chargeAmountCents: z.number().int().min(1),
        rail: z.enum(['stripe_connect', 'wise']),
        destinationId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      return paymentService.processVetPayout(
        input.vetId,
        input.chargeAmountCents,
        input.rail as 'stripe_connect' | 'wise',
        input.destinationId,
      );
    }),

  getWalletBalance: publicProcedure
    .input(z.object({ ownerId: z.string().uuid() }))
    .query(async ({ input }) => {
      return paymentService.getWalletLedger().getBalance(input.ownerId);
    }),
});
