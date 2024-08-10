import { eq, sum, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { positions, jobs } from '~/server/db/schema';

const positionSchema = z.object({
  name: z.string().min(1),
  wage: z.number(),
});

export const positionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) =>
    ctx.db
      .select({ id: positions.id, name: positions.name, wage: positions.wage })
      .from(positions)
      .orderBy(positions.name)
      .execute(),
  ),

  getAllWithHoursWorked: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: positions.id,
        position: positions.name,
        wage: positions.wage,
        hoursWorked: sum(jobs.hours) || 0,
        payout: sql<number>`${sum(jobs.hours)} * ${positions.wage}`,
      })
      .from(positions)
      .leftJoin(jobs, eq(positions.id, jobs.wageId))
      .groupBy(positions.id)
      .orderBy(positions.name)
      .execute();
  }),

  create: publicProcedure.input(positionSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(positions).values(input);
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(positions).where(eq(positions.id, input.id));
  }),

  update: publicProcedure
    .input(positionSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(positions)
        .set({ name: input.name, wage: input.wage })
        .where(eq(positions.id, input.id));
    }),
});
