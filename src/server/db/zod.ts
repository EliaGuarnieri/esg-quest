import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { files, notes } from './schema';

export const insertFileSchema = createInsertSchema(files).pick({
  name: true,
});
export const selectFileSchema = createSelectSchema(files);

export const insertNoteSchema = createInsertSchema(notes, {
  fileId: (schema) => schema.fileId.optional(),
  areas: z.array(z.object({
    height: z.number(),
    left: z.number(),
    pageIndex: z.number(),
    top: z.number(),
    width: z.number(),
  })),
}).merge(z.object({
  fileName: z.string(),
  }));