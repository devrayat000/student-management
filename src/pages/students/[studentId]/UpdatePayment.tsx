import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

import * as payment from "~/database/actions/payment";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useSWR, { mutate } from "swr";
import { Month } from "~/lib/utils";
import Spinner from "~/components/common/Spinner";
import { AiOutlineEdit } from "react-icons/ai";

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

export default function EditPayment({
  paymentId,
}: {
  paymentId: string | number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <AiOutlineEdit className="w-3.5 h-3.5 text-slate-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Make changes this payment profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<Spinner />}>
          <EditPaymentForm
            onClose={() => setOpen(false)}
            paymentId={paymentId}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

interface EditPaymentFormProps {
  paymentId: string | number;
  onClose(): void;
}

function EditPaymentForm({ paymentId, onClose }: EditPaymentFormProps) {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["payments", studentId, paymentId],
    ([, , id]) => payment.readOne(id),
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

  async function updatePayment(data: z.infer<typeof updatePaymentSchema>) {
    console.log(data);
    const result = await payment.update(paymentId, data);
    console.log(result);
    await mutate(["payments", studentId, paymentId]);
    await mutate(["payments", studentId]);
    onClose();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 py-4"
        onSubmit={form.handleSubmit(updatePayment)}
      >
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Month</FormLabel>
              <div className="col-span-3">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-[14rem]">
                      {Object.entries(Month).map(([label, value]) => (
                        <SelectItem value={value} key={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Amount</FormLabel>
              <div className="col-span-3">
                <FormControl>
                  <Input placeholder="1000" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
