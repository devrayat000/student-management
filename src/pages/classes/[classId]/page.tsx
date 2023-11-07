import { Suspense } from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as clazz from "~/database/actions/class";
import Spinner from "~/components/common/Spinner";
import DeletePrompt from "~/components/common/DeletePrompt";

export default function ClassDetailsPage() {
  return (
    <DetailsPageLayout title="Class Details">
      <Suspense fallback={<Spinner />}>
        <ClassDetailsPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function ClassDetailsPageInner() {
  const { classId } = useParams();
  const { data } = useSWR(["classes", classId], ([, id]) => clazz.readOne(id), {
    suspense: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Input disabled defaultValue={data?.id} className="w-52" />
      </div>
      <div>
        <Label>Class Name</Label>
        <Input disabled defaultValue={data?.name} />
      </div>
      <div className="flex items-center gap-3">
        <Button className="w-full mt-1" asChild>
          <Link to="./edit">Update</Link>
        </Button>
        <Button className="w-full mt-1 bg-red-500 hover:bg-red-500/90" asChild>
          <DeletePrompt
            element="class"
            itemId={classId}
            onDelete={clazz.delete}
          >
            Delete
          </DeletePrompt>
        </Button>
      </div>
    </div>
  );
}
