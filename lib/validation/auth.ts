import { z } from "zod";

/** Single source of truth for password rules: used by the schema AND the strength meter UI. */
export const passwordRules = [
  { id: "length", label: "8+ characters", test: (v: string) => v.length >= 8 },
  {
    id: "case",
    label: "Upper & lowercase",
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
] as const;

const email = z
  .string()
  .min(1, "Enter your email address")
  .email("Enter a valid email address");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email,
    password: z
      .string()
      .refine(
        (v) => passwordRules.every((r) => r.test(v)),
        "Password doesn’t meet all requirements",
      ),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v, "Accept the terms to continue"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don’t match",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
