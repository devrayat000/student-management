import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  id: integer().primaryKey(),
  name: text().notNull(),
  classId: integer().references(() => classes.id, { onDelete: "cascade" }),
  batchId: integer().references(() => batches.id, { onDelete: "cascade" }),
  phone: text().notNull(),
});

export const classes = sqliteTable("classes", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const batches = sqliteTable("batches", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const payments = sqliteTable(
  "payments",
  {
    studentId: integer()
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    month: integer({ mode: "number" }).notNull(),
    year: integer({ mode: "number" }).notNull(),
    amount: integer().notNull(),
    paymentDate: integer({ mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.studentId, table.month, table.year],
      name: "payment_pk",
    }),
  ]
);
