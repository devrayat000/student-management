import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { IClass } from "../schema";

async function create(data: Pick<IClass, "name">) {
  const { text, values } = bricks
    .insert("classes", { name: data.name })
    .toParams();
  return await db().execute(text, values);
}

async function update(data: IClass) {
  const { text, values } = bricks
    .update("classes", { name: data.name })
    .where("id", data.id)
    .toParams();
  return await db().execute(text, values);
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  const { text, values } = bricks.delete("classes").where("id", id).toParams();
  return await db().execute(text, values);
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
  const { text, values } = bricks.select().from("classes").toParams();
  const result = await db().select<IClass[]>(text, values);

  return result;
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
