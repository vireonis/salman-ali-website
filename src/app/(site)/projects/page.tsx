import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects and content by Salman Ali. [Placeholder description.]",
};

const PROJECTS = [
  {
    title: "Placeholder Project One",
    category: "Business Case Study",
    description:
      "One-line placeholder description of this project. Replace with real project details.",
  },
  {
    title: "Placeholder Project Two",
    category: "Digital Series",
    description:
      "One-line placeholder description of this project. Replace with real project details.",
  },
  {
    title: "Placeholder Project Three",
    category: "Content Series",
    description:
      "One-line placeholder description of this project. Replace with real project details.",
  },
  {
    title: "Placeholder Project Four",
    category: "Collaboration",
    description:
      "One-line placeholder description of this project. Replace with real project details.",
  },
];

export default function ProjectsPage() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          Projects
        </p>
      </Reveal>
      <Reveal delay="100ms">
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">
          Selected work &amp; content
        </h1>
      </Reveal>
      <Reveal delay="150ms">
        <p className="mt-4 max-w-lg text-paper-200/60">
          A placeholder grid of projects — replace each card with real work,
          case studies or content series.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={`${i * 80}ms`}>
            <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-200 hover:border-accent-500/30 hover:bg-white/[0.04]">
              <div className="mb-6 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.06] to-transparent">
                <span className="text-xs text-paper-200/30">Placeholder Image</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                {project.category}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-paper-50 group-hover:text-accent-400">
                {project.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-paper-200/60">
                {project.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
