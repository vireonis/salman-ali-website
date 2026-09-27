import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every request. Two jobs:
 *  1. Refresh the Supabase auth session cookie (required by @supabase/ssr).
 *  2. Gate /admin/** — redirect unauthenticated users to /admin/login.
 *     (This is a UX guard, not the security boundary. The real boundary is
 *     Postgres RLS + per-route auth checks in the API handlers.)
 *
 * Uses the current @supabase/ssr cookie contract (getAll/setAll).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  if (isAdminPath && !isLoginPath && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPath && user) {
    return NextResponse.redirect(new URL("/admin/posts", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
