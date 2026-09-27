import { NextRequest, NextResponse } from "next/server";
import { authorizeWrite, ApiAuthError } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";
import { postUpdateSchema, sanitizeHtml } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/posts/[id] — retrieve a single post (any status). Auth required. */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    .select("*, category:categories(*), post_tags(tags(*))")
    .eq("id", id)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ post });
}

/**
 * PATCH /api/posts/[id]
 * Update a post. Admin session or AI API key required.
 * Accepts a partial postInputSchema body — only provided fields change.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await authorizeWrite(request);
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = postUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const input = parsed.data;
  const supabase = createServiceClient();

  const updatePayload: Record<string, unknown> = { ...input };
  delete updatePayload.tag_ids;

  if (input.content) {
    updatePayload.content = sanitizeHtml(input.content);
  }
  if (input.status === "published") {
    updatePayload.published_at = input.published_at ?? new Date().toISOString();
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  if (input.tag_ids) {
    await supabase.from("post_tags").delete().eq("post_id", id);
    if (input.tag_ids.length > 0) {
      await supabase
        .from("post_tags")
        .insert(input.tag_ids.map((tag_id) => ({ post_id: id, tag_id })));
    }
  }

  return NextResponse.json({ post });
}

/** DELETE /api/posts/[id] — permanently delete a post. Admin session or AI API key required. */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
