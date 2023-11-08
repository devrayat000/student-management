import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { IStudent, IStudentWithClassAndBatch } from "../schema";

async function create(data: Omit<IStudent, "id">) {
  for (const key in data) {
    if (
      Object.prototype.hasOwnProperty.call(data, key) &&
      typeof data[key as keyof typeof data] === "undefined"
    ) {
      delete data[key as keyof typeof data];
    }
  }
  const { text, values } = bricks.insert("students", data).toParams();
  return await db().execute(text, values);
}

async function update({ id, ...data }: IStudent) {
  const { text, values } = bricks
    .update("students", data)
    .where("id", id)
    .toParams();
  return await db().execute(text, values);
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  const { text, values } = bricks.delete("students").where("id", id).toParams();
  return await db().execute(text, values);
}

async function readOne(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const { text, values } = bricks
    .select([
      "students.id AS id",
      "students.name AS name",
      "classes.name AS class",
      "batches.name AS batch",
      "students.phone AS phone",
    ])
    .from("students")
    .leftJoin("classes", { "students.classId": "classes.id" })
    .leftJoin("batches", { "students.batchId": "batches.id" })
    .where("students.id", id)
    .toParams();
  // console.log(text, values);

  const result = await db().select<IStudentWithClassAndBatch[]>(text, values);
  return result.length ? result[0] : null;
}

async function readAll() {
  const { text, values } = bricks
    .select([
      "students.id AS id",
      "students.name AS name",
      "classes.name AS class",
      "batches.name AS batch",
      "students.phone AS phone",
      `CASE
        WHEN payments.id IS NOT NULL AND payments.amount IS NOT NULL THEN 'paid'
        ELSE 'unpaid'
      END AS paymentStatus`,
    ])
    .from("students")
    .leftJoin("classes", { "students.classId": "classes.id" })
    .leftJoin("batches", { "students.batchId": "batches.id" })
    .leftJoin("payments", { "payments.studentId": "students.id" })
    .toParams();
  const result = await db().select<IStudentWithClassAndBatch[]>(text, values);
  console.log(result);

  return result;
}

async function deleteMany(ids: (string | number)[]) {
  ids = ids.map((id) => (typeof id === "string" ? parseInt(id) : id));
  const { text, values } = bricks
    .delete("students")
    .where(bricks.in("id", ids))
    .toParams();
  return await db().execute(text, values);
}

export { del as delete, create, update, readOne, readAll, deleteMany };
