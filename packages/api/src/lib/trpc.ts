import { initTRPC } from '@trpc/server';
import { supabase } from './supabase';

export interface TRPCContext {
  supabase: typeof supabase;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  userRole: 'owner' | 'vet' | 'admin' | null;
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
