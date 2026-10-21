import Link from "next/link";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const demoUser = {
  name: "Alex Chen",
  email: "s.chen@university.edu",
};

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-0">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/submission"
            aria-label="ProjectHub home"
            className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"
          >
            <BriefcaseBusiness aria-hidden="true" size={16} />
          </Link>
          <Link
            href="/dashboard/submission"
            className="shrink-0 text-sm font-bold tracking-tight"
          >
            ProjectHub
          </Link>
          <span className="hidden rounded-full bg-brand-secondary/10 px-2.5 py-1 text-[10px] font-medium text-brand-secondary sm:inline-flex">
            Student Workspace
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-2 font-medium">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-brand-secondary"
            />
            <span className="hidden sm:inline">{demoUser.name}</span>
          </span>
          <span className="hidden text-muted-foreground md:inline">
            {demoUser.email}
          </span>
          <span
            aria-hidden="true"
            className="hidden h-5 border-l border-border sm:block"
          />
          <Button className="bg-transparent hover:bg-transparent flex items-center gap-1.5 text-muted-foreground">
            <LogOut aria-hidden="true" size={13} />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
