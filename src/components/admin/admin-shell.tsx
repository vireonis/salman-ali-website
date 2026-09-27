"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

const NAV_ITEMS = [
  { href: "/admin/posts", label: "Posts", exact: false },
  { href: "/admin/posts/new", label: "New Post", exact: true },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="hidden w-60 flex-col border-r border-white/5 p-5 sm:flex">
        <Link href="/admin/posts" className="mb-8 font-display text-lg font-semibold text-paper-50">
          Admin<span className="text-accent-500">.</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-500/10 text-accent-400"
                    : "text-paper-200/60 hover:bg-white/5 hover:text-paper-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 border-t border-white/5 pt-4">
          {userEmail && <p className="truncate text-xs text-paper-200/40">{userEmail}</p>}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-paper-200/70 hover:bg-white/5 hover:text-paper-50"
          >
            Log Out
          </button>
          <Link
            href="/"
            className="block text-xs text-paper-200/40 hover:text-paper-200/70"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
