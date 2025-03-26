import { db } from "~/lib/utils";
import { classes } from "../schema";
import { eq, inArray, InferInsertModel } from "drizzle-orm";

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

  const result = await db.query.classes.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
  return result;
}

async function readAll() {
  return await db.select().from(classes);
}

async function deleteMany(ids: (string | number)[]) {
  const mappedIds = ids.map((id) =>
    typeof id === "string" ? parseInt(id) : id
  );
  return await db
    .delete(classes)
    .where(inArray(classes.id, mappedIds))
    .returning();
}

export { del as delete, create, update, readOne, readAll, deleteMany };
