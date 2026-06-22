import { initTRPC, TRPCError } from '@trpc/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { UserRole } from '@petcare/shared';

export interface TRPCContext {
  supabase: SupabaseClient;
  user: User | null;
  userRole: UserRole | null;
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const vetProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'vet') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Vet access required' });
  }
  return next({ ctx: { ...ctx, userRole: 'vet' as const } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx: { ...ctx, userRole: 'admin' as const } });
});
