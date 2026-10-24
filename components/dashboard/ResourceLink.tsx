import { ExternalLink } from "lucide-react";

export default function ResourceLink({
  href,
  title,
  subtitle,
  icon,
}: {
  href?: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  const content = (
    <>
      <span className="rounded-[12px] bg-[#FDF6F2] p-2.5 text-[#C25927]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#342E27]">{title}</span>
        <span className="mt-1 block truncate text-[11px] text-[#8F8578]">
          {subtitle}
        </span>
      </span>
      <ExternalLink className="ml-auto shrink-0 text-[#8F8578]" size={14} />
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center gap-3 rounded-[12px] border border-[#E8E3DA] p-3 transition hover:border-[#C25927]/40 hover:bg-[#FAF7F2]"
    >
      {content}
    </a>
  ) : (
    <div className="flex min-w-0 items-center gap-3 rounded-[12px] border border-dashed border-[#E8E3DA] p-3 opacity-60">
      {content}
    </div>
  );
}
