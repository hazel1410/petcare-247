import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter, type AppRouter } from './routes/index.js';
import type { TRPCContext } from './lib/trpc.js';
import { supabase } from './lib/supabase.js';

const server = Fastify({ maxParamLength: 5000 });

await server.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
});

server.register(fastifyTRPCPlugin<AppRouter>, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: async ({ req }): Promise<TRPCContext> => {
      const authHeader = req.headers.authorization;
      let user = null;
      let userRole = null;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const { data: { user: authUser } } = await supabase.auth.getUser(token);
        user = authUser;
        if (authUser?.user_metadata?.role) {
          userRole = authUser.user_metadata.role as 'owner' | 'vet' | 'admin';
        }
      }

      return { supabase, user, userRole };
    },
  },
});

server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

const port = parseInt(process.env.PORT ?? '3001', 10);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await server.listen({ port, host });
  console.log(`🚀 PetCare API running on http://${host}:${port}`);
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
