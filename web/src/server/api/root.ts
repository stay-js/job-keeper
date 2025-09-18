import { positionRouter } from './routers/position';
import { jobRouter } from './routers/job';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  position: positionRouter,
  job: jobRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
