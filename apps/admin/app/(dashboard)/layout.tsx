import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { RequireAuth } from "@/components/require-auth"

// Route group: the `(dashboard)` folder name is stripped from the URL, so
// this layout applies to `/`, `/products`, `/sellers`, `/transactions`
// without adding a `/dashboard` prefix — it just groups every authenticated
// page under one shared shell, separate from the sidebar-less `(auth)` group.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <div className="min-h-svh">
        <Sidebar />
        <div className="flex min-h-svh flex-col md:pl-64">
          <Topbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  )
}
