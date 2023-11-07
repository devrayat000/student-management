import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
// import useMutation from "swr/mutation";

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
import * as clazz from "~/database/actions/class";

const createClassSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function CreateClassPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createClassSchema>>({
    resolver: zodResolver(createClassSchema),
  });

  async function createClass(data: z.infer<typeof createClassSchema>) {
    console.log(data);
    const result = await clazz.create(data);
    console.log(result);
    await mutate(["classes"]);
    navigate(`../${result.lastInsertId}`, { replace: true });
  }

  return (
    <DetailsPageLayout title="Create Class">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createClass)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="Class 1" {...field} />
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
