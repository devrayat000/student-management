import useSWR from "swr";
import bricks from "sql-bricks";

import { db } from "~/lib/utils";
import { Student } from "~/database/schema";
import ListLayout from "../ListLayout";

interface Filters {
  classId: number;
  batchId: number;
  paymentStatus: "paid" | "unpaid";
}

async function getStudents(filters?: Partial<Filters>) {
  let query = bricks.select().from("students");

  if (!!filters?.paymentStatus) {
    query = query
      .leftJoin("payments")
      .on({ "students.id": "payments.studentId" })
      .and(
        bricks.eq(
          "payments.month",
          bricks(`strftime('%Y-%m', 'now', 'localtime')`)
        )
      );

    if (filters.paymentStatus === "paid") {
      query = query.where(bricks.isNotNull("payments.id"));
    } else {
      query = query.where(bricks.isNull("payments.id"));
    }
  }
  if (filters?.classId) {
    query = query.where("classId", filters.classId);
  }
  if (filters?.batchId) {
    query = query.where("batchId", filters.batchId);
  }

  const { text, values } = query.toParams();
  console.log({ text, values });
  const result = await db().select<Student[]>(text, values);
  return result;
}

export default function StudentsPage() {
  const { data } = useSWR(["students"], () =>
    getStudents({ classId: 123, paymentStatus: "paid" })
  );

  console.log({ data });

  return (
    <ListLayout title="Students">
      <div></div>
    </ListLayout>
  );
}
