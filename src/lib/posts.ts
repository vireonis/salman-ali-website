import { createClient } from "@/lib/supabase/server";
import type { PostWithRelations } from "@/types/database";

const POST_SELECT = `
  *,
  category:categories(*),
  post_tags(tags(*))
`;

/** Maps the nested post_tags(tags(*)) join shape into a flat `tags` array. */
function normalizePost(row: any): PostWithRelations {
  return {
    ...row,
    tags: (row.post_tags ?? []).map((pt: any) => pt.tags).filter(Boolean),
  };
}

/** All published posts, newest first. RLS ensures only published rows return. */
export async function getPublishedPosts(): Promise<PostWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts error:", error.message);
    return [];
  }

  return (data ?? []).map(normalizePost);
}

/** A single published post by slug, or null if not found/not published. */
export async function getPublishedPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return normalizePost(data);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
}
