import { z } from 'zod';
import { router, publicProcedure } from '../../trpc';
import { TriageService } from './service';

const triageService = new TriageService();

export const triageRouter = router({
  evaluate: publicProcedure
    .input(
      z.object({
        description: z.string().min(10).max(5000),
        symptoms: z.array(z.string().min(1)).min(1).max(20),
        species: z.string().min(1).max(100),
        ageYears: z.number().int().min(0).max(50).optional(),
        ageMonths: z.number().int().min(0).max(11).optional(),
        weightKg: z.number().min(0.1).max(1000).optional(),
        knownConditions: z.array(z.string()).max(20).optional(),
        medications: z.array(z.string()).max(20).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return triageService.evaluate(input, ctx.db);
    }),
});
