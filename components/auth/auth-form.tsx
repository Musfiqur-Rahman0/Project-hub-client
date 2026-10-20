"use client";

import type { ReactNode } from "react";
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}

/**
 * Provides the form context, handles submit, and shows a server error set with
 * `form.setError("root", { message })`.
 */
export function AuthForm<T extends FieldValues>({ form, onSubmit, children }: AuthFormProps<T>) {
  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
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
