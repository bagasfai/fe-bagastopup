import { SearchXIcon } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"

import { Footer } from "@/components/footer/footer"
import { Navbar } from "@/components/navbar/navbar"

// Navbar/Footer aren't in the root layout (every page composes its own,
// see app/page.tsx), so this catch-all 404 renders them itself too —
// mirrors app/product/[id]/not-found.tsx's shell-less-page fix, generalised
// to any unmatched route site-wide.
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="bg-muted text-muted-foreground mb-6 flex size-16 items-center justify-center rounded-full">
          <SearchXIcon className="size-8" />
        </div>
        <Alert className="max-w-md text-left">
          <AlertTitle>Halaman tidak ditemukan</AlertTitle>
          <AlertDescription>
            Halaman yang kamu cari mungkin sudah dipindahkan atau URL-nya salah ketik. Coba cek kembali daftar produk
            kami.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </main>
      <Footer />
    </div>
  )
}
