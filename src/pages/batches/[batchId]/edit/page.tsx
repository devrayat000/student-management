import { Suspense } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import * as batch from "~/database/actions/batch";
import Spinner from "~/components/common/Spinner";

const updateBatchSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function EditBatchPage() {
  return (
    <DetailsPageLayout title="Edit Batch">
      <Suspense fallback={<Spinner />}>
        <EditBatchPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function EditBatchPageInner() {
  const { batchId } = useParams();
  const { data } = useSWR(["batches", batchId], ([, id]) => batch.readOne(id), {
    suspense: true,
  });
  const form = useForm<z.infer<typeof updateBatchSchema>>({
    defaultValues: {
      name: data?.name,
    },
    resolver: zodResolver(updateBatchSchema),
  });
  const { toast } = useToast();

  async function updateBatch(data: z.infer<typeof updateBatchSchema>) {
    if (!batchId) return;

    await batch.update({ ...data, id: parseInt(batchId!) });
    await mutate(["batches", batchId], { ...data, id: parseInt(batchId!) });
    await mutate(["batches"]);
    toast({
      title: `Updated Batch (ID: ${batchId})`,
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(updateBatch)}
      >
        <div className="flex justify-end">
          <Input disabled name="id" defaultValue={data?.id} className="w-52" />
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Name</FormLabel>
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
