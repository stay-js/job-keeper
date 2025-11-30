import { eq, sum, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { positions, jobs } from '~/server/db/schema';

const positionSchema = z.object({
  name: z.string().min(1).max(256),
  wage: z.number().nonnegative(),
});

export const positionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: positions.id, name: positions.name, wage: positions.wage })
      .from(positions)
      .where(eq(positions.userId, ctx.auth.userId))
      .orderBy(positions.name)
      .execute();
  }),

  getAllWithHoursWorked: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: positions.id,
        position: positions.name,
        wage: positions.wage,
        hoursWorked: sql<number>`${sum(jobs.hours)}`,
        payout: sql<number>`${sum(jobs.hours)} * ${positions.wage}`,
      })
      .from(positions)
      .leftJoin(jobs, eq(positions.id, jobs.positionId))
      .where(eq(positions.userId, ctx.auth.userId))
      .groupBy(positions.id)
      .orderBy(positions.name)
      .execute();
  }),

  create: protectedProcedure.input(positionSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(positions).values({ ...input, userId: ctx.auth.userId });
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(positions)
      .where(and(eq(positions.id, input.id), eq(positions.userId, ctx.auth.userId)));
  }),

  update: protectedProcedure
    .input(positionSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(positions)
        .set(input)
        .where(and(eq(positions.id, input.id), eq(positions.userId, ctx.auth.userId)));
    }),
});
