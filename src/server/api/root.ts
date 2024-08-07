import { wageRouter } from './routers/wage';
import { jobRouter } from './routers/job';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  wage: wageRouter,
  job: jobRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
