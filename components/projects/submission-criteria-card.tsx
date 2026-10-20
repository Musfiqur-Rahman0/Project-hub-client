import { Check, ClipboardCheck } from "lucide-react";

const criteria = [
  {
    title: "Clean README",
    description: "Setup guide, tech overview, and architecture.",
  },
  {
    title: "Functional Live Demo",
    description: "Verified functionality with core UI and flows.",
  },
  {
    title: "Automated Testing Passing",
    description: "Unit and integration test suites run without errors.",
  },
  {
    title: "No Secrets in Code",
    description: "API keys and credentials remain private.",
  },
];

export function SubmissionCriteriaCard() {
  return (
    <section
      id="submission-criteria"
      className="rounded-[12px] border border-border bg-primary-foreground p-5 shadow-sm"
    >
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
          <ClipboardCheck aria-hidden="true" size={14} />
        </span>
        Submission Criteria
      </h2>
      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        Mentors evaluate against standards before approving. Confirm your
        project meets the following:
      </p>
      <ul className="mt-3 space-y-3">
        {criteria.map((item) => (
          <li key={item.title} className="flex items-start gap-2">
            <Check
              aria-hidden="true"
              size={13}
              className="mt-0.5 shrink-0 text-primary"
            />
            <p className="text-[10px] leading-relaxed">
              <span className="font-semibold">{item.title}:</span>{" "}
              <span className="text-muted-foreground">{item.description}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-border pt-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wide">
          Need to update after submitting?
        </h3>
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
          You can edit your submission details from the project dashboard.
        </p>
      </div>
    </section>
  );
}
