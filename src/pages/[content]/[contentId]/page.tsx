import { Suspense } from "react";
import useSWR from "swr";
import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import Spinner from "~/components/common/Spinner";
import DeletePrompt from "~/components/common/DeletePrompt";
import { contentKeys, contents } from "../utils";
import { singular } from "pluralize";
import capitalize from "capitalize";

export default function ContentDetailsPage() {
  const { content } = useParams();

  if (!content || !contentKeys.includes(content)) {
    return <Navigate to="/" />;
  }

  return (
    <DetailsPageLayout title={`${capitalize(singular(content))} Details`}>
      <Suspense fallback={<Spinner />}>
        <ContentDetailsPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function ContentDetailsPageInner() {
  const { contentId, content } = useParams();
  const { data } = useSWR(
    [content, contentId],
    ([, id]) => contents[content! as keyof typeof contents].readOne(id),
    {
      suspense: true,
    }
  );

  const title = capitalize(singular(content!));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Input disabled defaultValue={data?.id} className="w-52" />
      </div>
      <div>
        <Label>{title} Name</Label>
        <Input disabled defaultValue={data?.name} />
      </div>
      <div className="flex items-center gap-3">
        <Button className="w-full mt-1" asChild>
          <Link to="./edit">Update</Link>
        </Button>
        <Button className="w-full mt-1 bg-red-500 hover:bg-red-500/90" asChild>
          <DeletePrompt
            element={singular(content!)}
            itemId={contentId}
            onDelete={contents[content! as keyof typeof contents].delete}
          >
            Delete
          </DeletePrompt>
        </Button>
      </div>
    </div>
  );
}
