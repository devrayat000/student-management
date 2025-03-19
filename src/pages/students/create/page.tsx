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
  Combobox,
  ComboboxProps,
  useComboboxFilter,
  makeStyles,
} from "@fluentui/react-components";

import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import * as clazz from "~/database/actions/class";
import Spinner from "~/components/common/Spinner";

const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  classId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  batchId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
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

const useStyles = makeStyles({
  submit: {
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

function CreateStudentPageInner() {
  const navigate = useNavigate();
  const clz = useStyles();
  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
  });

  const [query, setQuery] = useState<string>("");
  const { data: classes } = useSWR(["classes"], clazz.readAll, {
    suspense: true,
  });
  const { data: batches } = useSWR(["batches"], batch.readAll, {
    suspense: true,
  });

  const classOptions = useComboboxFilter(
    query,
    classes.map((c) => ({ children: c.name, value: c.id.toString() })),
    {
      noOptionsMessage: "No animals match your search.",
      optionToText: (option) => option.children,
    }
  );
  const batchOptions = useComboboxFilter(
    query,
    batches.map((c) => ({ children: c.name, value: c.id.toString() })),
    {
      noOptionsMessage: "No animals match your search.",
      optionToText: (option) => option.children,
    }
  );
  const onClassSelect: ComboboxProps["onOptionSelect"] = (_, data) => {
    setQuery(data.optionText ?? "");
    form.setValue("classId", parseInt(data.optionValue!));
  };
  const onBatchSelect: ComboboxProps["onOptionSelect"] = (_, data) => {
    setQuery(data.optionText ?? "");
    form.setValue("batchId", parseInt(data.optionValue!));
  };

  async function createStudent(data: z.infer<typeof createStudentSchema>) {
    console.log(data);
    const result = await student.create(data);
    console.log(result);
    await mutate(["students"]);
    navigate(`../${result[0].id}`, { replace: true });
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(createStudent)}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        aria-autocomplete="none"
        className={clz.form}
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
                value={field.value?.toString()}
                onInput={field.onChange}
                onOptionSelect={onClassSelect}
                placeholder="Create a class first"
                mountNode={document.getElementById("dropdown-portal")}
                clearable
              >
                {classOptions}
              </Combobox>
            </Field>
          )}
        />
        <Controller
          name="batchId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              label="Batch"
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
            >
              <Combobox
                value={field.value?.toString()}
                onInput={field.onChange}
                onOptionSelect={onBatchSelect}
                placeholder="Create a batch first"
                mountNode={document.getElementById("dropdown-portal")}
                clearable
              >
                {batchOptions}
              </Combobox>
            </Field>
          )}
        />
        <Button appearance="primary" className={clz.submit} size="large">
          Create
        </Button>
      </form>
    </FormProvider>
  );
}
