import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Salman Ali — digital creator, background and focus areas. [Placeholder description.]",
};

const TIMELINE = [
  {
    year: "Placeholder",
    title: "Started creating content",
    description: "Replace with a real milestone from your journey.",
  },
  {
    year: "Placeholder",
    title: "Launched first major project",
    description: "Replace with a real milestone from your journey.",
  },
  {
    year: "Placeholder",
    title: "Building the digital brand",
    description: "Replace with a real milestone from your journey.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          About
        </p>
      </Reveal>
      <Reveal delay="100ms">
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">
          The person behind the work
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal delay="150ms">
          <div className="aspect-square w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent">
            <div className="flex h-full items-center justify-center text-sm text-paper-200/30">
              Placeholder Photo
            </div>
          </div>
        </Reveal>

        <Reveal delay="200ms">
          <div className="prose-content max-w-none">
            <p>
              I&apos;m Salman Ali, a digital creator focused on business case
              studies, media strategy and building projects in public. This is
              placeholder biography text — replace with a real, specific
              narrative about your background, expertise and what makes your
              perspective different.
            </p>
            <p>
              [Placeholder paragraph — describe your journey, what led you to
              content creation, and what you want your audience to take away
              from your work.]
            </p>
            <h2>What I do</h2>
            <p>
              [Placeholder — describe your content pillars, the platforms you
              create for, and the audience you serve.]
            </p>
          </div>

          <div className="mt-10">
            <Button href="/contact" variant="secondary">
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Timeline */}
      <div className="mt-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-paper-50 sm:text-3xl">
            Journey so far
          </h2>
        </Reveal>
        <div className="mt-10 space-y-8 border-l border-white/10 pl-8">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.title} delay={`${i * 100}ms`}>
              <div className="relative">
                <span className="absolute -left-[2.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                  {item.year}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-paper-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-paper-200/60">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  );
}
