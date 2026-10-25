export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequest = Omit<RegisterRequest, "fullName">;

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
};

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SubmissionRequest = {
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
};

export type ProjectSubmission = {
  id: string;
  projectName: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  studentId: string;
  reviewerId: string | null;
  feedback: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    fullName: string;
    email: string;
  };
};

export type SubmissionStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type SubmissionPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SubmissionListResponse = {
  submissions: ProjectSubmission[];
  pagination: SubmissionPagination;
};

export type SubmissionSort = "newest" | "oldest" | "name";

type ApiErrorResponse = {
  success: false;
  error?: {
    message?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let accessToken: string | null = null;
let refreshRequest: Promise<string> | null = null;

export function clearAccessToken(): void {
  accessToken = null;
}

async function postAuth<T>(path: string, input: RegisterRequest | LoginRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  let body: ApiResponse<{ user: AuthUser }> | ApiErrorResponse;
  try {
    body = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorResponse;
    throw new ApiError(
      errorBody.error?.message ?? `Request failed (${response.status}).`,
      response.status,
      errorBody.error?.details,
    );
  }

  return (body as ApiResponse<T>).data;
}

async function requestApi<T>(
  path: string,
  init: RequestInit = {},
  retryAfterRefresh = true,
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  let body: ApiResponse<T> | ApiErrorResponse;
  try {
    body = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (response.status === 401 && retryAfterRefresh) {
    await refreshAccessToken();
    return requestApi<T>(path, init, false);
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorResponse;
    throw new ApiError(
      errorBody.error?.message ?? `Request failed (${response.status}).`,
      response.status,
      errorBody.error?.details,
    );
  }

  return body as ApiResponse<T>;
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    refreshRequest = (async () => {
      const response = await fetch(
        `${baseUrl.replace(/\/+$/, "")}/auth/refresh`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        },
      );

      let body: ApiResponse<{ accessToken: string }> | ApiErrorResponse;
      try {
        body = await response.json();
      } catch {
        throw new Error("The server returned an unreadable response.");
      }

      if (!response.ok || !body.success) {
        const errorBody = body as ApiErrorResponse;
        throw new ApiError(
          errorBody.error?.message ?? `Request failed (${response.status}).`,
          response.status,
          errorBody.error?.details,
        );
      }

      const token = (body as ApiResponse<{ accessToken: string }>).data
        .accessToken;
      if (!token) {
        throw new Error("The server returned an invalid access token.");
      }

      accessToken = token;
      return token;
    })();
  }

  const currentRefreshRequest = refreshRequest;
  try {
    return await currentRefreshRequest;
  } catch (error) {
    accessToken = null;
    throw error;
  } finally {
    if (refreshRequest === currentRefreshRequest) {
      refreshRequest = null;
    }
  }
}

export async function getSubmissions(input: {
  page: number;
  pageSize: number;
  status?: SubmissionStatus;
  search?: string;
  sort?: SubmissionSort;
}): Promise<SubmissionListResponse> {
  const params = new URLSearchParams({
    page: String(input.page),
    pageSize: String(input.pageSize),
    sort: input.sort ?? "newest",
  });
  if (input.status) params.set("status", input.status);
  if (input.search) params.set("search", input.search);
  const response = await requestApi<ProjectSubmission[]>(
    `/submission/?${params.toString()}`,
  );
  const meta = response.meta as SubmissionPagination | undefined;

  if (!meta) {
    throw new Error("The server returned an invalid submission list.");
  }

  return { submissions: response.data, pagination: meta };
}

export async function getSubmissionStats(): Promise<SubmissionStats> {
  const response = await requestApi<SubmissionStats>("/submission/stats");
  return response.data;
}

export async function createSubmission(
  input: SubmissionRequest,
): Promise<ProjectSubmission> {
  const response = await requestApi<ProjectSubmission>("/submission/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function reviewSubmission(input: {
  id: string;
  status: Exclude<SubmissionStatus, "PENDING">;
  feedback: string;
}): Promise<ProjectSubmission> {
  const { id, ...body } = input;
  const response = await requestApi<ProjectSubmission>(
    `/submission/${encodeURIComponent(id)}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  return response.data;
}

export async function registerUser(input: RegisterRequest): Promise<AuthUser> {
  const data = await postAuth<{ user: AuthUser }>("/auth/register", input);
  return data.user;
}

export async function loginUser(input: LoginRequest): Promise<AuthUser> {
  const data = await postAuth<{ user: AuthUser; accessToken: string }>(
    "/auth/login",
    input,
  );
  if (!data.accessToken) {
    throw new Error("The server did not return an access token.");
  }
  accessToken = data.accessToken;
  return data.user;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await requestApi<{ user: AuthUser }>("/auth/me");
  return response.data.user;
}

export async function logoutUser(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/auth/logout`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new ApiError(`Sign out failed (${response.status}).`, response.status);
  }

  clearAccessToken();
}
