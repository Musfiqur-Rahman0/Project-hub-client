"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthForm } from "./auth-form";
import { loginSchema, LoginValues } from "@/lib/validation/auth";
import { getApiErrorMessage, useLoginMutation } from "@/lib/api";
import { TextField } from "./text-field";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login] = useLoginMutation();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginValues> = async (values) => {
    try {
      await login(values).unwrap();
      toast.success("Signed in successfully.");
      const next = searchParams.get("next");
      const redirectPath =
        next?.startsWith("/") && !next.startsWith("//") ? next : "/";
      router.replace(redirectPath);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AuthForm form={form} onSubmit={onSubmit}>
      <TextField<LoginValues>
        name="email"
        label="Email address"
        type="email"
        placeholder="you@university.edu"
        autoComplete="email"
        className=""
      />
      <PasswordField<LoginValues>
        name="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        labelAction={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        }
      />
      <SubmitButton
        icon={<LogIn className="size-4" />}
        loadingText="Signing in…"
      >
        Sign in
      </SubmitButton>
    </AuthForm>
  );
}
