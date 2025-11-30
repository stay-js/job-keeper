import { eq, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { jobs, positions } from '~/server/db/schema';

const jobSchema = z.object({
  location: z.string().min(1).max(256),
  event: z.string().max(256).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val))),
  hours: z.number().min(0).max(24),
  positionId: z.number(),
});

export const jobRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        id: jobs.id,
        date: jobs.date,
        location: jobs.location,
        event: jobs.event,
        hours: jobs.hours,
        position: positions.name,
        positionId: jobs.positionId,
        wage: positions.wage,
        payout: sql<number>`${jobs.hours} * ${positions.wage}`,
      })
      .from(jobs)
      .where(eq(jobs.userId, ctx.auth.userId))
      .innerJoin(positions, eq(positions.id, jobs.positionId))
      .orderBy(jobs.date)
      .execute();

    return data.map((item) => ({ ...item, date: new Date(item.date) }));
  }),

  create: protectedProcedure.input(jobSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(jobs).values({ ...input, userId: ctx.auth.userId });
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.db.delete(jobs).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.auth.userId)));
  }),

  update: protectedProcedure
    .input(jobSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(jobs)
        .set(input)
        .where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.auth.userId)));
    }),
});
