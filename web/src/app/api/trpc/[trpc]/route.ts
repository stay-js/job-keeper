import type { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { env } from '~/env';

const createContext = async (req: NextRequest) => createTRPCContext({ headers: req.headers });

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : undefined,
  });
}

export { handler as GET, handler as POST };
