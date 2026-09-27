import { NextRequest, NextResponse } from "next/server";
import { authorizeWrite, ApiAuthError } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";
import { postInputSchema, slugFromTitle, sanitizeHtml } from "@/lib/validation";

/**
 * GET /api/posts
 * Retrieve posts. Admin session or AI API key required (this returns drafts
 * too, unlike the public blog page — so it must stay behind auth).
 * Query params: ?status=draft|published  ?limit=20
 */
export async function GET(request: NextRequest) {
  try {
    await authorizeWrite(request);
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

  const supabase = createServiceClient();
  let query = supabase
    .from("posts")
    .select("*, category:categories(*), post_tags(tags(*))")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data });
}

/**
 * POST /api/posts
 * Create a new post. Admin session or AI API key required.
 * Body: see postInputSchema in src/lib/validation.ts
 *
 * If `status: "published"` is sent without `published_at`, published_at is
 * set to now(). Content is HTML-sanitized server-side before storage.
 */
export async function POST(request: NextRequest) {
  let actor;
  try {
    actor = await authorizeWrite(request);
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const input = parsed.data;
  const slug = input.slug || slugFromTitle(input.title);
  const cleanContent = sanitizeHtml(input.content);

  const supabase = createServiceClient();

  const { data: existingSlug } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return NextResponse.json(
      { error: `A post with slug "${slug}" already exists.` },
      { status: 409 }
    );
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      content: cleanContent,
      featured_image_url: input.featured_image_url ?? null,
      category_id: input.category_id ?? null,
      author_id: actor.kind === "admin_session" ? actor.userId : null,
      status: input.status,
      seo_title: input.seo_title ?? input.title,
      seo_description: input.seo_description ?? input.excerpt ?? null,
      published_at:
        input.status === "published" ? input.published_at ?? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (input.tag_ids.length > 0) {
    await supabase
      .from("post_tags")
      .insert(input.tag_ids.map((tag_id) => ({ post_id: post.id, tag_id })));
  }

  return NextResponse.json({ post }, { status: 201 });
}
