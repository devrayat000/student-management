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
import * as clazz from "~/database/actions/class";
import Spinner from "~/components/common/Spinner";

const updateClassSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function EditClassPage() {
  return (
    <DetailsPageLayout title="Edit Class">
      <Suspense fallback={<Spinner />}>
        <EditClassPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function EditClassPageInner() {
  const { classId } = useParams();
  const { data } = useSWR(["classes", classId], ([, id]) => clazz.readOne(id), {
    suspense: true,
  });
  const form = useForm<z.infer<typeof updateClassSchema>>({
    defaultValues: {
      name: data?.name,
    },
    resolver: zodResolver(updateClassSchema),
  });
  const { toast } = useToast();

  async function updateClass(data: z.infer<typeof updateClassSchema>) {
    if (!classId) return;

    await clazz.update({ ...data, id: parseInt(classId!) });
    await mutate(["classes", classId], { ...data, id: parseInt(classId!) });
    await mutate(["classes"]);
    toast({
      title: `Updated Class (ID: ${classId})`,
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(updateClass)}
      >
        <div className="flex justify-end">
          <Input disabled name="id" defaultValue={data?.id} className="w-52" />
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
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
