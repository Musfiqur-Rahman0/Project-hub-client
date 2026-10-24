"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  FolderKanban,
  Clock3,
  CircleCheck,
  CircleX,
  ExternalLink,
  Filter,
  Eye,
  MessageSquareText,
  X,
  Check,
  ChevronDown,
  FileText,
  GitBranch,
} from "lucide-react";
import type {
  Submission,
  UserRole,
  SubmissionStatus,
} from "@/components/dashboard/types";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { StatusBadge } from "@/components/dashboard/submission-status";
import Link from "next/link";
import type {
  AuthUser,
  ProjectSubmission,
  SubmissionSort,
  SubmissionStatus as ApiSubmissionStatus,
} from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchSubmissionStats,
  fetchSubmissions,
  saveSubmissionReview,
} from "@/lib/submissions-slice";
import EmptyState from "@/components/dashboard/EmptyState";
import ResourceLink from "@/components/dashboard/ResourceLink";
import toDashboardSubmission from "@/components/dashboard/toDashboardSubmission";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);
  const {
    items,
    pagination,
    stats: submissionStats,
    status,
    statsStatus,
    reviewStatus,
  } = useAppSelector((state) => state.submissions);
  const role: UserRole =
    user?.role === "ADMIN"
      ? "admin"
      : user?.role === "MENTOR"
        ? "mentor"
        : "student";
  const [filter, setFilter] = useState<"All" | SubmissionStatus>("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SubmissionSort>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState<"Approved" | "Rejected" | null>(
    null,
  );
  const isReviewer = role === "mentor" || role === "admin";
  const apiFilter: ApiSubmissionStatus | undefined =
    filter === "All"
      ? undefined
      : (filter.toUpperCase() as ApiSubmissionStatus);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !user) return;
    dispatch(
      fetchSubmissions({
        page,
        pageSize,
        status: apiFilter,
        search: debouncedSearch || undefined,
        sort,
      }),
    )
      .unwrap()
      .catch((error: string) => toast.error(error));
  }, [
    apiFilter,
    authStatus,
    debouncedSearch,
    dispatch,
    page,
    pageSize,
    sort,
    user,
  ]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !user) return;
    dispatch(fetchSubmissionStats())
      .unwrap()
      .catch((error: string) => toast.error(error));
  }, [authStatus, dispatch, user]);

  const submissions = useMemo(
    () => items.map((item) => toDashboardSubmission(item, user)),
    [items, user],
  );

  const visibleSubmissions = submissions;

  const stats = [
    {
      label: isReviewer ? "Total submissions" : "My submissions",
      value: submissionStats?.total ?? 0,
      icon: FileText,
      tone: "orange" as const,
      hint: isReviewer ? "Across all students" : "Projects submitted",
    },
    {
      label: "Pending review",
      value: submissionStats?.pending ?? 0,
      icon: Clock3,
      tone: "amber" as const,
      hint: isReviewer ? "Action required" : "Waiting for mentor",
    },
    {
      label: "Approved",
      value: submissionStats?.approved ?? 0,
      icon: CircleCheck,
      tone: "green" as const,
      hint: isReviewer ? "Successfully reviewed" : "Great work",
    },
    {
      label: "Rejected",
      value: submissionStats?.rejected ?? 0,
      icon: CircleX,
      tone: "red" as const,
      hint: isReviewer ? "Feedback available" : "Review mentor feedback",
    },
  ];

  function openSubmission(item: Submission) {
    setSelected(item);
    setFeedback(item.feedback ?? "");
    setDecision(item.status === "Pending" ? null : item.status);
  }

  async function saveReview() {
    if (!selected || !isReviewer || !decision || !feedback.trim()) return;
    try {
      const reviewed = await dispatch(
        saveSubmissionReview({
          id: selected.id,
          status: decision.toUpperCase() as Exclude<
            ApiSubmissionStatus,
            "PENDING"
          >,
          feedback: feedback.trim(),
        }),
      ).unwrap();
      setSelected({
        ...selected,
        status: decision,
        feedback: reviewed.feedback ?? feedback.trim(),
        reviewedAt: reviewed.reviewedAt ?? new Date().toISOString(),
      });
      toast.success("Review saved.");
      const [listResult] = await Promise.all([
        dispatch(
          fetchSubmissions({
            page,
            pageSize,
            status: apiFilter,
            search: debouncedSearch || undefined,
            sort,
          }),
        ).unwrap(),
        dispatch(fetchSubmissionStats()).unwrap(),
      ]);
      const refreshedSubmission = listResult.submissions.find(
        (item) => item.id === selected.id,
      );
      if (refreshedSubmission) {
        setSelected(toDashboardSubmission(refreshedSubmission, user));
      }
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to save review.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C241E]">
      <main className="mx-auto max-w-[1440px] space-y-7 px-4 py-7 sm:px-6 lg:px-0 lg:py-9">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#C25927]">
              {isReviewer
                ? `${role === "admin" ? "Admin" : "Mentor"} workspace`
                : "Your learning workspace"}
            </p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#1E1A16] sm:text-3xl">
              {isReviewer
                ? "Project Submissions Review"
                : "My Project Submissions"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6256]">
              {isReviewer
                ? "Review student work, check repositories and live demos, and share clear feedback."
                : "Track your submitted projects and see your mentor’s feedback and review decisions."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-[12px] border border-[#E8E3DA] bg-white px-3 py-2 text-xs text-[#6B6256] shadow-sm">
              <span
                className={`h-2 w-2 rounded-full ${isReviewer ? "bg-[#C25927]" : "bg-[#133E2B]"}`}
              />
              {isReviewer
                ? `${role === "admin" ? "Admin" : "Mentor"} view`
                : "Private student view"}
            </div>
            {role === "student" && (
              <Link href="/submission" className="button">
                Add Project
              </Link>
            )}
          </div>
        </div>

        <DashboardStats stats={stats} />
        {authStatus === "loading" && (
          <p role="status" className="text-sm text-[#6B6256]">
            Loading your account…
          </p>
        )}
        {status === "loading" && (
          <p role="status" className="text-sm text-[#6B6256]">
            Loading submissions…
          </p>
        )}
        {status === "failed" && (
          <p role="alert" className="text-sm text-destructive">
            Unable to load submissions. Please try again.
          </p>
        )}
        {statsStatus === "failed" && (
          <p role="alert" className="text-sm text-destructive">
            Unable to load submission statistics.
          </p>
        )}

        <section className="overflow-hidden rounded-[12px] border border-[#E8E3DA] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#E8E3DA] p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-w-48 items-center gap-2 rounded-[12px] border border-[#E8E3DA] bg-[#FAF7F2] px-3 py-2 text-xs text-[#8F8578]">
              <Search size={14} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search submissions"
                aria-label="Search submissions"
                className="min-w-0 flex-1 bg-transparent text-[#342E27] outline-none placeholder:text-[#8F8578]"
              />
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(["All", "Pending", "Approved", "Rejected"] as const).map(
                (status) => {
                  const count =
                    status === "All"
                      ? (submissionStats?.total ?? 0)
                      : (submissionStats?.[
                          status.toLowerCase() as
                            | "pending"
                            | "approved"
                            | "rejected"
                        ] ?? 0);
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setPage(1);
                        setFilter(status);
                      }}
                      className={`whitespace-nowrap rounded-[12px] px-3.5 py-2 text-xs font-bold transition ${filter === status ? "bg-[#C25927] text-white shadow-sm" : "text-[#6B6256] hover:bg-[#F5EFE6]"}`}
                    >
                      {status === "Rejected" ? "Rejected" : status}{" "}
                      <span
                        className={
                          filter === status ? "text-white/75" : "text-[#8F8578]"
                        }
                      >
                        ({count})
                      </span>
                    </button>
                  );
                },
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-xs font-medium text-[#8F8578]">
                Sort by
              </label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value as SubmissionSort);
                  }}
                  className="appearance-none rounded-[12px] border border-[#E8E3DA] bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-semibold outline-none focus:border-[#C25927]"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Project name</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8F8578]"
                />
              </div>
              <button
                onClick={() => {
                  setFilter("All");
                  setPage(1);
                  setSearch("");
                  setSort("newest");
                }}
                className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#E8E3DA] px-3 py-2 text-xs font-semibold text-[#6B6256] hover:bg-[#FAF7F2]"
              >
                <Filter size={14} /> Reset
              </button>
            </div>
          </div>

          <div className="md:hidden">
            {visibleSubmissions.length ? (
              visibleSubmissions.map((item) => (
                <article
                  key={item.id}
                  className="space-y-3 border-b border-[#E8E3DA] p-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button
                        onClick={() => openSubmission(item)}
                        className="text-left font-bold text-[#342E27] hover:text-[#C25927] hover:underline"
                      >
                        {item.projectName}
                      </button>
                      <p className="mt-1 text-xs text-[#8F8578]">
                        {isReviewer ? item.studentName + " · " : ""}
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#F5EFE6] px-2 py-1 text-[11px] font-semibold text-[#6B6256]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {item.repoUrl && (
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-[12px] bg-[#F5EFE6] px-2.5 py-2 text-xs font-semibold"
                        >
                          <GitBranch size={13} /> Repo
                        </a>
                      )}
                      {item.demoUrl && (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-[12px] bg-[#F5EFE6] px-2.5 py-2 text-xs font-semibold"
                        >
                          <ExternalLink size={13} /> Live demo
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => openSubmission(item)}
                      className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#E8E3DA] px-3 py-2 text-xs font-bold hover:border-[#C25927] hover:text-[#C25927]"
                    >
                      {isReviewer
                        ? "Review submission"
                        : role === "student" && item.status !== "Pending"
                          ? "View feedback"
                          : "View details"}{" "}
                      <Eye size={13} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState role={role} />
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-[#E8E3DA] bg-[#F6F3EE] text-[10px] font-extrabold uppercase tracking-[.12em] text-[#6B6256]">
                <tr>
                  <th className="px-5 py-4">
                    {isReviewer ? "Project name & stack" : "My project & stack"}
                  </th>
                  {isReviewer && <th className="px-4 py-4">Student</th>}
                  <th className="px-4 py-4">Submitted on</th>
                  <th className="px-4 py-4">Links</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DA]/80">
                {visibleSubmissions.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-[#FAF7F2] ${item.status === "Pending" ? "bg-[#FFFCF6]" : ""}`}
                  >
                    <td className="max-w-[330px] px-5 py-4">
                      <button
                        onClick={() => openSubmission(item)}
                        className="text-left font-bold text-[#342E27] hover:text-[#C25927] hover:underline"
                      >
                        {item.projectName}
                      </button>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.stack.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[#F5EFE6] px-1.5 py-1 text-[10px] font-semibold text-[#6B6256]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    {isReviewer && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DDEFE6] text-[10px] font-extrabold text-[#133E2B]">
                            {item.studentInitials}
                          </span>
                          <div>
                            <p className="text-xs font-bold">
                              {item.studentName}
                            </p>
                            <p className="mt-1 text-[10px] text-[#8F8578]">
                              {item.studentEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#6B6256]">
                      {new Date(item.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <p className="mt-1 text-[10px] text-[#8F8578]">
                        {item.submittedTime}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {item.repoUrl ? (
                          <Link
                            href={item.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-[#F5EFE6] px-2 py-1.5 text-[11px] font-semibold hover:bg-[#E8E3DA]"
                          >
                            <GitBranch size={12} /> Repo
                          </Link>
                        ) : (
                          <span className="text-[11px] text-[#8F8578]">
                            No repo
                          </span>
                        )}
                        {item.demoUrl ? (
                          <Link
                            href={item.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-[#F5EFE6] px-2 py-1.5 text-[11px] font-semibold hover:bg-[#E8E3DA]"
                          >
                            <ExternalLink size={12} /> Live
                          </Link>
                        ) : (
                          <span className="text-[11px] text-[#8F8578]">
                            No demo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openSubmission(item)}
                        className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-2 text-xs font-bold transition ${isReviewer ? "bg-[#C25927] text-white hover:bg-[#AD491D]" : "border border-[#E8E3DA] bg-white text-[#6B6256] hover:border-[#C25927] hover:text-[#C25927]"}`}
                      >
                        {isReviewer
                          ? "Review"
                          : role === "student" && item.status !== "Pending"
                            ? "Feedback"
                            : "View"}{" "}
                        {role === "student" && item.status === "Rejected" ? (
                          <MessageSquareText size={13} />
                        ) : (
                          <Eye size={13} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleSubmissions.length && <EmptyState role={role} />}
          </div>
          <div className="flex flex-col justify-between gap-2 border-t border-[#E8E3DA] bg-[#FAF7F2] px-5 py-3 text-xs text-[#8F8578] sm:flex-row sm:items-center">
            <span>
              Showing{" "}
              <strong className="text-[#342E27]">
                {pagination?.total
                  ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, pagination.total)} of ${pagination.total}`
                  : "0"}
              </strong>{" "}
              {pagination?.total === 1 ? "submission" : "submissions"}
            </span>
            <div className="flex items-center gap-3">
              <span>
                {isReviewer
                  ? `${role === "admin" ? "Admin" : "Mentor"} access · All student submissions`
                  : "Student access · Only your submissions"}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || status === "loading"}
                className="rounded border border-[#E8E3DA] px-3 py-1.5 font-semibold text-[#6B6256] disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {pagination?.page ?? page} of{" "}
                {Math.max(1, pagination?.totalPages ?? 1)}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!pagination?.hasNextPage || status === "loading"}
                className="rounded border border-[#E8E3DA] px-3 py-1.5 font-semibold text-[#6B6256] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            aria-label="Close details"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-[#1E1A16]/50 backdrop-blur-[2px]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-title"
            className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#C25927] to-[#9E431A] p-6 text-white">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                  {selected.status === "Pending"
                    ? "Awaiting review"
                    : selected.status === "Approved"
                      ? "Approved submission"
                      : "Rejected"}
                </div>
                <h2
                  id="submission-title"
                  className="font-display text-xl font-extrabold"
                >
                  {selected.projectName}
                </h2>
                <p className="mt-1 text-xs text-white/75">
                  Submission ID: {selected.id}
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="rounded-[12px] p-2 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex items-center justify-between rounded-[12px] border border-[#E8E3DA] bg-[#FAF7F2] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDEFE6] text-xs font-extrabold text-[#133E2B]">
                    {selected.studentInitials}
                  </span>
                  <div>
                    <p className="text-sm font-bold">
                      {role === "student"
                        ? "Submitted by you"
                        : selected.studentName}
                    </p>
                    <p className="mt-1 text-xs text-[#8F8578]">
                      {role === "student"
                        ? "Your project submission"
                        : selected.studentEmail}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#8F8578]">
                  Project resources
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResourceLink
                    href={selected.repoUrl}
                    title="GitHub repository"
                    subtitle={
                      selected.repoUrl
                        ? "Open source code"
                        : "No repository provided"
                    }
                    icon={<GitBranch size={17} />}
                  />
                  <ResourceLink
                    href={selected.demoUrl}
                    title="Live deployment"
                    subtitle={
                      selected.demoUrl
                        ? "Open deployed project"
                        : "No live demo provided"
                    }
                    icon={<ExternalLink size={17} />}
                  />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#8F8578]">
                  Project overview
                </h3>
                <p className="rounded-[12px] border border-[#E8E3DA] bg-[#FAF7F2] p-4 text-sm leading-6 text-[#6B6256]">
                  {selected.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#F5EFE6] px-2.5 py-1.5 text-xs font-semibold text-[#6B6256]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#8F8578]">
                  {isReviewer
                    ? `${role === "admin" ? "Admin" : "Mentor"} feedback`
                    : "Feedback from your mentor"}
                </h3>
                {isReviewer ? (
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    placeholder="Share specific, constructive feedback. Explain what went well and what should be improved..."
                    className="w-full resize-y rounded-[12px] border border-[#E8E3DA] p-3 text-sm leading-6 outline-none focus:border-[#C25927] focus:ring-2 focus:ring-[#C25927]/10"
                  />
                ) : (
                  <div
                    className={`rounded-[12px] border p-4 text-sm leading-6 ${selected.status === "Rejected" ? "border-[#F4D5C4] bg-[#FDF6F2] text-[#753017]" : selected.status === "Approved" ? "border-[#BFE1D0] bg-[#F1F8F4] text-[#133E2B]" : "border-[#F0CD89] bg-[#FDFAF2] text-[#81501E]"}`}
                  >
                    {selected.feedback ||
                      (selected.status === "Pending"
                        ? "Your mentor has not reviewed this submission yet. You’ll see feedback here when the review is complete."
                        : "No written feedback was added for this submission.")}
                  </div>
                )}
              </div>
              {isReviewer && (
                <div>
                  <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#8F8578]">
                    Review decision
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDecision("Approved")}
                      className={`flex items-center justify-center gap-2 rounded-[12px] border px-3 py-3 text-sm font-bold transition ${decision === "Approved" ? "border-[#133E2B] bg-[#F1F8F4] text-[#133E2B] ring-2 ring-[#133E2B]/10" : "border-[#E8E3DA] hover:border-[#133E2B]/40"}`}
                    >
                      <Check size={16} /> Approve project
                    </button>
                    <button
                      onClick={() => setDecision("Rejected")}
                      className={`flex items-center justify-center gap-2 rounded-[12px] border px-3 py-3 text-sm font-bold transition ${decision === "Rejected" ? "border-[#C25927] bg-[#FDF6F2] text-[#8E3A17] ring-2 ring-[#C25927]/10" : "border-[#E8E3DA] hover:border-[#C25927]/40"}`}
                    >
                      <CircleX size={16} /> Request Rejected
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-[#8F8578]">
                    Written feedback is required to submit a review.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#E8E3DA] bg-white p-5">
              <button
                onClick={() => setSelected(null)}
                className="rounded-[12px] border border-[#E8E3DA] px-4 py-2.5 text-sm font-bold text-[#6B6256] hover:bg-[#FAF7F2]"
              >
                Close
              </button>
              {isReviewer ? (
                <button
                  disabled={
                    !decision || !feedback.trim() || reviewStatus === "loading"
                  }
                  onClick={saveReview}
                  className="rounded-[12px] bg-[#C25927] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#AD491D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {reviewStatus === "loading" ? "Saving…" : "Save review"}
                </button>
              ) : (
                <span className="text-xs text-[#8F8578]">
                  Your submission details are private.
                </span>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
