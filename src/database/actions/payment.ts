import { db } from "~/lib/utils";
import { payments } from "../schema";
import { eq, InferInsertModel } from "drizzle-orm";

async function getPaymentHistoryByStudentId(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  return await db.query.payments.findMany({
    where: (table, { eq }) => eq(table.studentId, id),
    columns: {
      month: true,
      year: true,
      amount: true,
      paymentDate: true,
    },
    orderBy: (table, { desc }) => desc(table.paymentDate),
  });
}

async function readRaw() {
  return db.select().from(payments);
}

async function readOne(studentId: string | number) {
  studentId = typeof studentId === "string" ? parseInt(studentId) : studentId;
  const date = new Date();

  const result = await db.query.payments.findFirst({
    where: (table, { eq, and }) =>
      and(
        eq(table.studentId, studentId),
        eq(table.month, date.getMonth()),
        eq(table.year, date.getFullYear())
      ),
    columns: {
      month: true,
      year: true,
      amount: true,
      paymentDate: true,
    },
  });

  return result;
}

async function create(data: InferInsertModel<typeof payments>) {
  const result = await db.insert(payments).values(data).returning();
  return result[0];
}

async function update({
  studentId,
  ...data
}: Partial<InferInsertModel<typeof payments>>) {
  const result = await db
    .update(payments)
    .set(data)
    .where(eq(payments.studentId, studentId!))
    .returning();
  return result[0];
}

async function del(studentId: number) {
  const result = await db
    .delete(payments)
    .where(eq(payments.studentId, studentId))
    .returning();
  return result[0];
}

export {
  getPaymentHistoryByStudentId,
  create,
  del as delete,
  update,
  readOne,
  readRaw,
};
