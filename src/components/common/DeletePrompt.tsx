import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { plural } from "pluralize";

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
import { mutate } from "swr";

export interface DeletePromptProps
  extends React.ComponentPropsWithRef<"button"> {
  element: string;
  itemId: string | number | undefined;
  onDelete(id: string | number): PromiseLike<any>;
}

function DeletePrompt(
  { element, onDelete, itemId, ...props }: DeletePromptProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const navigate = useNavigate();

  async function handleDelete() {
    if (!itemId) return;

    const key = plural(element);
    await onDelete(itemId);
    await mutate([key]);
    await mutate([key, itemId]);
    navigate(`/${key}`, { replace: true });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} ref={ref} />
      <AlertDialogPortal container={document.getElementById("dialog-portal")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {element}.
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

export default forwardRef(DeletePrompt);
