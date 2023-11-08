import { Suspense } from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as student from "~/database/actions/student";
import Spinner from "~/components/common/Spinner";
import DeletePrompt from "~/components/common/DeletePrompt";
import PaymentHistory from "./PaymentHistory";

export default function StudentDetailsPage() {
  return (
    <DetailsPageLayout title="Student Details">
      <Suspense fallback={<Spinner />}>
        <StudentDetailsPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function StudentDetailsPageInner() {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["students", studentId],
    ([, id]) => student.readOne(id),
    {
      suspense: true,
    }
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex justify-end">
          <Input disabled defaultValue={data?.id} className="w-52" />
        </div>
        <div>
          <Label>Student's Name</Label>
          <Input disabled defaultValue={data?.name} />
        </div>
        <div>
          <Label>Class</Label>
          <Input disabled defaultValue={data?.class} />
        </div>
        <div>
          <Label>Batch</Label>
          <Input disabled defaultValue={data?.batch} />
        </div>
        <div>
          <Label>Phone no.</Label>
          <Input type="tel" disabled defaultValue={data?.phone} />
        </div>
        <div className="flex items-center gap-3">
          <Button className="w-full mt-1" asChild>
            <Link to="./edit">Update</Link>
          </Button>
          <Button className="w-full mt-1" asChild variant="destructive">
            <DeletePrompt
              element="student"
              itemId={studentId}
              onDelete={student.delete}
            >
              Delete
            </DeletePrompt>
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <PaymentHistory />
      </div>
    </div>
  );
}
