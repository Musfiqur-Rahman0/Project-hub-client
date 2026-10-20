"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TextFieldProps<T extends FieldValues> extends Omit<
  ComponentProps<"input">,
  "name"
> {
  name: FieldPath<T>;
  label: string;
  /** Right-aligned element on the label row (e.g. “Forgot password?”). */
  labelAction?: ReactNode;
  /** Element rendered inside the input on the right (e.g. show/hide toggle). */
  endAdornment?: ReactNode;
  /** Rendered between the input and the error message (e.g. strength meter). */
  children?: ReactNode;
}

/**
 * Label + Input + error message wired to the surrounding react-hook-form context.
 * Usage: <TextField<LoginValues> name="email" label="Email address" />
 */
export function TextField<T extends FieldValues>({
  name,
  label,
  labelAction,
  endAdornment,
  children,
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
          <div className="flex items-center justify-between gap-2">
            <FormLabel>{label}</FormLabel>
            {labelAction}
          </div>
          <div className="relative">
            <FormControl>
              <Input
                {...inputProps}
                {...field}
                className={cn(
                  endAdornment && "pr-10",
                  className,
                  "rounded-[4px] min-h-10",
                )}
              />
            </FormControl>
            {endAdornment && (
              <div className="absolute inset-y-0 right-1 flex items-center">
                {endAdornment}
              </div>
            )}
          </div>
          {children}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
