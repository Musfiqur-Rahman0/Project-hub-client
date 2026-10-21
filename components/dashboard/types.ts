export type UserRole = "admin" | "mentor" | "student";
export type SubmissionStatus = "Pending" | "Approved" | "Rejected";

export type Submission = {
  id: string;
  projectName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentInitials: string;
  submittedAt: string;
  submittedTime: string;
  status: SubmissionStatus;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  description: string;
  feedback?: string;
  reviewedAt?: string;
};
