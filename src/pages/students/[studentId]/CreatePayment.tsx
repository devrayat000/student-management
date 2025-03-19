import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";

import * as payment from "~/database/actions/payment";
import { mutate } from "swr";
import { Month } from "~/lib/utils";
import {
  Field,
  Option,
  Button,
  Input,
  Select,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const createPaymentSchema = z.object({
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

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  saveBtn: {
    width: "100%",
    backgroundColor: tokens.colorStatusSuccessForeground3,
    color: tokens.colorStatusSuccessBackground1,
    ":hover": {
      backgroundColor: tokens.colorStatusSuccessForegroundInverted,
    },
    ":hover:active": {
      backgroundColor: tokens.colorStatusSuccessForeground2,
    },
  },
});

export default function CreatePayment() {
  const { studentId } = useParams();
  const date = new Date();
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
  });
  const classes = useStyles();

  async function createPayment(data: z.infer<typeof createPaymentSchema>) {
    console.log(data);
    const result = await payment.create({
      studentId: parseInt(studentId!),
      year: date.getFullYear(),
      ...data,
    });
    console.log(result);
    await mutate(["payments", studentId]);
  }

  return (
    <FormProvider {...form}>
      <form
        className={classes.form}
        onSubmit={form.handleSubmit(createPayment)}
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
                mountNode={document.getElementById("dropdown-portal")}
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
              <Input
                placeholder="1000"
                type="number"
                {...field}
                value={field.value?.toString()}
              />
            </Field>
          )}
        />
        <Button appearance="primary" type="submit" className={classes.saveBtn}>
          Save
        </Button>
      </form>
    </FormProvider>
  );
}

// function CreatePaymentForm() {

//     return ()
// }
