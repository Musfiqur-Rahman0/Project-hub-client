"use client";

import { useAppSelector } from "@/lib/store";

export function AppFooter() {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex min-h-10 max-w-5xl flex-col items-start justify-center gap-1 px-4 py-2 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-0">
        <p>
          <span className="font-semibold text-foreground">ProjectHub</span>
          <span className="text-muted-foreground">
            {" "}
            — Secure, role-based project workflow
          </span>
        </p>
        <p className="text-muted-foreground">
          {user
            ? `Signed in as ${user.email}`
            : status === "loading"
              ? "Loading account…"
              : "Not signed in"}
        </p>
      </div>
    </footer>
  );
}
