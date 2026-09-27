import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** POST /api/auth/login — email/password sign-in for the admin dashboard. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password format." }, { status: 422 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    // Deliberately generic message — do not reveal whether the email exists.
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "This account has no admin access." }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
