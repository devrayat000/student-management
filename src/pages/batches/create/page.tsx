import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import { Button } from "~/components/ui/button";
import * as batch from "~/database/actions/batch";

const createBatchSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function CreateBatchPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createBatchSchema>>({
    resolver: zodResolver(createBatchSchema),
  });

  async function createBatch(data: z.infer<typeof createBatchSchema>) {
    console.log(data);
    const result = await batch.create(data);
    console.log(result);
    await mutate(["batches"]);
    navigate(`../${result.lastInsertId}`, { replace: true });
  }

  return (
    <DetailsPageLayout title="Create batch">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createBatch)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>batch Name</FormLabel>
                <FormControl>
                  <Input placeholder="batch 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-3">Create</Button>
        </form>
      </Form>
    </DetailsPageLayout>
  );
}
