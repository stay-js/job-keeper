import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userData } from '~/server/db/schema';

const userDataSchema = z.object({
  currency: z.string().min(1).max(16),
  dateFormat: z.string().min(1).max(16),
  precision: z.number().min(0).max(10),
});

export const userDataRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
    });
  }),
  upsertUserData: protectedProcedure.input(userDataSchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
    });

    if (existing) {
      return ctx.db.update(userData).set(input).where(eq(userData.userId, ctx.auth.userId));
    }

    return ctx.db.insert(userData).values({
      ...input,
      userId: ctx.auth.userId,
    });
  }),
});
