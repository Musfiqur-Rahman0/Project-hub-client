import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export type ApiClientError = {
  message: string;
  code: string;
  status?: number | string;
  details?: unknown;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

type ApiErrorResponse = {
  success: false;
  error: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  fullName: string;
};

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
};

export type SubmissionPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SubmissionStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type SubmissionList = {
  submissions: ProjectSubmission[];
  pagination: SubmissionPagination;
};

type ApiBaseQueryError = Extract<
  FetchBaseQueryError,
  { status: "CUSTOM_ERROR" }
>;

function getApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required and must include the backend /api/v1 prefix.",
    );
  }

  let apiUrl: URL;
  try {
    apiUrl = new URL(configuredUrl);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL ending in /api/v1.",
    );
  }

  const path = apiUrl.pathname.replace(/\/+$/, "");
  if (
    !["http:", "https:"].includes(apiUrl.protocol) ||
    apiUrl.username ||
    apiUrl.password ||
    apiUrl.search ||
    apiUrl.hash ||
    path !== "/api/v1"
  ) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL ending in /api/v1.",
    );
  }

  return `${apiUrl.origin}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function makeClientError(
  message: string,
  code: string,
  status?: number | string,
  details?: unknown,
): ApiBaseQueryError {
  const data: ApiClientError = { message, code, status, details };
  return { status: "CUSTOM_ERROR", error: message, data };
}

function normalizeFetchError(error: FetchBaseQueryError): ApiBaseQueryError {
  if (typeof error.status === "number") {
    const response = error.data;
    if (isRecord(response) && isRecord(response.error)) {
      const body = response as unknown as ApiErrorResponse;
      return makeClientError(
        body.error.message ?? `Request failed with status ${error.status}.`,
        body.error.code ?? "REQUEST_ERROR",
        error.status,
        body.error.details,
      );
    }

    return makeClientError(
      `Request failed with status ${error.status}.`,
      "REQUEST_ERROR",
      error.status,
    );
  }

  const message =
    error.status === "FETCH_ERROR"
      ? "Unable to connect to the backend. Check the API URL and server availability."
      : error.status === "PARSING_ERROR"
        ? "The backend returned an unreadable response."
        : "The request could not be completed.";

  return makeClientError(message, error.status, error.status);
}

const rawBaseQuery = fetchBaseQuery({
  credentials: "include",
  prepareHeaders(headers) {
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiBaseQueryError
> = async (args, api, extraOptions) => {
  let baseUrl: string;
  try {
    baseUrl = getApiBaseUrl();
  } catch (error) {
    return {
      error: makeClientError(
        error instanceof Error ? error.message : "Invalid API configuration.",
        "API_CONFIGURATION_ERROR",
      ),
    };
  }

  const requestArgs =
    typeof args === "string"
      ? `${baseUrl}${args}`
      : { ...args, url: `${baseUrl}${args.url}` };
  const result = await rawBaseQuery(requestArgs, api, extraOptions);

  if (result.error) {
    return { error: normalizeFetchError(result.error) };
  }

  const response = result.data;
  if (
    !isRecord(response) ||
    response.success !== true ||
    !Object.prototype.hasOwnProperty.call(response, "data")
  ) {
    return {
      error: makeClientError(
        "The backend returned an unexpected response.",
        "INVALID_API_RESPONSE",
      ),
    };
  }

  return { data: response };
};

function getApiData<T>(response: ApiSuccessResponse<T>): T {
  return response.data;
}

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type RefreshResponse = {
  user: AuthUser;
  accessToken: string;
};

type UserResponse = { user: AuthUser };

type PaginatedSubmissionResponse = ApiSuccessResponse<ProjectSubmission[]> & {
  meta: SubmissionPagination;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "Submissions", "SubmissionStats"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthUser, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: ApiSuccessResponse<UserResponse>) =>
        response.data.user,
    }),
    login: builder.mutation<AuthUser, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: ApiSuccessResponse<LoginResponse>) =>
        response.data.user,
      invalidatesTags: ["Auth"],
    }),
    currentUser: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiSuccessResponse<UserResponse>) =>
        response.data.user,
      providesTags: ["Auth"],
    }),
    refreshSession: builder.mutation<AuthUser, void>({
      query: () => "/auth/refresh",
      transformResponse: (
        response: ApiSuccessResponse<RefreshResponse>,
      ) => response.data.user,
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<null, void>({
      query: () => ({ url: "/auth/logout", method: "GET" }),
      transformResponse: getApiData<null>,
      invalidatesTags: ["Auth"],
    }),
    listSubmissions: builder.query<
      SubmissionList,
      { page?: number; pageSize?: number; status?: SubmissionStatus } | void
    >({
      query: (params) => ({
        url: "/submission/",
        params: params ?? undefined,
      }),
      transformResponse: (
        response: PaginatedSubmissionResponse,
      ): SubmissionList => ({
        submissions: response.data,
        pagination: response.meta,
      }),
      providesTags: ["Submissions"],
    }),
    submissionStats: builder.query<SubmissionStats, void>({
      query: () => "/submission/stats",
      transformResponse: getApiData<SubmissionStats>,
      providesTags: ["SubmissionStats"],
    }),
    createSubmission: builder.mutation<ProjectSubmission, SubmissionRequest>({
      query: (body) => ({ url: "/submission/", method: "POST", body }),
      transformResponse: getApiData<ProjectSubmission>,
      invalidatesTags: ["Submissions", "SubmissionStats"],
    }),
    reviewSubmission: builder.mutation<
      ProjectSubmission,
      {
        id: string;
        status: Exclude<SubmissionStatus, "PENDING">;
        feedback: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/submission/${id}/review`,
        method: "PATCH",
        body,
      }),
      transformResponse: getApiData<ProjectSubmission>,
      invalidatesTags: ["Submissions", "SubmissionStats"],
    }),
  }),
});

export function getApiErrorMessage(error: unknown): string {
  if (
    isRecord(error) &&
    isRecord(error.data) &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export const {
  useRegisterMutation,
  useLoginMutation,
  useCurrentUserQuery,
  useRefreshSessionMutation,
  useLogoutMutation,
  useListSubmissionsQuery,
  useSubmissionStatsQuery,
  useCreateSubmissionMutation,
  useReviewSubmissionMutation,
} = api;
