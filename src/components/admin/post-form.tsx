"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Category, PostWithRelations } from "@/types/database";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: PostWithRelations;
  categories: Category[];
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category_id: string;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
}

function toFormState(post?: PostWithRelations): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    featured_image_url: post?.featured_image_url ?? "",
    category_id: post?.category_id ?? "",
    seo_title: post?.seo_title ?? "",
    seo_description: post?.seo_description ?? "",
    status: post?.status ?? "draft",
  };
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-200/30 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50";
const labelClass = "mb-1.5 block text-sm font-medium text-paper-200/80";

export function PostForm({ mode, postId, initialData, categories }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt || null,
      content: form.content,
      featured_image_url: form.featured_image_url || null,
      category_id: form.category_id || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      status: publish ? "published" : "draft",
    };

    const url = mode === "create" ? "/api/posts" : `/api/posts/${postId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to save post.");
      setSaving(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    handleSave(form.status === "published");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
            placeholder="Post title"
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug <span className="text-paper-200/40">(auto-generated if left blank)</span>
          </label>
          <input
            id="slug"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className={inputClass}
            placeholder="post-title-slug"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
          <textarea
            id="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className={inputClass}
            placeholder="Short summary shown in the blog listing"
          />
        </div>

        <div>
          <label htmlFor="content" className={labelClass}>
            Content <span className="text-paper-200/40">(HTML — sanitized on save)</span>
          </label>
          <textarea
            id="content"
            required
            rows={14}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            placeholder="<p>Post content in HTML...</p>"
          />
        </div>

        <div>
          <label htmlFor="featured_image_url" className={labelClass}>Featured Image URL</label>
          <input
            id="featured_image_url"
            value={form.featured_image_url}
            onChange={(e) => update("featured_image_url", e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="category_id" className={labelClass}>Category</label>
          <select
            id="category_id"
            value={form.category_id}
            onChange={(e) => update("category_id", e.target.value)}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-5 border-t border-white/10 pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-paper-200/40">SEO</h2>
        <div>
          <label htmlFor="seo_title" className={labelClass}>SEO Title</label>
          <input
            id="seo_title"
            value={form.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
            className={inputClass}
            maxLength={70}
          />
        </div>
        <div>
          <label htmlFor="seo_description" className={labelClass}>SEO Description</label>
          <textarea
            id="seo_description"
            rows={2}
            value={form.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
            className={inputClass}
            maxLength={160}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(false)}
          className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-paper-50 hover:bg-white/5 disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-medium text-ink-950 hover:bg-accent-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
