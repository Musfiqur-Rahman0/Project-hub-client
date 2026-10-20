"use client";

import type { ComponentProps } from "react";
import { type FieldPath, type FieldValues, useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "./field-label";

interface TextareaFieldProps<T extends FieldValues> extends Omit<ComponentProps<"textarea">, "name"> {
  name: FieldPath<T>;
  label: string;
  labelClassName?: string;
  description?: string;
}

/** Textarea with a live “n / max” counter when `maxLength` is set. */
export function TextareaField<T extends FieldValues>({
  name,
  label,
  labelClassName,
  description,
  required,
  maxLength,
  ...props
}: TextareaFieldProps<T>) {
  const { control } = useFormContext<T>();
  const value = (useWatch({ control, name }) as unknown as string) ?? "";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel
            required={required}
            className={labelClassName}
            action={
              maxLength && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {value.length} / {maxLength}
                </span>
              )
            }
          >
            {label}
          </FieldLabel>
          <FormControl>
            <Textarea
              aria-required={required}
              maxLength={maxLength}
              className="resize-y leading-relaxed"
              {...props}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
