"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthForm } from "./auth-form";
import { PasswordStrength } from "./password-strength";
import { registerSchema, RegisterValues } from "@/lib/validation/auth";
import { getApiErrorMessage, useRegisterMutation } from "@/lib/api";
import { TextField } from "./text-field";
import { PasswordField } from "./password-field";
import { CheckboxField } from "./checkbox-field";
import { SubmitButton } from "./submit-button";

const linkClass = "font-medium text-primary underline-offset-4 hover:underline";

export function RegisterForm() {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit: SubmitHandler<RegisterValues> = async (values) => {
    try {
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success("Account created. Sign in to continue.");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AuthForm form={form} onSubmit={onSubmit}>
      <TextField<RegisterValues>
        name="fullName"
        label="Full name"
        placeholder="Jane Doe"
        autoComplete="name"
      />
      <TextField<RegisterValues>
        name="email"
        label="Email address"
        type="email"
        placeholder="you@university.edu"
        autoComplete="email"
      />
      <PasswordField<RegisterValues>
        name="password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
      >
        <PasswordStrength<RegisterValues> name="password" />
      </PasswordField>
      <PasswordField<RegisterValues>
        name="confirmPassword"
        label="Confirm password"
        placeholder="Repeat your password"
        autoComplete="new-password"
      />
      <CheckboxField<RegisterValues>
        name="terms"
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className={linkClass}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
          </>
        }
      />
      <SubmitButton loadingText="Creating account…">Create account</SubmitButton>
    </AuthForm>
  );
}
