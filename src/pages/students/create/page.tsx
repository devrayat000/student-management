import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSWR, { mutate } from "swr";
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
import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import * as clazz from "~/database/actions/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Spinner from "~/components/common/Spinner";

const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  classId: z.string().transform(Number).optional(),
  batchId: z.string().transform(Number).optional(),
});

export default function CreateStudentPage() {
  return (
    <DetailsPageLayout title="Create student">
      <Suspense fallback={<Spinner />}>
        <CreateStudentPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function CreateStudentPageInner() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
  });

  const { data: classes } = useSWR(["classes"], clazz.readAll, {
    suspense: true,
  });
  const { data: batches } = useSWR(["batches"], batch.readAll, {
    suspense: true,
  });

  async function createStudent(data: z.infer<typeof createStudentSchema>) {
    console.log(data);
    const result = await student.create(data);
    console.log(result);
    await mutate(["students"]);
    navigate(`../${result.lastInsertId}`, { replace: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createStudent)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student's Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Ahsan Shawon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone no.</FormLabel>
              <FormControl>
                <Input placeholder="017*********" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone no.</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!classes.length && (
                    <SelectItem value="0" disabled>
                      Create a class first
                    </SelectItem>
                  )}
                  {classes?.map((clazz) => (
                    <SelectItem value={clazz.id.toString()} key={clazz.id}>
                      {clazz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="batchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone no.</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!batches.length && (
                    <SelectItem value="0" disabled>
                      Create a batch first
                    </SelectItem>
                  )}
                  {batches?.map((clazz) => (
                    <SelectItem value={clazz.id.toString()} key={clazz.id}>
                      {clazz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-3">Create</Button>
      </form>
    </Form>
  );
}
