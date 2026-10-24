"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { logoutUser } from "@/lib/api";
import { clearUser } from "@/lib/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export function AppHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logoutUser();
      dispatch(clearUser());
      toast.success("You have been signed out.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  }

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
              className={`size-2 rounded-full ${user ? "bg-brand-secondary" : "bg-muted-foreground"}`}
            />
            <span className="hidden sm:inline">
              {user?.fullName ??
                (authStatus === "loading" ? "Loading account…" : "Account unavailable")}
            </span>
          </span>
          <span className="hidden text-muted-foreground md:inline">
            {user?.email ?? ""}
          </span>
          <span
            aria-hidden="true"
            className="hidden h-5 border-l border-border sm:block"
          />
          {user ? (
            <Button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5 bg-transparent text-muted-foreground hover:bg-transparent"
            >
              <LogOut aria-hidden="true" size={13} />
              <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
            </Button>
          ) : (
            <span className="text-muted-foreground">
              {authStatus === "loading" ? "Checking session…" : "Not signed in"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
