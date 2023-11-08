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

export { getPaymentHistoryByStudentId, create };
