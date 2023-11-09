import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { IBatch } from "../schema";

async function create(data: Pick<IBatch, "name">) {
  const { text, values } = bricks
    .insert("batches", { name: data.name })
    .toParams();
  return await db().execute(text, values);
}

async function update(data: IBatch) {
  const { text, values } = bricks
    .update("batches", { name: data.name })
    .where("id", data.id)
    .toParams();
  return await db().execute(text, values);
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  const { text, values } = bricks.delete("batches").where("id", id).toParams();
  return await db().execute(text, values);
}

async function readOne(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const { text, values } = bricks
    .select()
    .from("batches")
    .where("id", id)
    .toParams();
  const result = await db().select<IBatch[]>(text, values);
  return result.length ? result[0] : null;
}

async function readAll() {
  const { text, values } = bricks.select().from("batches").toParams();
  const result = await db().select<IBatch[]>(text, values);

  return result;
}

async function deleteMany(ids: (string | number)[]) {
  ids = ids.map((id) => (typeof id === "string" ? parseInt(id) : id));
  const { text, values } = bricks
    .delete("batches")
    .where(bricks.in("id", ids))
    .toParams();
  return await db().execute(text, values);
}

async function count() {
  const { text, values } = bricks
    .select(["COUNT(*) AS batchCount"])
    .from("batches")
    .toParams();
  const result = await db().select<{ batchCount: number }[]>(text, values);
  return result[0];
}

export { del as delete, create, update, readOne, readAll, deleteMany, count };
