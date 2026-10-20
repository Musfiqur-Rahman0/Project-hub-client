interface AuthFormHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthFormHeader({ eyebrow, title, description }: AuthFormHeaderProps) {
  return (
    <header className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}
