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

type ApiResponse<T> = {
  success: true;
  data: T;
};

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

export async function registerUser(input: RegisterRequest): Promise<AuthUser> {
  const data = await postAuth<{ user: AuthUser }>("/auth/register", input);
  return data.user;
}

export async function loginUser(input: LoginRequest): Promise<AuthUser> {
  const data = await postAuth<{ user: AuthUser }>(
    "/auth/login",
    input,
  );
  return data.user;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/auth/me`,
    {
      credentials: "include",
      headers: { Accept: "application/json" },
    },
  );

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

  return body.data.user;
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
}
