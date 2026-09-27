"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Placeholder contact form UI. It does not send email anywhere yet — wire
 * `handleSubmit` up to a real email service (Resend, Supabase Edge Function
 * + SMTP, etc.) before launch. Left as a clear TODO rather than faking a
 * working integration.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    // TODO: wire this up to a real backend (e.g. an API route that sends
    // email via Resend/Postmark, or writes to a `messages` table in Supabase).
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent-500/30 bg-accent-500/5 p-8 text-center">
        <p className="font-display text-lg font-semibold text-paper-50">
          Message received
        </p>
        <p className="mt-2 text-sm text-paper-200/60">
          Thanks for reaching out — this is placeholder confirmation copy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-paper-200/80">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-200/30 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-paper-200/80">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-200/30 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-paper-200/80">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-200/30 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-paper-200/80">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-200/30 focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
          placeholder="Your message..."
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
