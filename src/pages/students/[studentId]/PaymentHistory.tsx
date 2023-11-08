import { Suspense } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import dayjs from "dayjs";

import Spinner from "~/components/common/Spinner";
import * as payment from "~/database/actions/payment";
import CreatePayment from "./CreatePayment";

export default function PaymentHistory() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-10" />
        <h2 className="text-center font-bold text-2xl justify-self-center">
          Payment History
        </h2>

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
    <ul className="mt-2">
      {!data?.length && (
        <li className="text-center text-slate-600">No payments yet</li>
      )}
      {data?.map((payment) => (
        <li key={payment.id}>
          <div>
            {dayjs()
              .month(payment.month - 1)
              .format("MMMM")}
          </div>
          <div>{payment.amount}</div>
          <div>{dayjs(payment.paymentDate).format("DD MMM, YYYY")}</div>
        </li>
      ))}
    </ul>
  );
}
