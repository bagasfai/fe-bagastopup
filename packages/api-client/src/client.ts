import { toast } from "sonner"

import { useAuthStore } from "@workspace/api-client/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
const API_PREFIX = "/api/v1"

// Paths that legitimately return 401 without meaning "the session
// expired" — a failed login is just wrong credentials, not a token to
// clear or a reason to bounce the user off a page they're not even
// authenticated on yet.
const SESSION_EXEMPT_PATHS = ["/auth/login"]

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

interface ApiErrorBody {
  error?: string
}

export async function apiFetch<T>(
  path: string,
  { body, headers, ...rest }: ApiFetchOptions = {}
): Promise<T> {
  const token = useAuthStore.getState().token

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await response
      .json()
      .then((data: ApiErrorBody) => data.error)
      .catch(() => undefined)

    // A 401 on an already-authenticated request means the token expired
    // or was revoked server-side — clear the stale session and send the
    // user back to /login instead of leaving them stuck on a page that
    // will just keep failing every request.
    if (
      response.status === 401 &&
      !SESSION_EXEMPT_PATHS.includes(path) &&
      useAuthStore.getState().isAuthenticated
    ) {
      useAuthStore.getState().clearSession()
      toast.error("Session expired", {
        description: "Please sign in again to continue.",
      })
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    throw new ApiError(
      response.status,
      message ?? `Request failed with status ${response.status}`
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
