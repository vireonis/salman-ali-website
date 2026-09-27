import { z } from "zod";
import slugify from "slugify";
import DOMPurify from "isomorphic-dompurify";

export const postStatusSchema = z.enum(["draft", "published"]);

/**
 * Shared shape for creating/updating a post via the dashboard UI or the
 * AI Publishing API. `content` is HTML — sanitized before it ever reaches
 * the database (see sanitizeHtml below), so stored content is safe to
 * render directly on the public blog.
 */
export const postInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated")
    .optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  featured_image_url: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional().default([]),
  status: postStatusSchema.optional().default("draft"),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
});

export type PostInput = z.infer<typeof postInputSchema>;

export const postUpdateSchema = postInputSchema.partial();

/** Generates a URL-safe slug from a title if one wasn't explicitly provided. */
export function slugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

/**
 * Sanitizes post HTML content before it is stored. Strips scripts, event
 * handlers, iframes (except none — no iframes at all) and anything not on
 * the allow-list. This is the one place raw admin/AI-submitted HTML is
 * trusted from, so it is deliberately conservative.
 */
export function sanitizeHtml(rawHtml: string): string {
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "h2", "h3", "h4", "blockquote", "code", "pre", "img", "figure",
      "figcaption", "hr", "span",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
  });
}
