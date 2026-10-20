"use client";

import {
  cloneElement,
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactElement,
} from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

function FormItem({ className, ...props }: ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("FormField components must be rendered inside FormField.");
  }

  if (!itemContext) {
    throw new Error("FormField components must be rendered inside FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const formItemId = `${itemContext.id}-form-item`;
  const formDescriptionId = `${itemContext.id}-form-item-description`;
  const formMessageId = `${itemContext.id}-form-item-message`;

  return {
    ...fieldState,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
  };
}

function FormLabel({ className, ...props }: ComponentProps<"label">) {
  const { error, formItemId } = useFormField();

  return (
    <label
      {...props}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-destructive",
        className,
      )}
      htmlFor={formItemId}
    />
  );
}

type FormControlProps = {
  children: ReactElement<{
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }>;
};

function FormControl({ children }: FormControlProps) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
  } = useFormField();

  const describedBy = error
    ? `${formDescriptionId} ${formMessageId}`
    : formDescriptionId;

  return cloneElement(children, {
    id: formItemId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
  });
}

function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      role={error ? "alert" : undefined}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
