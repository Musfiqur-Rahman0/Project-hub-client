import type { ReactNode } from "react";

import { BrandPanel, type BrandPanelProps } from "./brand-panel";
import { Logo } from "../shared/logo";

interface AuthShellProps {
  brand: BrandPanelProps;
  children: ReactNode;
}

/** Split-screen card shared by every auth page: brand panel left, form right. */
export function AuthShell({ brand, children }: AuthShellProps) {
  return (
    <main
      className="flex min-h-svh items-center justify-center bg-transparent
     p-4 sm:p-8"
    >
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl shadow-primary/10 md:grid-cols-[5fr_6fr]">
        <BrandPanel {...brand} />
        <section className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 md:py-12">
          <Logo className="md:hidden" />
          {children}
        </section>
      </div>
    </main>
  );
}
