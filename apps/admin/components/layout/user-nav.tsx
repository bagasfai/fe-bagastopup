"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useLogout } from "@workspace/api-client/hooks/use-auth"
import { useAuthStore } from "@workspace/api-client/auth-store"

function initialsFor(email: string) {
  return email.slice(0, 2).toUpperCase()
}

function UserNav() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()

  function handleLogout() {
    // useLogout's onSettled already clears the store — this just handles
    // navigation once that's done.
    logout.mutate(undefined, {
      onSettled: () => {
        router.push("/login")
      },
    })
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-2 px-1.5">
          <Avatar size="sm">
            <AvatarFallback>{initialsFor(user.email)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium capitalize sm:inline">
            {user.role}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground capitalize">
            {user.role}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserNav }
