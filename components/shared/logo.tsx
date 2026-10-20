import { FolderKanban } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  tone?: "dark" | "light";
  className?: string;
}

export function Logo({ tone = "dark", className }: LogoProps) {
  const light = tone === "light";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg",
          light ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-primary/10 text-primary"
        )}
      >
        <FolderKanban className="size-4" />
      </span>
      <div className="leading-tight">
        <p className={cn("text-sm font-semibold", light ? "text-white" : "text-foreground")}>
          ProjectHub
        </p>
        <p className={cn("text-xs", light ? "text-white/70" : "text-muted-foreground")}>
          Student project reviews
        </p>
      </div>
    </div>
  );
}
