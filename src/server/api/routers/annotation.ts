import { z } from "zod";

import json from "@/app/api/prova_ferrovie.json";
import { transformJsonString } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const annotationRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const data = transformJsonString(json);
      return data;
    }),
});
