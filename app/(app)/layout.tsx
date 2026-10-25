import type { ReactNode } from "react";
import { Suspense } from "react";

import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { AuthenticatedRoute } from "@/components/auth/authenticated-route";
import { connection } from "next/server";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-busy="true" />}>
      <DynamicAppLayout>{children}</DynamicAppLayout>
    </Suspense>
  );
}

async function DynamicAppLayout({ children }: { children: ReactNode }) {
  await connection();

  return (
    <AuthenticatedRoute>
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
        <AppFooter />
      </div>
    </AuthenticatedRoute>
  );
}
