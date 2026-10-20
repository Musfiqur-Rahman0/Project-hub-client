import { Clock3 } from "lucide-react";

export function ReviewTurnaroundCard() {
  return (
    <section className="rounded-[12px] bg-brand-primary p-5 text-primary-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-white/15">
          <Clock3 aria-hidden="true" size={14} />
        </span>
        <h2 className="text-sm font-bold">Review Turnaround</h2>
      </div>
      <p className="mt-3 text-xs font-semibold leading-relaxed">
        Submissions are typically reviewed within 2–3 business days.
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-white/80">
        You’ll be notified when your review is complete and receive feedback
        directly within ProjectHub.
      </p>
    </section>
  );
}
