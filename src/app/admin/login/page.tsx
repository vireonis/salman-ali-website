"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-paper-50">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-paper-200/50">
            Salman Ali — Content Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-paper-200/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-paper-200/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent-500 px-6 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
