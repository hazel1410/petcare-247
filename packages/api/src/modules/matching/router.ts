import { z } from 'zod';
import { router, publicProcedure } from '../../trpc';
import { MatchingService } from './service';
import { VetMatchRequest } from './types';

const matchingService = new MatchingService();

export const matchingRouter = router({
  findMatch: publicProcedure
    .input(
      z.object({
        triageSessionId: z.string().uuid(),
        ownerId: z.string().uuid(),
        ownerRegion: z.string().min(1).max(10),
        petSpecies: z.string().min(1).max(100),
        petAgeYears: z.number().int().min(0).max(50).optional(),
        urgencyScore: z.string(),
        symptoms: z.array(z.string()).min(1),
        ownerTimezone: z.string().min(1),
        preferredLanguages: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return matchingService.findMatch(input as VetMatchRequest);
    }),

  recordResponse: publicProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        accepted: z.boolean(),
        vetId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      return matchingService.recordResponse(input.requestId, {
        accepted: input.accepted,
        vetId: input.vetId,
        respondedAt: new Date().toISOString(),
      });
    }),

  checkSLA: publicProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .query(async ({ input }) => {
      return matchingService.checkSLA(input.requestId);
    }),
});
