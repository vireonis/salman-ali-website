-- ============================================================================
-- Salman Ali — Personal Brand Website
-- Migration 0001: Core schema (profiles, categories, tags, posts)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per admin user, linked 1:1 to an auth.users row created via
-- Supabase Auth. `role` gates who may touch the CMS.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  avatar_url  text,
  role        text not null default 'admin' check (role in ('admin', 'editor')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Admin/editor accounts. One row per auth.users id.';

-- ── categories ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- ── tags ────────────────────────────────────────────────────────────────────
create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ── posts ───────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  excerpt           text,
  content           text not null default '',
  featured_image_url text,
  category_id       uuid references public.categories(id) on delete set null,
  author_id         uuid references public.profiles(id) on delete set null,
  status            text not null default 'draft' check (status in ('draft', 'published')),
  seo_title         text,
  seo_description   text,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

comment on table public.posts is 'Blog posts. status=published + published_at<=now() = publicly visible.';

-- ── post_tags (many-to-many) ─────────────────────────────────────────────────
create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ── indexes ───────────────────────────────────────────────────────────────
create index if not exists idx_posts_status on public.posts (status);
create index if not exists idx_posts_published_at on public.posts (published_at desc);
create index if not exists idx_posts_category on public.posts (category_id);
create index if not exists idx_posts_slug on public.posts (slug);
create index if not exists idx_post_tags_tag on public.post_tags (tag_id);

-- ── updated_at trigger ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── auto-create profile on new auth user ────────────────────────────────────
-- NOTE: by default new signups become 'admin'. In production, disable public
-- signup in Supabase Auth settings and create admin users manually/invite-only.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'admin');
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
