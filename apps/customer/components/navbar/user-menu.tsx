"use client"

import * as React from "react"
import Link from "next/link"
import { LogOutIcon, UserIcon, WalletIcon } from "lucide-react"

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

// Hardcoded stand-in for a real session until auth is wired up. Flip to
// `true` locally to preview the logged-in dropdown state.
const DUMMY_IS_LOGGED_IN = false
const DUMMY_USER = { name: "Bagas", initials: "BG" }

function UserMenu() {
  if (!DUMMY_IS_LOGGED_IN) {
    return (
      <Button asChild size="lg" className="h-11 sm:h-9">
        <Link href="/login">Login</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-9"
          aria-label={`Menu akun ${DUMMY_USER.name}`}
        >
          <Avatar>
            <AvatarFallback>{DUMMY_USER.initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{DUMMY_USER.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon /> Profil Saya
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WalletIcon /> Riwayat Transaksi
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserMenu }
