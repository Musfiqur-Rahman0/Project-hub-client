"use client";

import type { ReactNode } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AppFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

/** Form context + submit handling + a server error set via `form.setError("root", { message })`. */
export function AppForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: AppFormProps<T>) {
  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className={cn("space-y-4", className)}
      >
        {rootError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {rootError}
          </p>
        )}
        {children}
      </form>
    </Form>
  );
}
