"use client";

import type { ComponentProps, ReactNode } from "react";
import { type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";

export interface TextFieldProps<T extends FieldValues> extends Omit<ComponentProps<"input">, "name"> {
  name: FieldPath<T>;
  label: string;
  labelClassName?: string;
  /** Hint shown under the input. */
  description?: string;
  labelAction?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Rendered between the input and the hint (e.g. strength meter). */
  children?: ReactNode;
}

/** Usage: <TextField<LoginValues> name="email" label="Email address" /> */
export function TextField<T extends FieldValues>({
  name,
  label,
  labelClassName,
  description,
  labelAction,
  startAdornment,
  endAdornment,
  children,
  required,
  className,
  ...inputProps
}: TextFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel required={required} action={labelAction} className={labelClassName}>
            {label}
          </FieldLabel>
          <div className="relative">
            {startAdornment && (
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4">
                {startAdornment}
              </span>
            )}
            <FormControl>
              <Input
                aria-required={required}
                {...inputProps}
                {...field}
                className={cn(startAdornment && "pl-9", endAdornment && "pr-10", className)}
              />
            </FormControl>
            {endAdornment && (
              <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
            )}
          </div>
          {children}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
