import { ProjectValues } from "@/lib/validation/project";
import { ReactNode } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

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

export default function ProjectTextField({
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
