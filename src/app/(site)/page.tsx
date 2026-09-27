import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  {
    title: "Business Case Studies",
    description:
      "Breaking down how companies actually win, fail and pivot — placeholder pillar copy.",
  },
  {
    title: "Digital Strategy",
    description:
      "Commentary on platforms, media and the business of attention — placeholder pillar copy.",
  },
  {
    title: "Building in Public",
    description:
      "Documenting the process of building a digital brand from zero — placeholder pillar copy.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(34,197,94,0.15),transparent)]"
        />
        <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
          <Reveal>
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent-400">
              Digital Creator
            </p>
          </Reveal>
          <Reveal delay="100ms">
            <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-paper-50 sm:text-6xl lg:text-7xl">
              Salman Ali
            </h1>
          </Reveal>
          <Reveal delay="200ms">
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-paper-200/70 sm:text-xl">
              Building a digital brand at the intersection of media, business
              and technology. [Placeholder hero copy — replace with real
              positioning statement.]
            </p>
          </Reveal>
          <Reveal delay="300ms">
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/projects">View Projects</Button>
              <Button href="/about" variant="secondary">
                About Me
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pillars */}
      <section className="border-t border-white/5 py-24">
        <Container>
          <Reveal>
            <h2 className="max-w-lg font-display text-3xl font-semibold text-paper-50 sm:text-4xl">
              What I focus on
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={`${i * 100}ms`}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-accent-500/30 hover:bg-white/[0.04]">
                  <div className="mb-4 h-8 w-8 rounded-lg bg-accent-500/15" />
                  <h3 className="mb-2 font-display text-lg font-semibold text-paper-50">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-paper-200/60">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24">
        <Container className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-10 sm:flex-row sm:items-center sm:p-14">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper-50 sm:text-3xl">
              Let&apos;s connect
            </h2>
            <p className="mt-2 max-w-md text-paper-200/60">
              Collaborations, ideas or just to talk — reach out.
            </p>
          </div>
          <Button href="/contact">Get in Touch</Button>
        </Container>
      </section>
    </>
  );
}
