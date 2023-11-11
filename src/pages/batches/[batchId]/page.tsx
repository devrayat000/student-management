import { Suspense } from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as batch from "~/database/actions/batch";
import Spinner from "~/components/common/Spinner";
import DeletePrompt from "~/components/common/DeletePrompt";
import BatchStudents from "./BatchStudents";

export default function BatchDetailsPage() {
  return (
    <DetailsPageLayout title="Batch Details">
      <Suspense>
        <Suspense fallback={<Spinner />}>
          <BatchDetailsPageInner />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <BatchStudents />
        </Suspense>
      </Suspense>
    </DetailsPageLayout>
  );
}

function BatchDetailsPageInner() {
  const { batchId } = useParams();
  const { data } = useSWR(["batches", batchId], ([, id]) => batch.readOne(id), {
    suspense: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Input disabled defaultValue={data?.id} className="w-52" />
      </div>
      <div>
        <Label>Batch Name</Label>
        <Input disabled defaultValue={data?.name} />
      </div>
      <div className="flex items-center gap-3">
        <Button className="w-full mt-1" asChild>
          <Link to="./edit">Update</Link>
        </Button>
        <Button className="w-full mt-1 bg-red-500 hover:bg-red-500/90" asChild>
          <DeletePrompt
            element="batch"
            itemId={batchId}
            onDelete={batch.delete}
          >
            Delete
          </DeletePrompt>
        </Button>
      </div>
    </div>
  );
}
