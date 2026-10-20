"use client";

import type { ReactNode } from "react";
import { type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CheckboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: ReactNode;
}

export function CheckboxField<T extends FieldValues>({ name, label }: CheckboxFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-start gap-2.5">
            <FormControl>
              <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            </FormControl>
            <FormLabel className="text-sm font-normal leading-snug text-muted-foreground">
              {label}
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
