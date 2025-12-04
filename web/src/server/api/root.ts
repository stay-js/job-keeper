import { positionsRouter } from './routers/positions';
import { jobsRouter } from './routers/jobs';
import { userPreferencesRouter } from './routers/user-preferences';
import { expensesRouter } from './routers/expenses';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  positions: positionsRouter,
  jobs: jobsRouter,
  userPreferences: userPreferencesRouter,
  expenses: expensesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
