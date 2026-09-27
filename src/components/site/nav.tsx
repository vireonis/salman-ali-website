"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "@/lib/clsx";
import { Container } from "@/components/ui/container";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-paper-50"
          onClick={() => setOpen(false)}
        >
          Salman<span className="text-accent-500">.</span>Ali
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-accent-400"
                  : "text-paper-200/70 hover:text-paper-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span
              className={clsx(
                "h-px w-4 bg-paper-100 transition-transform",
                open && "translate-y-1.5 rotate-45"
              )}
            />
            <span className={clsx("h-px w-4 bg-paper-100 transition-opacity", open && "opacity-0")} />
            <span
              className={clsx(
                "h-px w-4 bg-paper-100 transition-transform",
                open && "-translate-y-1.5 -rotate-45"
              )}
            />
          </div>
        </button>
      </Container>

      {open && (
        <nav className="border-t border-white/5 bg-ink-950 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/5 text-accent-400"
                    : "text-paper-200/70 hover:bg-white/5 hover:text-paper-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
