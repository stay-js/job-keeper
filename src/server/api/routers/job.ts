import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { jobs, wages } from '~/server/db/schema';

const jobSchema = z.object({
  location: z.string().min(1),
  event: z.string().min(1),
  date: z.date(),
  hours: z.number(),
  wageId: z.number(),
});

export const jobRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: jobs.id,
        date: jobs.date,
        location: jobs.location,
        event: jobs.event,
        hours: jobs.hours,
        position: wages.name,
        wage: wages.wage,
        payout: sql<number>`${jobs.hours} * ${wages.wage}`,
      })
      .from(jobs)
      .innerJoin(wages, eq(wages.id, jobs.wageId))
      .orderBy(jobs.date)
      .execute();
  }),

  create: publicProcedure.input(jobSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(jobs).values(input);
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(jobs).where(eq(jobs.id, input.id));
  }),

  update: publicProcedure
    .input(jobSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(jobs).set(input).where(eq(jobs.id, input.id));
    }),
});
