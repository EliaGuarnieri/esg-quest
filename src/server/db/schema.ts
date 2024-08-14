// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type HighlightArea } from "@react-pdf-viewer/highlight";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTableCreator,
  serial,
  varchar,
} from "drizzle-orm/pg-core";


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `esgquest_${name}`);

export const files = createTable(
  "file",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    url: varchar("url", { length: 1024 }).notNull(),
  },
  (file) => ({
    nameIndex: index("name_idx").on(file.name),
  })
)

export const filesRelations = relations(files, ({ many }) => ({
  notes: many(notes),
}))

export const notes = createTable(
  "note",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    text: varchar("text", { length: 1024 }).notNull(),
    areas: json("areas").$type<HighlightArea[]>().notNull(),
    fileId: integer("file_id").notNull(),
    pageIndex: integer("page_index").notNull(),
    objective: varchar("objective", { length: 256 }),
    condition: varchar("condition", { length: 256 }),
  },
)

export const notesRelations = relations(notes, ({ one }) => ({
  file: one(files, {
    fields: [notes.fileId],
    references: [files.id],
  }),
}))
