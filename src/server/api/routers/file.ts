import { TRPCError } from "@trpc/server";
import { set, z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { files } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const fileRouter = createTRPCRouter({
  isAnnotated: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.query.files.findFirst({
        where: ((file, { eq }) => eq(file.name, input.name)),
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return file.annotated;
    }),

  setAnnotated: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.update(files)
        .set({ annotated: true })
        .where(eq(files.name, input.name));

      return true;
    }),
});
