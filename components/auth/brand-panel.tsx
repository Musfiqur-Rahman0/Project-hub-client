import type { ReactNode } from "react";
import { Logo } from "../shared/logo";

export interface BrandPanelProps {
  icon?: ReactNode;
  title: string;
  description: string;
  footnote: string;
}

/** Terracotta side panel. Hidden below `md`, where the form shows its own logo. */
export function BrandPanel({
  icon,
  title,
  description,
  footnote,
}: BrandPanelProps) {
  return (
    <aside className="bg-primary hidden flex-col justify-between gap-10 p-10 text-white md:flex min-h-[80vh]">
      <Logo tone="light" />

      <div className="space-y-4">
        {icon && (
          <div className="grid size-10 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25 [&_svg]:size-5">
            {icon}
          </div>
        )}
        <h1 className="max-w-sm text-balance text-3xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-white/75">
          {description}
        </p>
      </div>

      <p className="flex items-center gap-2 text-xs text-white/70">
        <span className="size-1.5 rounded-full bg-white/70" />
        {footnote}
      </p>
    </aside>
  );
}
