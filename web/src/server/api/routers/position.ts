import { eq, sum, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { positions, jobs } from '~/server/db/schema';

const positionSchema = z.object({
  name: z.string().min(1),
  wage: z.number().min(0),
});

export const positionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    return ctx.db
      .select({ id: positions.id, name: positions.name, wage: positions.wage })
      .from(positions)
      .where(eq(positions.userId, authObject.userId))
      .orderBy(positions.name)
      .execute();
  }),

  getAllWithHoursWorked: publicProcedure.query(async ({ ctx }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

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
      .where(eq(positions.userId, authObject.userId))
      .groupBy(positions.id)
      .orderBy(positions.name)
      .execute();
  }),

  create: publicProcedure.input(positionSchema).mutation(async ({ ctx, input }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    await ctx.db.insert(positions).values({ ...input, userId: authObject.userId });
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const authObject = await auth();
    if (!authObject.userId) throw new Error('Unauthorized');

    await ctx.db
      .delete(positions)
      .where(and(eq(positions.id, input.id), eq(positions.userId, authObject.userId)));
  }),

  update: publicProcedure
    .input(positionSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const authObject = await auth();
      if (!authObject.userId) throw new Error('Unauthorized');

      await ctx.db
        .update(positions)
        .set(input)
        .where(and(eq(positions.id, input.id), eq(positions.userId, authObject.userId)));
    }),
});
