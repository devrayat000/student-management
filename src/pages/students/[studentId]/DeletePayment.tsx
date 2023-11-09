import { RiDeleteBin6Line } from "react-icons/ri";
import { mutate } from "swr";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import * as payment from "~/database/actions/payment";

export interface DeletePromptProps {
  paymentId: string | number;
  studentId: string | number | undefined;
}

export default function DeletePayment({
  paymentId,
  studentId,
}: DeletePromptProps) {
  async function handleDelete() {
    await payment.delete(paymentId);
    await mutate(["payments", studentId, paymentId]);
    await mutate(["payments", studentId]);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 border-red-200 hover:bg-red-300/10"
        >
          <RiDeleteBin6Line className="w-3.5 h-3.5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogPortal container={document.getElementById("dialog-portal")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              payment entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-500/90"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
