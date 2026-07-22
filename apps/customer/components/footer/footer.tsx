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
function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-bold text-primary">BagasTopup</p>
            <p className="mt-2 max-w-48 text-sm text-muted-foreground">
              Top up game, voucher, dan tagihan tercepat, terpercaya untuk
              semua kalangan.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold">{title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
