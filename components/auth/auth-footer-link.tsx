import Link from "next/link";

interface AuthFooterLinkProps {
  prompt: string;
  href: string;
  label: string;
}

export function AuthFooterLink({ prompt, href, label }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link href={href} className="font-medium text-primary underline-offset-4 hover:underline">
        {label}
      </Link>
    </p>
  );
}
