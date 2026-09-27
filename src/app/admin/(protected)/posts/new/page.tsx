import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-paper-50">New Post</h1>
        <p className="mt-1 text-sm text-paper-200/50">Create a new blog post.</p>
      </div>

      <PostForm mode="create" categories={categories ?? []} />
    </div>
  );
}
