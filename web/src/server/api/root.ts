import { positionRouter } from './routers/position';
import { jobRouter } from './routers/job';
import { userDataRouter } from './routers/user-data';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  position: positionRouter,
  job: jobRouter,
  userData: userDataRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
