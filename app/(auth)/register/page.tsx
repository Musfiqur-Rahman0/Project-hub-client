import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { AuthFooterLink } from "@/components/auth/auth-footer-link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthFormHeader } from "@/components/auth/auth-form-header";

export const metadata: Metadata = { title: "Create account · ProjectHub" };

export default function RegisterPage() {
  return (
    <AuthShell
      brand={{
        icon: <GraduationCap />,
        title: "Join ProjectHub to showcase your work.",
        description:
          "Submit your repositories, track review progress, and receive direct feedback from assigned mentors.",
        footnote: "Step 1 of 1: student registration",
      }}
    >
      <AuthFormHeader
        eyebrow="Student registration"
        title="Create student account"
        description="Enter your details to start submitting projects for review."
      />
      <RegisterForm />
      <AuthFooterLink prompt="Already have an account?" href="/login" label="Sign in" />
    </AuthShell>
  );
}
