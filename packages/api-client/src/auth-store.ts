import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@workspace/api-client/types/user"

const SESSION_COOKIE_NAME = "bagastopup_admin_session"
const SESSION_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

// The JWT itself lives only in this store's persisted localStorage state
// (read by apiFetch for the Authorization header) — middleware.ts can't
// see localStorage, since it runs on the edge before any client JS. This
// cookie is a separate, non-authoritative "was logged in" flag that only
// exists so middleware has something to check for route protection. It's
// never sent as a bearer token and never verified — the real validity
// check happens client-side via useMe().
function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setSession: (token: string, user: User) => void
  clearSession: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => {
        setSessionCookie()
        set({ token, user, isAuthenticated: true })
      },
      clearSession: () => {
        clearSessionCookie()
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    { name: "bagastopup_admin_auth" }
  )
)

export { useAuthStore }
