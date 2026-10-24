"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Link2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { type Control, type SubmitHandler, useForm } from "react-hook-form";

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
import { submitProject } from "@/lib/submissions-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "sonner";

interface ProjectSubmissionProps {
  aside?: ReactNode;
}

export function ProjectSubmission({ aside }: ProjectSubmissionProps) {
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const submissionStatus = useAppSelector(
    (state) => state.submissions.status,
  );
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
    try {
      await dispatch(submitProject(values)).unwrap();
      setSubmissionNotice("Your project was submitted for review.");
      toast.success("Project submitted successfully.");
      form.reset();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to submit your project. Please try again.",
      );
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
            onChange={() => setSubmissionNotice(null)}
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

            {submissionNotice && (
              <p
                role="status"
                className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-foreground"
              >
                {submissionNotice}
              </p>
            )}
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
                  disabled={
                    form.formState.isSubmitting || submissionStatus === "loading"
                  }
                >
                  Submit project
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

interface ProjectTextFieldProps {
  control: Control<ProjectValues>;
  name: "projectName" | "repoUrl" | "liveUrl";
  label: string;
  placeholder: string;
  description: string;
  type?: string;
  required?: boolean;
  icon?: ReactNode;
}

function ProjectTextField({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  required,
  icon,
}: ProjectTextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide">
            {label}
            {required && <span className="text-primary"> *</span>}
          </FormLabel>
          <div className="relative">
            {icon && (
              <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground [&_svg]:size-3">
                {icon}
              </span>
            )}
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                aria-required={required}
                className={`min-h-10 rounded-md bg-background text-xs ${icon ? "pl-8" : ""}`}
              />
            </FormControl>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            {description}
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
