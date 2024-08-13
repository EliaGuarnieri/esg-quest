import { TRPCError } from "@trpc/server";
import { z } from "zod";

import json from "@/app/api/prova_ferrovie.json";
import { transformJsonString } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type Drizzle } from "@/server/db";
import { notes } from "@/server/db/schema";
import { insertNoteSchema } from "@/server/db/zod";

const getFileIdByName = async ({name, db} : {name: string, db: Drizzle}) => {
  const file = await db.query.files.findFirst({
    where: ((file, { eq }) => eq(file.name, name)),
  });

  return file?.id;
}

export const annotationRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      /**
       * TODO: Replace this with a call to the database (save the JSON in files table when annotation is triggered could be a solution)
       */
      const data = transformJsonString(json);
      return data;
    }),

  getAll: publicProcedure
    .input(z.object({ name: z.string(), pageIndex: z.number() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.query.files.findFirst({
        where: ((file, { eq }) => eq(file.name, input.name)),
        with: {
          notes: true,
        }
      });

      return file?.notes.filter((note) => note.area.pageIndex === input.pageIndex);
    }),

  add: publicProcedure
    .input(insertNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const noteAlreadyExists = await ctx.db.query.notes.findFirst({
        where: ((note, { eq }) => eq(note.id, input.id)),
        columns: {
          id: true,
        }
      });

      if (noteAlreadyExists) return;

      const fileId = await getFileIdByName({
        name: input.fileName,
        db: ctx.db
      })

      if (!fileId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      const newNote = await ctx.db.insert(notes).values({
        id: input.id,
        text: input.text,
        area: input.area,
        fileId: fileId,
      }).returning();

      return newNote;

    }),
});
