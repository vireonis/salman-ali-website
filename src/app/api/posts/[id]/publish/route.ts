import { NextRequest, NextResponse } from "next/server";
import { authorizeWrite, ApiAuthError } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/posts/[id]/publish
 * Sets status=published and published_at=now() (if not already set).
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

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: existing.published_at ?? new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post });
}
