"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  loadingText?: string;
  className?: string;
}

/** Submit button that reads `isSubmitting` from the form context. Full width unless overridden. */
export function SubmitButton({ children, icon, loadingText, className }: SubmitButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type="submit" size="lg" className={cn("w-full", className)} disabled={isSubmitting}>
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
