import type { Metadata } from "next";

import { AuthFooterLink } from "@/components/auth/auth-footer-link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AuthFormHeader } from "@/components/shared/form-header";

export const metadata: Metadata = { title: "Sign in · ProjectHub" };

export default function LoginPage() {
  return (
    <AuthShell
      brand={{
        title: "Move great projects from submission to decision.",
        description:
          "A focused workspace where students submit work and reviewers respond with clear, timely feedback.",
        footnote: "Secure student access",
      }}
    >
      <AuthFormHeader
        eyebrow="Welcome back"
        title="Sign in to your workspace"
        description="Use the email you registered with to pick up where you left off."
      />
      <LoginForm />
      <AuthFooterLink
        prompt="New to ProjectHub?"
        href="/register"
        label="Create an account"
      />
    </AuthShell>
  );
}
