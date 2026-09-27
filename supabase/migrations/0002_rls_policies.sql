-- ============================================================================
-- Migration 0002: Row Level Security
-- Public (anon) can only READ published posts + taxonomy.
-- Writes require an authenticated user with a profiles row (admin/editor).
-- The service-role key (used only server-side) bypasses RLS entirely —
-- that is what the AI Publishing API route uses.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;

-- ── helper: is the current auth.uid() an admin/editor? ──────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ── profiles ────────────────────────────────────────────────────────────────
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id);

-- ── categories: public read, admin write ─────────────────────────────────
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── tags: public read, admin write ───────────────────────────────────────
drop policy if exists "tags_public_read" on public.tags;
create policy "tags_public_read"
  on public.tags for select
  using (true);

drop policy if exists "tags_admin_write" on public.tags;
create policy "tags_admin_write"
  on public.tags for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── posts: public can read ONLY published+past-dated posts ─────────────────
drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published"
  on public.posts for select
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

drop policy if exists "posts_admin_read_all" on public.posts;
create policy "posts_admin_read_all"
  on public.posts for select
  using (public.is_admin());

drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write"
  on public.posts for insert
  with check (public.is_admin());

drop policy if exists "posts_admin_update" on public.posts;
create policy "posts_admin_update"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "posts_admin_delete" on public.posts;
create policy "posts_admin_delete"
  on public.posts for delete
  using (public.is_admin());

-- ── post_tags: mirrors posts visibility ─────────────────────────────────
drop policy if exists "post_tags_public_read" on public.post_tags;
create policy "post_tags_public_read"
  on public.post_tags for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and p.status = 'published'
        and p.published_at <= now()
    )
    or public.is_admin()
  );

drop policy if exists "post_tags_admin_write" on public.post_tags;
create policy "post_tags_admin_write"
  on public.post_tags for all
  using (public.is_admin())
  with check (public.is_admin());
