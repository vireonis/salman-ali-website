import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-[0_0_0_1px_rgba(34,197,94,0.4)]",
  secondary:
    "bg-white/5 text-paper-50 hover:bg-white/10 border border-white/10",
  ghost: "text-paper-200/80 hover:text-paper-50",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  type,
}: {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200",
    VARIANT_CLASSES[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
