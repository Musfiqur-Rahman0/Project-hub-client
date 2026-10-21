import type { SubmissionStatus } from "./types";

const styles: Record<SubmissionStatus, string> = {
  Pending: "border-[#F0CD89] bg-[#FDFAF2] text-[#81501E]",
  Approved: "border-[#BFE1D0] bg-[#DDEFE6] text-[#133E2B]",
  Rejected: "border-[#F4D5C4] bg-[#FAECE4] text-[#8E3A17]",
};
const labels: Record<SubmissionStatus, string> = {
  Pending: "Pending review",
  Approved: "Approved",
  Rejected: "Revision requested",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === "Pending" ? "bg-[#E0A33A]" : status === "Approved" ? "bg-[#133E2B]" : "bg-[#C25927]"}`}
      />
      {labels[status]}
    </span>
  );
}
