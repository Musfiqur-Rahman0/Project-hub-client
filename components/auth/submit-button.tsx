"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: ReactNode;
  /** Optional icon shown after the label. */
  icon?: ReactNode;
  loadingText?: string;
}

/** Full-width submit button that reads `isSubmitting` from the form context. */
export function SubmitButton({
  children,
  icon,
  loadingText,
}: SubmitButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full min-h-10"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </Button>
  );
}
