import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { IPaymentHistory } from "../schema";

async function getPaymentHistoryByStudentId(id?: number | string) {
  if (!id) return null;
  id = typeof id === "string" ? parseInt(id) : id;

  const { text, values } = bricks
    .select(["id", "month", "amount", "paymentDate"])
    .from("payments")
    .where("studentId", id)
    .orderBy("paymentDate DESC")
    .toParams();
  console.log(text);

  const result = await db().select<IPaymentHistory[]>(text, values);

  return result;
}

async function readOne(paymentId: string | number) {
  paymentId = typeof paymentId === "string" ? parseInt(paymentId) : paymentId;

  const { text, values } = bricks
    .select(["id", "month", "amount"])
    .from("payments")
    .where("id", paymentId)
    .toParams();
  console.log(text);

  const result = await db().select<IPaymentHistory[]>(text, values);

  return !!result.length ? result[0] : null;
}

async function create(
  data: Pick<IPaymentHistory, "month" | "amount">,
  studentId?: number | string
) {
  if (!studentId) return null;
  studentId = typeof studentId === "string" ? parseInt(studentId) : studentId;

  const { text, values } = bricks
    .insert("payments", {
      ...data,
      studentId,
      paymentDate: bricks("CURRENT_TIMESTAMP"),
    })
    .toParams();

  console.log(text, values);

  const result = await db().execute(text, values);
  return result;
}

async function update(
  paymentId: string | number,
  data: Pick<IPaymentHistory, "month" | "amount">
) {
  paymentId = typeof paymentId === "string" ? parseInt(paymentId) : paymentId;

  const { text, values } = bricks
    .update("payments", data)
    .where({ id: paymentId })
    .toParams();

  console.log(text, values);

  const result = await db().execute(text, values);
  return result;
}

async function del(paymentId: string | number) {
  paymentId = typeof paymentId === "string" ? parseInt(paymentId) : paymentId;

  const { text, values } = bricks
    .delete("payments")
    .where({ id: paymentId })
    .toParams();
  const result = await db().execute(text, values);
  return result;
}

export { getPaymentHistoryByStudentId, create, del as delete, update, readOne };
