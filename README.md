# Salman Ali — Personal Brand Website

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase, with a full
CMS admin dashboard and a secure AI Publishing API.

## ⚠️ Before you do anything else

This project was written file-by-file in an offline sandbox with no network
access, so **it has never been run through `npm install` or a build**.
Treat this as step zero, before anything else:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Fix whatever surfaces. This is expected work, not a sign anything is
fundamentally wrong — dependency APIs shift over time and the code was
checked against documentation, not a live compiler. Claude Code (or any
terminal environment with internet access) is well suited to do this pass
and iterate until `npm run build` succeeds. **Do not deploy to Vercel before
this succeeds locally.**

## Stack

- **Next.js 15.5** (App Router, TypeScript, Server Components — pinned to
  the 15.x LTS line; Next.js 16 is out but wasn't targeted here since it
  renames `middleware.ts` → `proxy.ts` and may carry other breaking changes
  not verified in this codebase. Upgrading to 16 later is a deliberate,
  separate step — see Next.js's own upgrade guide when you do it.)
- **Tailwind CSS** — matte-black/green/white design system
- **Supabase** — Postgres database, Auth, Row Level Security
- **Vercel** — hosting/deployment target

## Project structure

```
src/
  app/
    (site)/              # Public pages: Home, About, Projects, Blog, Contact
    admin/
      login/              # Public login page
      (protected)/        # Everything requiring an authenticated admin session
        posts/            # Posts list, new post, edit post
    api/
      auth/                # login/logout
      posts/               # AI Publishing API + admin CRUD (shared)
  components/
    site/                  # Public-facing components
    admin/                 # Dashboard components
    ui/                    # Shared primitives
  lib/
    supabase/              # Three clients: browser, server, service-role
    api-auth.ts            # Shared auth guard for all write endpoints
    validation.ts           # Zod schemas + HTML sanitization
    posts.ts                # Public data-fetch helpers
  middleware.ts             # Session refresh + /admin route protection
supabase/
  migrations/                # SQL migrations — schema + RLS policies
  seed.sql                   # Optional placeholder seed data
docs/
  AI_PUBLISHING_API.md        # Full API reference for AI/automation clients
```

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the migrations in order:
   - `supabase/migrations/0001_init_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - (optional) `supabase/seed.sql` for placeholder categories/tags/a sample post
3. In **Authentication → Providers**, ensure Email is enabled.
4. In **Authentication → Settings**, disable public sign-ups once you've
   created your admin account (see step 5) — this site does not have a
   public registration page, but Supabase's default signup endpoint is open
   unless you turn it off.
5. Create your admin user: **Authentication → Users → Add User** (or sign up
   once via a temporary script). The `handle_new_user` trigger automatically
   creates a matching `profiles` row with `role = 'admin'`.
6. Grab your credentials from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secret** — server-only)

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
AI_PUBLISHING_API_KEY=          # generate with: openssl rand -hex 32
```

**Never** commit `.env.local`, and never prefix the service-role key or the
AI publishing key with `NEXT_PUBLIC_` — that would ship them to the browser.

## 3. Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, `/admin/login` for the
dashboard.

## 4. Deploying to Vercel

1. This repo is already on GitHub at `vireonis/salman-ali-website`.
2. Import it in Vercel (vercel.com → Add New Project → import from GitHub).
3. Add all variables from `.env.local` under **Settings → Environment
   Variables** (Production + Preview).
4. Deploy.
5. Update `NEXT_PUBLIC_SITE_URL` to your real production URL and redeploy
   (it's used for canonical links, sitemap, and Open Graph tags).

## 5. Replacing placeholder content

Everything marked "placeholder" is intentional — no fake bios, emails, or
social handles were invented. Before launch, update:

- `src/lib/constants.ts` — social links, contact email, tagline
- `src/app/(site)/about/page.tsx` — real bio + timeline
- `src/app/(site)/projects/page.tsx` — real projects
- `src/components/site/contact-form.tsx` — wire the `TODO` to a real email
  service (Resend, Postmark, or a Supabase Edge Function)

## 6. AI Publishing API

See [`docs/AI_PUBLISHING_API.md`](./docs/AI_PUBLISHING_API.md) for full
documentation on how Claude Code (or any authenticated client) can create,
edit, publish and unpublish posts programmatically.

## 7. Extending with Claude Code

The project is deliberately organized so each concern is isolated:

- New pages → `src/app/(site)/`
- New API endpoints → `src/app/api/`
- Database changes → new file in `supabase/migrations/`, then update
  `src/types/database.ts` to match
- Design tokens (colors, fonts) → `tailwind.config.ts`

Hand this whole repo to Claude Code with a specific instruction (e.g. "add
an RSS feed route" or "add a newsletter signup form") and it can extend it
without needing to understand the rest of the system from scratch — each
piece is self-contained and documented inline.
