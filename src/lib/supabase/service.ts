import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * SERVICE-ROLE Supabase client.
 *
 * ⚠️ This client BYPASSES Row Level Security entirely. It must:
 *   - never be imported into any file that can end up in a client bundle
 *   - never be imported into a Server Component that renders per-request
 *     user data without its own authorization check
 *   - only be used inside Route Handlers that have ALREADY verified the
 *     caller (either a logged-in admin session, or a valid
 *     AI_PUBLISHING_API_KEY bearer token — see src/lib/auth.ts)
 *
 * The `server-only` import above makes Next.js throw a build error if this
 * file is ever pulled into client-side code.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
