import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("container-content", className)}>{children}</div>;
}
