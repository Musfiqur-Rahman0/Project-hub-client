"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { type Control, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { projectSchema, type ProjectValues } from "@/lib/validation/project";
import {
  submitProject,
  type SubmissionRequestError,
} from "@/lib/submissions-slice";
import { useAppDispatch } from "@/lib/store";
import ProjectTextField from "./ProjectTextField";

interface ProjectSubmissionProps {
  aside?: ReactNode;
}

export function ProjectSubmission({ aside }: ProjectSubmissionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      liveUrl: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<ProjectValues> = async (values) => {
    form.clearErrors();
    try {
      await dispatch(submitProject(values)).unwrap();
      toast.success("Project submitted successfully.");
      form.reset();
      router.push("/");
    } catch (error) {
      const requestError = getSubmissionRequestError(error);
      const fieldErrors = getSubmissionFieldErrors(requestError.details);
      for (const field of [
        "projectName",
        "repoUrl",
        "liveUrl",
        "description",
      ] as const) {
        const message = fieldErrors[field];
        if (message) {
          form.setError(field, { type: "server", message });
        }
      }

      if (Object.keys(fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: requestError.message,
        });
      }
      toast.error(requestError.message);
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <section className="rounded-[12px] border border-border bg-primary-foreground p-5 shadow-sm sm:p-7">
        <header className="mb-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            New submission
          </p>
          <h1 className="font-heading text-xl font-bold tracking-tight">
            Submit your project for review
          </h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Provide your repository and live deployment details. Once submitted,
            assigned reviewers will examine your code and evaluate criteria.
          </p>
        </header>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            onChange={() => form.clearErrors("root")}
            className="space-y-4"
          >
            <ProjectTextField
              control={form.control}
              name="projectName"
              label="Project name"
              placeholder="Distributed Task Queue & Metrics Dashboard"
              description="Choose a clear name that reflects your project."
              required
            />
            <ProjectTextField
              control={form.control}
              name="repoUrl"
              label="GitHub repository URL"
              placeholder="https://github.com/username/project"
              description="Must be a public or accessible repository with your latest code commits."
              type="url"
              required
              icon={<Link2 aria-hidden="true" />}
            />
            <ProjectTextField
              control={form.control}
              name="liveUrl"
              label="Live project URL"
              placeholder="https://your-project.vercel.app"
              description="Provide the deployed environment (e.g. Vercel, Render, AWS, Fly.io)."
              type="url"
              required
              icon={<Link2 aria-hidden="true" />}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wide">
                      Project description{" "}
                      <span className="text-primary">*</span>
                    </FormLabel>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {field.value.length} / 1000
                    </span>
                  </div>
                  <FormControl>
                    <textarea
                      {...field}
                      maxLength={1000}
                      rows={5}
                      placeholder="Describe what you built and the key technologies you used..."
                      className="min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-xs leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive"
                      aria-required="true"
                    />
                  </FormControl>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Include stack details, test credentials (if any), and key
                    functionality highlights.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message && (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CheckCircle2 size={13} className="text-brand-secondary" />
                All fields are required
              </p>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <a
                  href="#submission-criteria"
                  className="text-[10px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Submission guidelines
                </a>
                <Button
                  type="submit"
                  size="sm"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Submitting…"
                    : "Submit project"}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </section>

      {aside && <aside className="space-y-4">{aside}</aside>}
    </div>
  );
}

function getSubmissionFieldErrors(
  details: unknown,
): Partial<Record<keyof ProjectValues, string>> {
  if (typeof details !== "object" || details === null) return {};

  const record = details as Record<string, unknown>;
  const errors: Partial<Record<keyof ProjectValues, string>> = {};
  for (const field of [
    "projectName",
    "repoUrl",
    "liveUrl",
    "description",
  ] as const) {
    const messages = record[field];
    if (Array.isArray(messages) && typeof messages[0] === "string") {
      errors[field] = messages[0];
    }
  }

  return errors;
}

function getSubmissionRequestError(error: unknown): SubmissionRequestError {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return {
      message: error.message,
      details: "details" in error ? error.details : undefined,
    };
  }

  return { message: "Unable to submit your project. Please try again." };
}
