import "server-only";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type ApiActor =
  | { kind: "admin_session"; userId: string }
  | { kind: "ai_publishing_key" };

export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Every write-capable API route (/api/posts, /api/posts/[id], publish,
 * unpublish) calls this first. It authorizes the caller via exactly one of:
 *
 *   1. A logged-in admin/editor's Supabase session cookie (used by the
 *      /admin dashboard UI itself), OR
 *   2. A valid `Authorization: Bearer <AI_PUBLISHING_API_KEY>` header
 *      (used by external AI clients — e.g. Claude Code — per
 *      docs/AI_PUBLISHING_API.md).
 *
 * Timing-safe comparison is used for the API key to avoid leaking its value
 * via response-time side channels. Throws ApiAuthError on failure; callers
 * should catch it and return the given status.
 */
export async function authorizeWrite(request: NextRequest): Promise<ApiActor> {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const providedKey = authHeader.slice("Bearer ".length).trim();
    const expectedKey = process.env.AI_PUBLISHING_API_KEY;

    if (!expectedKey) {
      throw new ApiAuthError("AI publishing API is not configured on this server.", 500);
    }

    if (!timingSafeEqual(providedKey, expectedKey)) {
      throw new ApiAuthError("Invalid API key.", 401);
    }

    return { kind: "ai_publishing_key" };
  }

  // Fall back to admin session cookie (dashboard UI calling its own API).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ApiAuthError("Authentication required.", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    throw new ApiAuthError("Insufficient permissions.", 403);
  }

  return { kind: "admin_session", userId: user.id };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
