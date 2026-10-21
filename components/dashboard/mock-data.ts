import type { Submission, SubmissionStatus, UserRole } from "./types";
export type { Submission, SubmissionStatus, UserRole };

export const initialSubmissions: Submission[] = [
  {
    id: "SUB-2026-104",
    projectName: "Distributed Task Queue & Metrics",
    studentId: "student-current",
    studentName: "Alex Chen",
    studentEmail: "alex.chen@university.edu",
    studentInitials: "AC",
    submittedAt: "2026-10-20T14:32:00",
    submittedTime: "2:32 PM",
    status: "Pending",
    stack: ["Next.js", "Redis", "Go"],
    repoUrl: "https://github.com/",
    demoUrl: "https://vercel.com/",
    description:
      "A distributed worker queue with retry handling, job monitoring, and a metrics dashboard for tracking background tasks.",
  },
  {
    id: "SUB-2026-103",
    projectName: "HealthTrack Realtime Vitals",
    studentId: "student-maya",
    studentName: "Maya Patel",
    studentEmail: "m.patel@student.edu",
    studentInitials: "MP",
    submittedAt: "2026-10-19T09:15:00",
    submittedTime: "9:15 AM",
    status: "Approved",
    stack: ["React", "Tailwind", "PostgreSQL"],
    repoUrl: "https://github.com/",
    demoUrl: "https://vercel.com/",
    description:
      "A responsive dashboard for visualizing health metrics, recent readings, and real-time vital sign trends.",
    feedback:
      "Approved! The interface is clear and the data visualization is well structured. Good component organization and responsive behavior. For your next iteration, consider adding loading and error states to the live data widgets.",
  },
  {
    id: "SUB-2026-102",
    projectName: "NFT Market Aggregator Engine",
    studentId: "student-david",
    studentName: "David Lee",
    studentEmail: "david.l@campus.edu",
    studentInitials: "DL",
    submittedAt: "2026-10-18T18:40:00",
    submittedTime: "6:40 PM",
    status: "Rejected",
    stack: ["Solidity", "Hardhat"],
    repoUrl: "https://github.com/",
    description:
      "A prototype that aggregates NFT listings and marketplace data.",
    feedback:
      "Please revise the error handling for failed marketplace requests and add tests for empty API responses. The README also needs setup instructions so another developer can run the project locally.",
  },
  {
    id: "SUB-2026-101",
    projectName: "AudioStream Collaborative DAW",
    studentId: "student-emma",
    studentName: "Emma Watson",
    studentEmail: "e.watson@student.edu",
    studentInitials: "EW",
    submittedAt: "2026-10-18T11:02:00",
    submittedTime: "11:02 AM",
    status: "Pending",
    stack: ["WebAssembly", "WebRTC", "Rust"],
    repoUrl: "https://github.com/",
    demoUrl: "https://vercel.com/",
    description:
      "A collaborative audio workstation concept with real-time session synchronization and shared editing.",
  },
  {
    id: "SUB-2026-100",
    projectName: "Campus Event Planner",
    studentId: "student-current",
    studentName: "Alex Chen",
    studentEmail: "alex.chen@university.edu",
    studentInitials: "AC",
    submittedAt: "2026-10-16T10:10:00",
    submittedTime: "10:10 AM",
    status: "Approved",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    repoUrl: "https://github.com/",
    demoUrl: "https://vercel.com/",
    description:
      "A campus event discovery and planning app with event listings, RSVP tracking, and personal schedules.",
    feedback:
      "Well done. The main user flows are easy to understand and the database model is sensible. Consider adding pagination to the event listing as the data grows.",
  },
  {
    id: "SUB-2026-099",
    projectName: "Study Buddy Planner",
    studentId: "student-current",
    studentName: "Alex Chen",
    studentEmail: "alex.chen@university.edu",
    studentInitials: "AC",
    submittedAt: "2026-10-14T16:25:00",
    submittedTime: "4:25 PM",
    status: "Rejected",
    stack: ["React", "Node.js", "MongoDB"],
    repoUrl: "https://github.com/",
    demoUrl: "https://vercel.com/",
    description:
      "A study planner for organizing sessions, deadlines, and learning goals.",
    feedback:
      "The core concept is promising. Please fix the task completion state so it persists after refresh, and improve form validation for empty task titles. Add a short test plan to the README before resubmitting.",
  },
];
