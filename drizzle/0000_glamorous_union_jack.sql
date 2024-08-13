CREATE TABLE IF NOT EXISTS "esgquest_file" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(1024) NOT NULL,
	CONSTRAINT "esgquest_file_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "esgquest_note" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(1024) NOT NULL,
	"chunk" integer NOT NULL,
	"area" json NOT NULL,
	"file_id" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "esgquest_file" ("name");