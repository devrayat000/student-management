import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { classes } from "../schema";
import { eq, InferInsertModel } from "drizzle-orm";

async function create(data: InferInsertModel<typeof classes>) {
  return await db.insert(classes).values(data).returning();
}

interface UpdateClass extends InferInsertModel<typeof classes> {
  id: number;
}

async function update({ id, ...data }: UpdateClass) {
  return await db
    .update(classes)
    .set(data)
    .where(eq(classes.id, id))
    .returning();
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  return await db.delete(classes).where(eq(classes.id, id)).returning();
}

async function readOne(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const { text, values } = bricks
    .select()
    .from("classes")
    .where("id", id)
    .toParams();
  const result = await db().select<IClass[]>(text, values);
  return result.length ? result[0] : null;
}

async function readAll() {
  return await db.select().from(classes);
}

async function deleteMany(ids: (string | number)[]) {
  ids = ids.map((id) => (typeof id === "string" ? parseInt(id) : id));
  const { text, values } = bricks
    .delete("classes")
    .where(bricks.in("id", ids))
    .toParams();
  return await db().execute(text, values);
}

export { del as delete, create, update, readOne, readAll, deleteMany };
