import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Server-side Supabase client for Server Components, Route Handlers and
 * Server Actions. Reads/writes the user's auth session via cookies.
 * Still respects RLS — this is the *user's* identity, not an admin bypass.
 *
 * Uses the current @supabase/ssr cookie contract (getAll/setAll) — the
 * older get/set/remove shape is deprecated and can cause session loss.
 * cookies() from next/headers is async as of Next.js 15+.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component context where cookies are
            // read-only. Safe to ignore — middleware refreshes the session.
          }
        },
      },
    }
  );
}
