import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure, vetProcedure, adminProcedure } from '../lib/trpc.js';
import { signUpSchema, signInSchema, petProfileSchema, questionSchema, vetResponseSchema, reviewSchema, vetVerificationSchema } from '@petcare/shared';

export const appRouter = router({
  auth: router({
    signUp: publicProcedure.input(signUpSchema).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { name: input.name, role: input.role } },
      });
      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      return { user: data.user, session: data.session };
    }),

    signIn: publicProcedure.input(signInSchema).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      if (error) throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message });
      return { user: data.user, session: data.session };
    }),

    me: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('profiles')
        .select('*')
        .eq('id', ctx.user.id)
        .single();
      if (error) throw new TRPCError({ code: 'NOT_FOUND' });
      return data;
    }),
  }),

  pets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('pets')
        .select('*')
        .eq('owner_id', ctx.user.id)
        .order('created_at', { ascending: false });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    create: protectedProcedure.input(petProfileSchema).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('pets')
        .insert({ ...input, owner_id: ctx.user.id })
        .select()
        .single();
      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      return data;
    }),

    get: protectedProcedure.input(z.string().uuid()).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('pets')
        .select('*')
        .eq('id', input)
        .single();
      if (error) throw new TRPCError({ code: 'NOT_FOUND' });
      return data;
    }),
  }),

  questions: router({
    ask: protectedProcedure.input(questionSchema).mutation(async ({ ctx, input }) => {
      const { data: pet } = await ctx.supabase
        .from('pets')
        .select('owner_id')
        .eq('id', input.petId)
        .single();
      if (!pet || pet.owner_id !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const { data: profile } = await ctx.supabase
        .from('profiles')
        .select('questions_asked, credits')
        .eq('id', ctx.user.id)
        .single();

      const freeQuestionsRemaining = Math.max(0, 1 - (profile?.questions_asked ?? 0));
      const hasCredits = (profile?.credits ?? 0) > 0;
      const needsPayment = freeQuestionsRemaining === 0 && !hasCredits;

      const { data, error } = await ctx.supabase
        .from('questions')
        .insert({
          owner_id: ctx.user.id,
          pet_id: input.petId,
          description: input.description,
          symptoms: input.symptoms,
          duration: input.duration,
          amount_cents: needsPayment ? 299 : 0,
          payment_status: needsPayment ? 'pending' : 'free',
          status: 'ai_screening',
          ai_urgency: 'low',
        })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });

      if (!needsPayment) {
        await ctx.supabase.rpc('increment_questions_asked', { user_id: ctx.user.id });
        await ctx.supabase.rpc('decrement_credits_if_needed', { user_id: ctx.user.id });
      }

      return { question: data, needsPayment };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('questions')
        .select('*, pets(name, species), vet:profiles!questions_vet_id_fkey(name)')
        .eq('owner_id', ctx.user.id)
        .order('created_at', { ascending: false });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    get: protectedProcedure.input(z.string().uuid()).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('questions')
        .select('*, pets(*), messages(*), vet_response(*)')
        .eq('id', input)
        .single();
      if (error) throw new TRPCError({ code: 'NOT_FOUND' });
      return data;
    }),
  }),

  vet: router({
    availableQuestions: vetProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('questions')
        .select('*, pets(name, species, breed, age_years, age_months, weight_kg, allergies, medications)')
        .eq('status', 'ai_screening')
        .order('created_at', { ascending: true });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    acceptQuestion: vetProcedure.input(z.string().uuid()).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('questions')
        .update({ vet_id: ctx.user.id, status: 'with_vet' })
        .eq('id', input)
        .eq('status', 'ai_screening')
        .select()
        .single();
      if (error) throw new TRPCError({ code: 'CONFLICT', message: 'Question already taken' });
      return data;
    }),

    respond: vetProcedure.input(vetResponseSchema).mutation(async ({ ctx, input }) => {
      const { data: question } = await ctx.supabase
        .from('questions')
        .select('vet_id')
        .eq('id', input.questionId)
        .single();
      if (!question || question.vet_id !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const { data, error } = await ctx.supabase
        .from('vet_responses')
        .insert({ ...input, vet_id: ctx.user.id })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      await ctx.supabase
        .from('questions')
        .update({ status: 'answered', answered_at: new Date().toISOString() })
        .eq('id', input.questionId);

      await ctx.supabase.rpc('increment_vet_questions_answered', { vet_id: ctx.user.id });

      return data;
    }),

    myQuestions: vetProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('questions')
        .select('*, pets(name, species), owner:profiles!questions_owner_id_fkey(name)')
        .eq('vet_id', ctx.user.id)
        .order('created_at', { ascending: false });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    dashboard: vetProcedure.query(async ({ ctx }) => {
      const { data: profile } = await ctx.supabase
        .from('vet_profiles')
        .select('*')
        .eq('id', ctx.user.id)
        .single();

      const { data: recentQuestions } = await ctx.supabase
        .from('questions')
        .select('*')
        .eq('vet_id', ctx.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: reviews } = await ctx.supabase
        .from('reviews')
        .select('rating')
        .eq('vet_id', ctx.user.id);

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

      return {
        profile,
        recentQuestions: recentQuestions ?? [],
        totalQuestions: recentQuestions?.length ?? 0,
        averageRating: avgRating,
      };
    }),
  }),

  reviews: router({
    create: protectedProcedure.input(reviewSchema).mutation(async ({ ctx, input }) => {
      const { data: question } = await ctx.supabase
        .from('questions')
        .select('owner_id, vet_id')
        .eq('id', input.questionId)
        .single();
      if (!question || question.owner_id !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const { data, error } = await ctx.supabase
        .from('reviews')
        .insert({
          question_id: input.questionId,
          owner_id: ctx.user.id,
          vet_id: question.vet_id,
          rating: input.rating,
          comment: input.comment,
        })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });
      return data;
    }),

    byVet: publicProcedure.input(z.string().uuid()).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('reviews')
        .select('*, owner:profiles!reviews_owner_id_fkey(name)')
        .eq('vet_id', input)
        .order('created_at', { ascending: false });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),
  }),

  payments: router({
    createIntent: protectedProcedure.input(z.object({
      questionId: z.string().uuid(),
      amountCents: z.number().int().positive(),
    })).mutation(async ({ ctx, input }) => {
      const stripe = (await import('../lib/stripe.js')).stripe;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amountCents,
        currency: 'usd',
        metadata: { questionId: input.questionId, userId: ctx.user.id },
      });
      return { clientSecret: paymentIntent.client_secret };
    }),

    buyCredits: protectedProcedure.input(z.object({
      amountCents: z.number().int().positive(),
    })).mutation(async ({ ctx, input }) => {
      const stripe = (await import('../lib/stripe.js')).stripe;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amountCents,
        currency: 'usd',
        metadata: { userId: ctx.user.id, type: 'credit_purchase' },
      });
      return { clientSecret: paymentIntent.client_secret };
    }),
  }),

  admin: router({
    listVets: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('vet_profiles')
        .select('*, profiles(name, email, created_at)')
        .order('created_at', { ascending: false });
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    approveVet: adminProcedure.input(z.string().uuid()).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('vet_profiles')
        .update({ verification_status: 'approved' })
        .eq('id', input)
        .select()
        .single();
      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });
      return data;
    }),

    rejectVet: adminProcedure.input(z.object({
      vetId: z.string().uuid(),
      reason: z.string().max(500),
    })).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('vet_profiles')
        .update({ verification_status: 'rejected' })
        .eq('id', input.vetId)
        .select()
        .single();
      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });
      return data;
    }),

    getMetrics: adminProcedure.query(async ({ ctx }) => {
      const { count: totalUsers } = await ctx.supabase
        .from('profiles').select('*', { count: 'exact', head: true });
      const { count: totalQuestions } = await ctx.supabase
        .from('questions').select('*', { count: 'exact', head: true });
      const { count: answeredQuestions } = await ctx.supabase
        .from('questions').select('*', { count: 'exact', head: true })
        .eq('status', 'answered');
      const { count: pendingVets } = await ctx.supabase
        .from('vet_profiles').select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      return {
        totalUsers: totalUsers ?? 0,
        totalQuestions: totalQuestions ?? 0,
        answeredQuestions: answeredQuestions ?? 0,
        pendingVetVerifications: pendingVets ?? 0,
      };
    }),
  }),

  featureFlags: router({
    list: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('feature_flags')
        .select('*');
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return data ?? [];
    }),

    update: adminProcedure.input(z.object({
      flag: z.string(),
      enabled: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('feature_flags')
        .upsert({ flag: input.flag, enabled: input.enabled })
        .select()
        .single();
      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });
      return data;
    }),
  }),
});

export type AppRouter = typeof appRouter;
