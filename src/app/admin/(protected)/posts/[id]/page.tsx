import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/admin/post-form";
import type { PostWithRelations } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, category:categories(*), post_tags(tags(*))")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!post) notFound();

  const normalizedPost: PostWithRelations = {
    ...post,
    tags: (post.post_tags ?? []).map((pt: any) => pt.tags).filter(Boolean),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-paper-50">Edit Post</h1>
        <p className="mt-1 text-sm text-paper-200/50">{post.title}</p>
      </div>

      <PostForm
        mode="edit"
        postId={post.id}
        initialData={normalizedPost}
        categories={categories ?? []}
      />
    </div>
  );
}
