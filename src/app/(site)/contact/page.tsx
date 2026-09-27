import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Salman Ali.",
};

export default function ContactPage() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          Contact
        </p>
      </Reveal>
      <Reveal delay="100ms">
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">
          Let&apos;s talk
        </h1>
      </Reveal>
      <Reveal delay="150ms">
        <p className="mt-4 max-w-lg text-paper-200/60">
          Have a project, collaboration or question in mind? Fill out the
          form and I&apos;ll get back to you.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal delay="200ms">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-paper-200/40">
                Social
              </h2>
              <ul className="mt-3 space-y-2">
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
            <p className="text-xs text-paper-200/40">
              Social links are placeholders — update them in{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5">
                src/lib/constants.ts
              </code>
              .
            </p>
          </div>
        </Reveal>

        <Reveal delay="250ms">
          <ContactForm />
        </Reveal>
      </div>
    </Container>
  );
}
