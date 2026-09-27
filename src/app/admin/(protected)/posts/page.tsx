import Link from "next/link";
import { PostsTable } from "@/components/admin/posts-table";

export default function AdminPostsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper-50">Posts</h1>
          <p className="mt-1 text-sm text-paper-200/50">
            Manage all blog posts — drafts and published.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-accent-400"
        >
          New Post
        </Link>
      </div>

      <PostsTable />
    </div>
  );
}
