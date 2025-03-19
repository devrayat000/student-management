import { useNavigate } from "react-router";
import { plural } from "pluralize";

import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import { mutate } from "swr";

export interface DeletePromptProps {
  id: string;
  itemId: string | number | undefined;
  onDelete(id: string | number): PromiseLike<any>;
}

function DeletePrompt({ id, onDelete, itemId }: DeletePromptProps) {
  const navigate = useNavigate();

  async function handleDelete() {
    if (!itemId) return;

    const key = plural(id);
    await onDelete(itemId);
    await mutate([key]);
    await mutate([key, itemId]);
    navigate(`/${key}`, { replace: true });
  }

  return (
    <Dialog modalType="alert">
      <DialogTrigger disableButtonEnhancement>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogContent>
            This action cannot be undone. This will permanently delete the {id}.
          </DialogContent>
          <DialogActions>
            <Button appearance="primary">Continue</Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default DeletePrompt;
