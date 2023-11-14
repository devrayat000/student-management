import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import { Suspense } from "react";
import Spinner from "~/components/common/Spinner";
import useSWR from "swr";

async function getCount() {
  const [{ studentCount }, { batchCount }] = await Promise.all([
    student.count(),
    batch.count(),
  ]);
  return { studentCount, batchCount };
}

export default function HomePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <HomePageInner />
    </Suspense>
  );
}

function HomePageInner() {
  const { data } = useSWR(["count"], getCount, { suspense: true });

  return (
    <div>
      <h2 className="text-xl mb-2 font-medium">Welcome back, Boss 🫡!</h2>
      <p>Here is the overview of your account:</p>
      <div className="p-4 grid grid-cols-2 gap-3 mt-3">
        <div className="rounded-md border p-4">
          <h4 className="text-center font-medium text-xl">Total Students</h4>
          <p className="text-center text-4xl font-bold mt-1">
            {data.studentCount}
          </p>
        </div>
        <div className="rounded-md border p-4">
          <h4 className="text-center font-medium text-xl">Total Batches</h4>
          <p className="text-center text-4xl font-bold mt-1">
            {data.batchCount}
          </p>
        </div>
      </div>
    </div>
  );
}
