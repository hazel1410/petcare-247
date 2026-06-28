import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export interface TRPCContext {
  db: {
    from(table: string): {
      insert(data: Record<string, unknown>): Promise<{ error?: { message: string } }>;
    };
  };
  user?: {
    id: string;
    role: string;
  };
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Auth middleware — for future use
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
