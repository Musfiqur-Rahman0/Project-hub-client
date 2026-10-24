import { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";

import { Providers } from "@/components/providers";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DynamicAuthLayout>{children}</DynamicAuthLayout>
    </Suspense>
  );
}

async function DynamicAuthLayout({ children }: { children: ReactNode }) {
  await connection();
  return <Providers>{children}</Providers>;
}
