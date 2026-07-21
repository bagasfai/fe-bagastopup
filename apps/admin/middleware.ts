import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "bagastopup_admin_session"
const LOGIN_PATH = "/login"

// Runs on the edge before any client JS, so it can only see cookies, not
// the localStorage-backed auth store (see auth-store.ts). This cookie is
// just a "was logged in" flag — it doesn't prove the JWT is still valid,
// only that a session existed. The real check (is the token still
// accepted by the backend) happens client-side in RequireAuth via
// useMe(); this middleware's job is only to stop an obviously logged-out
// visitor from ever seeing the dashboard shell flash before that runs.
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)
  const { pathname } = request.nextUrl

  if (pathname === LOGIN_PATH) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
