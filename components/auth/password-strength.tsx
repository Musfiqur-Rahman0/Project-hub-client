"use client";

import { Check, Circle } from "lucide-react";
import {
  type FieldPath,
  type FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { passwordRules } from "@/lib/validation/auth";

const LEVELS = [
  { label: "Too weak", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-amber-500" },
  { label: "Strong", bar: "bg-emerald-600" },
] as const;

export function PasswordStrength<T extends FieldValues>({
  name,
}: {
  name: FieldPath<T>;
}) {
  const { control } = useFormContext<T>();
  const value = (useWatch({ control, name }) as unknown as string) ?? "";

  const passed = passwordRules.filter((r) => r.test(value)).length;
  const level = LEVELS[passed];

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {passwordRules.map((rule, i) => (
            <span
              key={rule.id}
              className={cn(
                "h-1 flex-1 rounded-full bg-border",
                i < passed && level.bar,
              )}
            />
          ))}
        </div>
        {value && (
          <span className="text-xs text-muted-foreground">{level.label}</span>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {passwordRules.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                ok ? "text-emerald-700" : "text-muted-foreground",
              )}
            >
              {ok ? (
                <Check className="size-3" />
              ) : (
                <Circle className="size-3" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
