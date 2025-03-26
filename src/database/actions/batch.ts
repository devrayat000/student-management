import { count as dbCount, eq, inArray, InferInsertModel } from "drizzle-orm";
import { db } from "~/lib/utils";
import { batches } from "../schema";

async function create(data: InferInsertModel<typeof batches>) {
  return await db.insert(batches).values(data).returning();
}

interface UpdateClass extends InferInsertModel<typeof batches> {
  id: number;
}

async function update({ id, ...data }: UpdateClass) {
  return await db
    .update(batches)
    .set(data)
    .where(eq(batches.id, id))
    .returning();
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  return await db.delete(batches).where(eq(batches.id, id)).returning();
}

async function readOne(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const result = await db.query.batches.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
  return result;
}

async function readAll() {
  return await db.select().from(batches);
}

async function deleteMany(ids: (string | number)[]) {
  const mappedIds = ids.map((id) =>
    typeof id === "string" ? parseInt(id) : id
  );
  return await db
    .delete(batches)
    .where(inArray(batches.id, mappedIds))
    .returning();
}

async function count() {
  const result = await db
    .select({ batchCount: dbCount(batches.id) })
    .from(batches);
  return result[0];
}

export { del as delete, create, update, readOne, readAll, deleteMany, count };
