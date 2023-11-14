import { Suspense } from "react";
import useSWR, { mutate } from "swr";
import { Navigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { singular } from "pluralize";
import capitalize from "capitalize";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import Spinner from "~/components/common/Spinner";
import { contentKeys, contents } from "../../utils";

const updateContentSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function EditContentPage() {
  const { content } = useParams();

  if (!content || !contentKeys.includes(content)) {
    return <Navigate to="/" />;
  }

  return (
    <DetailsPageLayout title={`Edit ${capitalize(singular(content))}`}>
      <Suspense fallback={<Spinner />}>
        <EditContentPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function EditContentPageInner() {
  const { content } = useParams();
  const contentApi = contents[content! as keyof typeof contents];

  const { contentId } = useParams();
  const { data } = useSWR(
    [content, contentId],
    ([, id]) => contentApi.readOne(id),
    {
      suspense: true,
    }
  );
  const form = useForm<z.infer<typeof updateContentSchema>>({
    defaultValues: {
      name: data?.name,
    },
    resolver: zodResolver(updateContentSchema),
  });
  const { toast } = useToast();

  async function updateContent(data: z.infer<typeof updateContentSchema>) {
    if (!contentId) return;

    await contentApi.update({ ...data, id: parseInt(contentId!) });
    await mutate([content, contentId], { ...data, id: parseInt(contentId!) });
    await mutate([content]);
    toast({
      title: `Updated Content (ID: ${contentId})`,
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(updateContent)}
      >
        <div className="flex justify-end">
          <Input disabled name="id" defaultValue={data?.id} className="w-52" />
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full mt-1">Update</Button>
      </form>
    </Form>
  );
}
