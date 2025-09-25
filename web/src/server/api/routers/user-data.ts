import { eq, sum, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userData } from '~/server/db/schema';

const userDataSchema = z.object({
  userId: z.string().min(1),
  currency: z.string().min(1).max(16),
  locale: z.string().min(1).max(16),
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
      return ctx.db
        .update(userData)
        .set({
          currency: input.currency,
          locale: input.locale,
          precision: input.precision,
        })
        .where(eq(userData.userId, ctx.auth.userId));
    }

    return ctx.db.insert(userData).values({
      userId: ctx.auth.userId,
      currency: input.currency,
      locale: input.locale,
      precision: input.precision,
    });
  }),
});
