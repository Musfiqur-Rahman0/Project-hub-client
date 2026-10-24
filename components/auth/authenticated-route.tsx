"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/store";

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (authStatus !== "unauthenticated") return;

    const next = `${pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [authStatus, pathname, router]);

  if (authStatus !== "authenticated") {
    return (
      <main
        className="flex min-h-svh items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground">
          {authStatus === "unauthenticated"
            ? "Redirecting to sign in…"
            : "Loading your account…"}
        </p>
      </main>
    );
  }

  return children;
}
