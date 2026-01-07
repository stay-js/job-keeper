import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userPreferences } from '~/server/db/schema';

const userPreferencesSchema = z.object({
  currency: z.string().trim().min(1).max(16),
  locale: z.string().trim().min(1).max(16),
  precision: z.number().min(0).max(10),
});

export const userPreferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, ctx.auth.userId),
    });
  }),
  upsert: protectedProcedure.input(userPreferencesSchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, ctx.auth.userId),
    });

    if (existing) {
      return ctx.db
        .update(userPreferences)
        .set(input)
        .where(eq(userPreferences.userId, ctx.auth.userId));
    }

    return ctx.db.insert(userPreferences).values({
      ...input,
      userId: ctx.auth.userId,
    });
  }),
});
