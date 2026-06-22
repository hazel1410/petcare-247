import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@petcare/api';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      async headers() {
        const token = localStorage.getItem('auth-token');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
