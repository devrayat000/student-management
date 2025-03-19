import { Suspense, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router";
import {
  Button,
  Input,
  Field,
  Select,
  Combobox,
  Option,
  ComboboxProps,
  useComboboxFilter,
} from "@fluentui/react-components";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import * as clazz from "~/database/actions/class";
import {
  // Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Spinner from "~/components/common/Spinner";

const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  classId: z.string().optional(),
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

  const [query, setQuery] = useState<string>("");
  const { data: classes } = useSWR(["classes"], clazz.readAll, {
    suspense: true,
  });
  // const { data: batches } = useSWR(["batches"], batch.readAll, {
  //   suspense: true,
  // });

  const children = useComboboxFilter(
    query,
    classes.map((c) => ({ children: c.name, value: c.id.toString() })),
    {
      noOptionsMessage: "No animals match your search.",
      optionToText: (option) => option.children,
    }
  );
  const onOptionSelect: ComboboxProps["onOptionSelect"] = (_, data) => {
    setQuery(data.optionText ?? "");
  };

  // async function createStudent(data: z.infer<typeof createStudentSchema>) {
  //   console.log(data);
  //   const result = await student.create(data);
  //   console.log(result);
  //   await mutate(["students"]);
  //   navigate(`../${result[0].id}`, { replace: true });
  // }

  return (
    <FormProvider {...form}>
      <form
        // onSubmit={form.handleSubmit(createStudent)}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        aria-autocomplete="none"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              label="Student's Full Name"
              required
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
            >
              <Input
                placeholder="Ahsan Shawon"
                {...field}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                list="autocompleteOff"
                aria-autocomplete="none"
              />
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              label="Phone no."
              required
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
            >
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
            </Field>
          )}
        />
        <Controller
          name="classId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              label="Class"
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
            >
              <Combobox
                open
                value={field.value}
                onInput={field.onChange}
                onOptionSelect={onOptionSelect}
                placeholder="Create a class first"
                mountNode={document.getElementById("blabla")}
                clearable
              >
                {children}
              </Combobox>
            </Field>
          )}
        />
        {/* <FormField
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
        /> */}
        <Button className="w-full mt-3">Create</Button>
      </form>
    </FormProvider>
  );
}
