import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { expenses } from '~/server/db/schema';

const expenseSchema = z.object({
  name: z.string().min(1).max(256),
  amount: z.number().nonnegative(),
  date: z.string().refine((date) => !isNaN(Date.parse(date))),
});

export const expensesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, ctx.auth.userId))
      .orderBy(expenses.date)
      .execute();

    return data.map((item) => ({ ...item, date: new Date(item.date) }));
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
    return ctx.db.query.expenses.findFirst({
      where: eq(expenses.id, input.id),
    });
  }),

  create: protectedProcedure.input(expenseSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(expenses).values({ ...input, userId: ctx.auth.userId });
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(expenses)
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, ctx.auth.userId)));
  }),

  update: protectedProcedure
    .input(expenseSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(expenses)
        .set(input)
        .where(and(eq(expenses.id, input.id), eq(expenses.userId, ctx.auth.userId)));
    }),
});
