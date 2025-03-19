import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mutate } from "swr";
import { Navigate, useNavigate, useParams } from "react-router";
// import useMutation from "swr/mutation";

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
import { contentKeys, contents } from "../utils";
import capitalize from "capitalize";
import { singular } from "pluralize";

const createContentSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function CreateClassPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createContentSchema>>({
    resolver: zodResolver(createContentSchema),
  });

  const { content } = useParams();

  if (!content || !contentKeys.includes(content)) {
    return <Navigate to="/" />;
  }

  async function createClass(data: z.infer<typeof createContentSchema>) {
    console.log(data);
    const result = await contents[content! as keyof typeof contents].create(
      data
    );
    console.log(result);
    await mutate([content]);
    navigate(`../${result.lastInsertId}`, { replace: true });
  }

  const title = capitalize(singular(content));

  return (
    <DetailsPageLayout title={`Create ${title}`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createClass)}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          aria-autocomplete="none"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{title} Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${title} 1`}
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
          <Button className="w-full mt-3">Create</Button>
        </form>
      </Form>
    </DetailsPageLayout>
  );
}
