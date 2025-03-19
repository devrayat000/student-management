import { db } from "~/lib/utils";
import { batches, classes, payments, students } from "../schema";
import { InferInsertModel, eq, inArray, count as dbCount } from "drizzle-orm";

async function create(data: InferInsertModel<typeof students>) {
  return await db.insert(students).values(data).returning();
}

interface UpdateStudent extends InferInsertModel<typeof students> {
  id: number;
}

async function update({ id, ...data }: UpdateStudent) {
  return await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
}

async function del(id: string | number) {
  id = typeof id === "string" ? parseInt(id) : id;
  return await db.delete(students).where(eq(students.id, id)).returning();
}

async function readOne(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const stds = await db
    .select({
      id: students.id,
      name: students.name,
      class: classes.name,
      batch: batches.name,
      phone: students.phone,
    })
    .from(students)
    .leftJoin(classes, eq(students.classId, classes.id))
    .leftJoin(batches, eq(students.batchId, batches.id))
    // .rightJoin(payments, eq(payments.studentId, students.id))
    .where(eq(students.id, id));
  return stds[0];
}

async function readRaw() {
  return await db
    .select({
      id: students.id,
      name: students.name,
      class: classes.name,
      batch: batches.name,
      phone: students.phone,
    })
    .from(students)
    .leftJoin(classes, eq(students.classId, classes.id))
    .leftJoin(batches, eq(students.batchId, batches.id))
    .rightJoin(payments, eq(payments.studentId, students.id));
}

async function readAll() {
  // const { text, values } = bricks
  //   .select([
  //     "students.id AS id",
  //     "students.name AS name",
  //     "classes.name AS class",
  //     "batches.name AS batch",
  //     "students.phone AS phone",
  //     `CASE
  //       WHEN payments.id IS NOT NULL AND payments.amount IS NOT NULL THEN 'paid'
  //       ELSE 'unpaid'
  //     END AS paymentStatus`,
  //   ])
  //   .from("students")
  //   .leftJoin("classes", { "students.classId": "classes.id" })
  //   .leftJoin("batches", { "students.batchId": "batches.id" })
  //   .leftJoin("payments", { "payments.studentId": "students.id" })
  //   .toParams();
  // const result = await db().select<IStudentWithClassAndBatch[]>(text, values);
  // console.log(result);

  // return result;

  return await db
    .select({
      id: students.id,
      name: students.name,
      class: classes.name,
      batch: batches.name,
      phone: students.phone,
    })
    .from(students)
    .leftJoin(classes, eq(students.classId, classes.id))
    .leftJoin(batches, eq(students.batchId, batches.id))
    .rightJoin(payments, eq(payments.studentId, students.id));
}

async function deleteMany(ids: (string | number)[]) {
  const mids = ids.map((id) => (typeof id === "string" ? parseInt(id) : id));
  return await db
    .delete(students)
    .where(inArray(students.id, mids))
    .returning();
}

async function count() {
  const result = await db
    .select({ studentCount: dbCount(students.id) })
    .from(students);
  return result[0];
}

async function readByBatch(batchId?: number | string) {
  if (!batchId) return [];
  batchId = typeof batchId === "string" ? parseInt(batchId) : batchId;

  return await db
    .select({
      id: students.id,
      name: students.name,
      phone: students.phone,
    })
    .from(students)
    .rightJoin(payments, eq(payments.studentId, students.id))
    .where(eq(students.batchId, batchId));
}

export {
  readOne,
  readAll,
  readByBatch,
  readRaw,
  create,
  update,
  del as delete,
  deleteMany,
  count,
};
