import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { wages } from '~/server/db/schema';

const wageSchema = z.object({
  name: z.string().min(1),
  wage: z.number().min(1),
});

export const wageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.wages.findMany();
  }),

  create: publicProcedure.input(wageSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(wages).values(input);
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(wages).where(eq(wages.id, input.id));
  }),

  update: publicProcedure
    .input(wageSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(wages)
        .set({ name: input.name, wage: input.wage })
        .where(eq(wages.id, input.id));
    }),
});
