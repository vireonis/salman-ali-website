# AI Publishing API

This document describes how an external AI client (e.g. Claude Code running
outside this website, or any authenticated script) can create, update,
publish, unpublish and retrieve blog posts on this site — without going
through the `/admin` dashboard UI.

## Authentication

Every write-capable endpoint requires a bearer token:

```
Authorization: Bearer <AI_PUBLISHING_API_KEY>
```

`AI_PUBLISHING_API_KEY` is a long random secret set as an environment
variable on the server (see `.env.example`). It is **never** exposed to the
browser — it is checked only inside server-side Route Handlers
(`src/lib/api-auth.ts`), using a timing-safe string comparison.

Generate a strong key:

```bash
openssl rand -hex 32
```

Store it in Vercel's Environment Variables (Production + Preview), and keep
a copy wherever your AI client reads its credentials from (e.g. a local
`.env` file for Claude Code — never commit it to git).

If the key is missing or wrong, every endpoint below returns `401 Unauthorized`.

## Base URL

```
https://your-domain.com/api
```

## Endpoints

### Create a post

```
POST /api/posts
Authorization: Bearer <key>
Content-Type: application/json

{
  "title": "How Company X Actually Scaled",
  "slug": "how-company-x-actually-scaled",   // optional — auto-generated from title if omitted
  "excerpt": "A short summary, max 500 chars.",
  "content": "<p>Full HTML body.</p>",
  "featured_image_url": "https://...",        // optional
  "category_id": "uuid",                      // optional — see GET /api/categories (not yet built; query Supabase directly for now)
  "tag_ids": ["uuid", "uuid"],                 // optional
  "status": "draft",                           // "draft" | "published" — defaults to "draft"
  "seo_title": "...",                          // optional, max 70 chars
  "seo_description": "...",                    // optional, max 160 chars
  "published_at": "2026-09-26T12:00:00Z"       // optional — only used if status is "published"
}
```

Returns `201` with `{ "post": {...} }`, or `409` if the slug already exists,
or `422` with `{ "error": "Validation failed.", "details": {...} }` on bad input.

Content is HTML-sanitized server-side before storage (script tags, event
handlers, and iframes are stripped) — so only send HTML you intend to render
as-is.

### Update a post

```
PATCH /api/posts/{id}
Authorization: Bearer <key>
Content-Type: application/json

{ "title": "Updated Title" }
```

Send only the fields you want to change. Returns `{ "post": {...} }`.

### Publish a post

```
POST /api/posts/{id}/publish
Authorization: Bearer <key>
```

Sets `status = "published"`. If `published_at` was never set, it is set to
the current time; otherwise the original publish date is preserved.

### Unpublish a post

```
POST /api/posts/{id}/unpublish
Authorization: Bearer <key>
```

Sets `status = "draft"`. `published_at` is preserved (not cleared) so
re-publishing keeps the original date unless you explicitly change it.

### Retrieve posts

```
GET /api/posts?status=draft&limit=20
Authorization: Bearer <key>
```

`status` is optional (`draft` | `published` — omit for all). Returns
`{ "posts": [...] }`, including drafts (unlike the public `/blog` page,
which only ever shows published posts via Row Level Security).

### Retrieve a single post

```
GET /api/posts/{id}
Authorization: Bearer <key>
```

### Delete a post

```
DELETE /api/posts/{id}
Authorization: Bearer <key>
```

Permanent. Returns `{ "success": true }`.

## Example: publish a post end-to-end (curl)

```bash
KEY="your-ai-publishing-api-key"
SITE="https://your-domain.com"

POST_ID=$(curl -s -X POST "$SITE/api/posts" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post From AI Client",
    "content": "<p>Hello from an automated client.</p>",
    "status": "draft"
  }' | jq -r '.post.id')

curl -s -X POST "$SITE/api/posts/$POST_ID/publish" \
  -H "Authorization: Bearer $KEY"
```

## Security notes

- The API key grants full write access to all posts. Treat it like a
  password — store it in a secrets manager or local `.env`, never in
  client-side code, chat logs, or version control.
- Rotate the key by changing `AI_PUBLISHING_API_KEY` in Vercel and
  redeploying; the old key stops working immediately.
- These endpoints do not currently rate-limit requests. If this API will be
  called by multiple untrusted clients, add rate limiting (e.g. via Vercel's
  Edge Middleware or a service like Upstash) before relying on it in
  production.
- Content is sanitized, but is **not** validated for factual accuracy —
  that responsibility sits with whatever client (human or AI) is publishing.
