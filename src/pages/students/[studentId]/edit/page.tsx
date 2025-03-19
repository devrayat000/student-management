import { Suspense } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "react-router";
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
  FormMessage,
} from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import * as clazz from "~/database/actions/class";
import Spinner from "~/components/common/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const updateStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  classId: z.string().transform(Number).optional(),
  batchId: z.string().transform(Number).optional(),
});

export default function EditStudentPage() {
  return (
    <DetailsPageLayout title="Edit Student Details">
      <Suspense fallback={<Spinner />}>
        <EditStudentPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

function EditStudentPageInner() {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["students", studentId],
    ([, id]) => student.readOne(id),
    {
      suspense: true,
    }
  );
  const { data: classes } = useSWR(["classes"], clazz.readAll, {
    suspense: true,
  });
  const { data: batches } = useSWR(["batches"], batch.readAll, {
    suspense: true,
  });

  const form = useForm<z.infer<typeof updateStudentSchema>>({
    defaultValues: {
      name: data?.name,
      phone: data?.phone,
      classId: data?.classId,
      batchId: data?.batchId,
    },
    resolver: zodResolver(updateStudentSchema),
  });
  const { toast } = useToast();

  async function updateStudent(data: z.infer<typeof updateStudentSchema>) {
    if (!studentId) return;

    await student.update({ ...data, id: parseInt(studentId!) });
    await mutate(["students", studentId], {
      ...data,
      id: parseInt(studentId!),
    });
    await mutate(["students"]);
    toast({
      title: `Updated Student (ID: ${studentId})`,
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(updateStudent)}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        aria-autocomplete="none"
      >
        <div className="flex justify-end">
          <Input disabled name="id" defaultValue={data?.id} className="w-52" />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student's Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ahsan Shawon"
                  {...field}
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="off"
                  list="autocompleteOff"
                  aria-autocomplete="none"
                />
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
                <Input
                  placeholder="017*********"
                  type="tel"
                  {...field}
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="off"
                  list="autocompleteOff"
                  aria-autocomplete="none"
                />
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
        <Button className="w-full mt-1">Update</Button>
      </form>
    </Form>
  );
}
