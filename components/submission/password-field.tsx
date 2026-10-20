"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField, type TextFieldProps } from "./text-field";

type PasswordFieldProps<T extends FieldValues> = Omit<TextFieldProps<T>, "type" | "endAdornment">;

/** TextField with a show/hide toggle. */
export function PasswordField<T extends FieldValues>(props: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField<T>
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      }
    />
  );
}
