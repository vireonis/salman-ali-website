import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

/**
 * CSS-only fade-up reveal (no JS/IntersectionObserver needed — animates on
 * mount via Tailwind's `animate-fade-up`). `delay` accepts a Tailwind
 * arbitrary value like "150ms".
 */
export function Reveal({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("animate-fade-up opacity-0", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}
