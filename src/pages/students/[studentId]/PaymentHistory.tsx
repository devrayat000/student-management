import { Suspense } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import dayjs from "dayjs";

import * as payment from "~/database/actions/payment";
import CreatePayment from "./CreatePayment";
import EditPayment from "./UpdatePayment";
import DeletePayment from "./DeletePayment";
import { Spinner, Title2, Title3 } from "@fluentui/react-components";

export default function PaymentHistory() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-10" />
        <Title3 weight="bold">Payment History</Title3>

        <CreatePayment />
      </div>

      <Suspense fallback={<Spinner />}>
        <PaymentHistoryInner />
      </Suspense>
    </div>
  );
}

function PaymentHistoryInner() {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["payments", studentId],
    ([, id]) => payment.getPaymentHistoryByStudentId(id),
    {
      suspense: true,
    }
  );

  return (
    <ul className="mt-2 flex flex-col gap-3">
      {!data?.length && (
        <li className="text-center text-slate-600">No payments yet</li>
      )}
      {data?.map((payment) => (
        <li
          key={`${payment.month}-${payment.year}`}
          className="p-2 rounded-md border border-slate-400 relative"
        >
          <div>
            <div>
              {dayjs()
                .month(payment.month - 1)
                .format("MMMM")}
            </div>
            <div>{payment.amount}</div>
            <div>{dayjs(payment.paymentDate).format("DD MMM, YYYY")}</div>
          </div>

          <div className="absolute top-3 right-3">
            <div className="flex gap-1 items-center">
              <EditPayment />
              {/* <DeletePayment paymentId={payment.id} studentId={studentId} /> */}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
