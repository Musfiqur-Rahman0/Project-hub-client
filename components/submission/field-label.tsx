import type { ReactNode } from "react";

import { FormLabel } from "@/components/ui/form";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  /** Right-aligned element on the label row (link, character counter…). */
  action?: ReactNode;
  className?: string;
}

/** Label row shared by every field. Must be rendered inside a FormItem. */
export function FieldLabel({ children, required, action, className }: FieldLabelProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <FormLabel className={className}>
        {children}
        {required && <span className="text-primary"> *</span>}
      </FormLabel>
      {action}
    </div>
  );
}
