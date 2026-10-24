import { FolderKanban } from "lucide-react";
import { UserRole } from "./types";

export default function EmptyState({ role }: { role: UserRole }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F5EFE6] text-[#8F8578]">
        <FolderKanban size={22} />
      </div>
      <h3 className="mt-4 font-display text-base font-extrabold">
        No submissions found
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#8F8578]">
        {role === "student"
          ? "You don’t have any submissions matching these filters yet."
          : "No projects match the current search and filters."}
      </p>
    </div>
  );
}