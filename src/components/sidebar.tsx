"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/cn"

export function Navigation() {
  const pathname = usePathname()

  const isAdmin = true // This should be replaced with actual authentication logic

  return (
    <nav className="bg-secondary text-secondary-foreground w-full md:w-64 md:min-h-screen">
      <div className="p-4">
        <Link href="/" className="text-2xl font-bold block py-4">
          FMS
        </Link>
        <div className="space-y-2">
          <NavLink href="/" current={pathname === "/"}>
            Home
          </NavLink>
          <NavLink href="/finances" current={pathname === "/finances"}>
            Finances
          </NavLink>
          {isAdmin && (
            <>
              <NavLink href="/users" current={pathname === "/users"}>
                Users
              </NavLink>
              <NavLink href="/reports" current={pathname === "/reports"}>
                Reports
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-2 rounded-md text-sm font-medium",
        current
          ? "bg-primary text-primary-foreground"
          : "text-secondary-foreground hover:bg-primary/10 hover:text-primary-foreground",
      )}
    >
      {children}
    </Link>
  )
}

