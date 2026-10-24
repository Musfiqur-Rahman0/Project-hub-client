import { AuthUser, ProjectSubmission } from "@/lib/api";
import { Submission } from "./types";

export default function toDashboardSubmission(
  submission: ProjectSubmission,
  currentUser: AuthUser | null,
): Submission {
  const studentName =
    submission.student?.fullName ?? currentUser?.fullName ?? "Student";
  const submittedAt = submission.createdAt;

  return {
    id: submission.id,
    projectName: submission.projectName,
    studentId: submission.studentId,
    studentName,
    studentEmail: submission.student?.email ?? currentUser?.email ?? "",
    studentInitials: studentName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    submittedAt,
    submittedTime: new Date(submittedAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
    status:
      submission.status === "PENDING"
        ? "Pending"
        : submission.status === "APPROVED"
          ? "Approved"
          : "Rejected",
    stack: [],
    repoUrl: submission.repositoryUrl,
    demoUrl: submission.liveUrl,
    description: submission.description,
    feedback: submission.feedback ?? undefined,
    reviewedAt: submission.reviewedAt ?? undefined,
  };
}
