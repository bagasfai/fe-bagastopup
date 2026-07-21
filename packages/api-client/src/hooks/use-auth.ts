import { useMutation, useQuery } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import { useAuthStore } from "@workspace/api-client/auth-store"
import type { LoginInput, LoginResponse } from "@workspace/api-client/types/auth"
import type { User } from "@workspace/api-client/types/user"

const meQueryKey = ["auth", "me"] as const

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<LoginResponse>("/auth/login", { method: "POST", body: input }),
    onSuccess: (data) => {
      setSession(data.token, data.user)
    },
  })
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: () => apiFetch<void>("/auth/logout", { method: "POST" }),
    // Always drop the local session, even if the request to revoke the
    // token server-side fails — a stuck "can't log out" state is worse
    // than a token that stays technically valid until it expires.
    onSettled: () => {
      clearSession()
    },
  })
}

// Validates the persisted token is still accepted by the backend (not
// expired, not revoked, account still active) and refreshes `user` with
// current data — e.g. if the user's role changed since the token was
// issued. Disabled until a token exists, so it never fires on /login.
export function useMe() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => apiFetch<User>("/auth/me"),
    enabled: !!token,
    retry: false,
  })
}
