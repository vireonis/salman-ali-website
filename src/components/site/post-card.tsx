import Link from "next/link";
import type { PostWithRelations } from "@/types/database";

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:border-accent-500/30 hover:bg-white/[0.04] sm:p-8"
    >
      <div className="flex items-center gap-3 text-xs text-paper-200/50">
        {post.category && (
          <span className="rounded-full bg-accent-500/10 px-2.5 py-1 font-medium text-accent-400">
            {post.category.name}
          </span>
        )}
        <time dateTime={post.published_at ?? undefined}>
          {formatDate(post.published_at)}
        </time>
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-paper-50 group-hover:text-accent-400 sm:text-2xl">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper-200/60">
          {post.excerpt}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-400">
        Read more
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
