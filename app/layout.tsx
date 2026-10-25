import { Suspense, type ReactNode } from "react";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/providers";
import { connection } from "next/server";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

async function DynamicProviders({ children }: { children: ReactNode }) {
  await connection();
  return <Providers>{children}</Providers>;
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <DynamicProviders>{children}</DynamicProviders>
        </Suspense>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
