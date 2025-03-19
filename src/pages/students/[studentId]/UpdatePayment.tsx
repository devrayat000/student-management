import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";

import * as payment from "~/database/actions/payment";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogActions,
  DialogTrigger,
  Button,
  Field,
  Combobox,
  Select,
  Option,
} from "@fluentui/react-components";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import useSWR, { mutate } from "swr";
import { Month } from "~/lib/utils";
import Spinner from "~/components/common/Spinner";

const updatePaymentSchema = z.object({
  month: z.nativeEnum(Month).transform(Number),
  amount: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .positive("Amount must be positive")
        .min(1, "Amount is required")
    ),
});

export default function EditPayment() {
  return (
    <Suspense fallback={<Spinner />}>
      <EditPaymentForm />
    </Suspense>
  );
}

function EditPaymentForm() {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["payments", studentId],
    ([, id]) => payment.readOne(id!),
    {
      suspense: true,
    }
  );

  const form = useForm<z.infer<typeof updatePaymentSchema>>({
    defaultValues: {
      amount: data?.amount,
      month: data?.month,
    },
    resolver: zodResolver(updatePaymentSchema),
  });

  // async function updatePayment(data: z.infer<typeof updatePaymentSchema>) {
  //   console.log(data);
  //   const result = await payment.update(paymentId, data);
  //   console.log(result);
  //   await mutate(["payments", studentId, paymentId]);
  //   await mutate(["payments", studentId]);
  // }

  return (
    <FormProvider {...form}>
      <form
        className="grid gap-4 py-4"
        // onSubmit={form.handleSubmit(updatePayment)}
      >
        <Controller
          control={form.control}
          name="month"
          render={({ field, fieldState }) => (
            <Field
              label="Month"
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Select
                {...field}
                onChange={(_, data) => field.onChange(data.value)}
                // defaultValue={field.value?.toString()}
              >
                {Object.entries(Month).map(([label, value]) => (
                  <Option value={value} key={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field
              label="Amount"
              validationState={fieldState.invalid ? "error" : "none"}
              validationMessage={fieldState.error?.message}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Input placeholder="1000" type="number" {...field} />
            </Field>
          )}
        />
        <Button appearance="primary" type="submit">
          Save
        </Button>
      </form>
    </FormProvider>
  );
}
