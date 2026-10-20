import type { Metadata } from "next";

import { ProjectSubmission } from "@/components/projects/project-submission";
import { ReviewTurnaroundCard } from "@/components/projects/review-turnaround-card";
import { SubmissionCriteriaCard } from "@/components/projects/submission-criteria-card";

export const metadata: Metadata = { title: "Submit project · ProjectHub" };

export default function page() {
  return (
    <ProjectSubmission
      aside={
        <>
          <SubmissionCriteriaCard />
          <ReviewTurnaroundCard />
        </>
      }
    />
  );
}
