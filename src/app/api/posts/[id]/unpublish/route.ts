import { NextRequest, NextResponse } from "next/server";
import { authorizeWrite, ApiAuthError } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/posts/[id]/unpublish
 * Sets status=draft. published_at is intentionally preserved (not cleared)
 * so re-publishing keeps the original publish date unless explicitly changed.
 * Admin session or AI API key required.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authorizeWrite(request);
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { id } = await params;
  const supabase = createServiceClient();
  const { data: post, error } = await supabase
    .from("posts")
    .update({ status: "draft" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ post });
}
