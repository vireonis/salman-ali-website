"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import type { PostWithRelations } from "@/types/database";

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostsTable() {
  const [posts, setPosts] = useState<PostWithRelations[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/posts?limit=100");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load posts.");
      return;
    }
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleTogglePublish(post: PostWithRelations) {
    setBusyId(post.id);
    const endpoint =
      post.status === "published"
        ? `/api/posts/${post.id}/unpublish`
        : `/api/posts/${post.id}/publish`;
    await fetch(endpoint, { method: "POST" });
    await fetchPosts();
    setBusyId(null);
  }

  async function handleDelete(post: PostWithRelations) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusyId(post.id);
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    await fetchPosts();
    setBusyId(null);
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!posts) {
    return <p className="text-sm text-paper-200/40">Loading posts…</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-paper-200/50">No posts yet.</p>
        <Link
          href="/admin/posts/new"
          className="mt-3 inline-block text-sm font-medium text-accent-400 hover:text-accent-500"
        >
          Create your first post →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-paper-200/40">
          <tr>
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Updated</th>
            <th className="px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {posts.map((post) => (
            <tr key={post.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-4">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="font-medium text-paper-50 hover:text-accent-400"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-paper-200/40">/{post.slug}</p>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={post.status} />
              </td>
              <td className="hidden px-5 py-4 text-paper-200/60 sm:table-cell">
                {post.category?.name ?? "—"}
              </td>
              <td className="hidden px-5 py-4 text-paper-200/60 md:table-cell">
                {formatDate(post.updated_at)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={busyId === post.id}
                    className="text-xs font-medium text-accent-400 hover:text-accent-500 disabled:opacity-40"
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-xs font-medium text-paper-200/60 hover:text-paper-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={busyId === post.id}
                    className="text-xs font-medium text-red-400/80 hover:text-red-400 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
