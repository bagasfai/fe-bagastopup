import * as React from "react"
import Link from "next/link"
import { CameraIcon, MusicIcon, ThumbsUpIcon, XIcon } from "lucide-react"

import { Separator } from "@workspace/ui/components/separator"

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Produk: [
    { label: "Top Up Game", href: "#produk" },
    { label: "Voucher", href: "#produk" },
    { label: "Pulsa, Data & Tagihan", href: "#produk" },
    { label: "Entertainment", href: "#produk" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Kontak", href: "#" },
  ],
  Bantuan: [
    { label: "FAQ", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
  ],
}

// lucide-react's brand/logo icons (Instagram, Facebook, X, TikTok...) aren't
// available in this version, so these are generic stand-ins — each is
// labelled for screen readers with the real platform name.
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: CameraIcon },
  { label: "Facebook", href: "#", icon: ThumbsUpIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "TikTok", href: "#", icon: MusicIcon },
]

// Server Component — the footer is entirely static content.
//
// Mast-headed shape: one banded footer anchored by the wordmark, not the
// 4-column Product/Company/Resources/Legal grid every SaaS template ships.
// All the same links stay — grouped inline by category instead of stacked
// in columns — because the categories are still worth keeping legible.
function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="font-mono text-lg font-semibold tracking-tight text-primary">
          BagasTopup
        </p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Top up game, voucher, dan tagihan tercepat, terpercaya untuk semua
          kalangan.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="text-muted-foreground/70">{title}</span>
              {links.map((link, index) => (
                <React.Fragment key={link.label}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap text-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                  {index < links.length - 1 && (
                    <span aria-hidden className="text-muted-foreground/40">
                      &middot;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BagasTopup. Semua hak cipta
            dilindungi.
          </p>
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:size-9"
              >
                <social.icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
