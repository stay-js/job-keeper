import { eq, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { jobs, positions } from '~/server/db/schema';

const jobSchema = z.object({
  location: z.string().min(1),
  event: z.string().min(1),
  date: z.date(),
  hours: z.number(),
  positionId: z.number(),
});

export const jobRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    return ctx.db
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
      .where(eq(jobs.userId, authObject.userId))
      .innerJoin(positions, eq(positions.id, jobs.positionId))
      .orderBy(jobs.date)
      .execute();
  }),

  create: publicProcedure.input(jobSchema).mutation(async ({ ctx, input }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    await ctx.db.insert(jobs).values({ ...input, userId: authObject.userId });
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    await ctx.db.delete(jobs).where(and(eq(jobs.id, input.id), eq(jobs.userId, authObject.userId)));
  }),

  update: publicProcedure
    .input(jobSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const authObject = await auth();
      if (!authObject.userId) throw new Error('Unauthorized');

      await ctx.db
        .update(jobs)
        .set(input)
        .where(and(eq(jobs.id, input.id), eq(jobs.userId, authObject.userId)));
    }),
});
