import { positionRouter } from './routers/position';
import { jobRouter } from './routers/job';
import { userPreferencesRouter } from './routers/user-preferences';
import { expenseRouter } from './routers/expenses';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  position: positionRouter,
  job: jobRouter,
  userPreferences: userPreferencesRouter,
  expense: expenseRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
