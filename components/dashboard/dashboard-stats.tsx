import type { LucideIcon } from "lucide-react";

type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "orange" | "amber" | "green" | "red";
  hint: string;
};

const tones = {
  orange: "bg-[#FDF6F2] text-[#C25927] border-[#F4D5C4]",
  amber: "bg-[#FDFAF2] text-[#9D641D] border-[#F6E2B8]",
  green: "bg-[#F1F8F4] text-[#133E2B] border-[#DDEFE6]",
  red: "bg-[#FDF6F2] text-[#C25927] border-[#F4D5C4]",
};

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return <section aria-label="Submission statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map(stat => {
      const Icon = stat.icon;
      return <article key={stat.label} className="flex items-center justify-between rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#8F8578]">{stat.label}</p><p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#1E1A16]">{stat.value}</p><p className="mt-1 text-[11px] text-[#8F8578]">{stat.hint}</p></div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[stat.tone]}`}><Icon size={20}/></div>
      </article>;
    })}
  </section>;
}
