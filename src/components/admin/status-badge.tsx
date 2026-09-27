import clsx from "@/lib/clsx";
import type { PostStatus } from "@/types/database";

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        status === "published"
          ? "bg-accent-500/10 text-accent-400"
          : "bg-white/5 text-paper-200/50"
      )}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
