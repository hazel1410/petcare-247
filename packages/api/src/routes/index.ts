import { router } from '../lib/trpc';
import { triageRouter } from '../modules/triage/router';
import { matchingRouter } from '../modules/matching/router';
import { paymentsRouter } from '../modules/payments/router';

export const appRouter = router({
  triage: triageRouter,
  matching: matchingRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;
