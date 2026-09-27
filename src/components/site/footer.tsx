import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SOCIAL_LINKS } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-lg font-semibold text-paper-50">
            Salman<span className="text-accent-500">.</span>Ali
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-paper-200/60">
            Digital Creator — building in public, one project at a time. [Placeholder
            tagline — replace with real positioning.]
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-paper-200/40">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-paper-200/70 hover:text-accent-400">About</Link></li>
              <li><Link href="/projects" className="text-paper-200/70 hover:text-accent-400">Projects</Link></li>
              <li><Link href="/blog" className="text-paper-200/70 hover:text-accent-400">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-paper-200/40">
              Connect
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-paper-200/70 hover:text-accent-400">Contact</Link></li>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper-200/70 hover:text-accent-400"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="border-t border-white/5 py-6">
        <p className="text-xs text-paper-200/40">
          © {year} Salman Ali. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
