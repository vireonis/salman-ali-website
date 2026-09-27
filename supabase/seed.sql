-- ============================================================================
-- Optional seed data — placeholder categories/tags and one sample post.
-- Run manually after migrations: supabase db execute -f supabase/seed.sql
-- Safe to skip entirely; the site works with zero posts.
-- ============================================================================

insert into public.categories (name, slug, description) values
  ('Business Case Studies', 'business-case-studies', 'Deep dives into companies and business strategy.'),
  ('Digital Trends', 'digital-trends', 'Commentary on platforms, media and technology.'),
  ('Personal Notes', 'personal-notes', 'Behind-the-scenes and personal reflections.')
on conflict (slug) do nothing;

insert into public.tags (name, slug) values
  ('Strategy', 'strategy'),
  ('Media', 'media'),
  ('Startups', 'startups'),
  ('Placeholder', 'placeholder')
on conflict (slug) do nothing;

-- Sample placeholder post (published so the Blog page has something to show)
insert into public.posts (
  title, slug, excerpt, content, category_id, status, seo_title, seo_description, published_at
)
select
  'Sample Post — Replace With Real Content',
  'sample-post-replace-with-real-content',
  'This is placeholder excerpt text. Replace it from the admin dashboard before launch.',
  '<p>This is placeholder body content generated for initial setup. Edit or delete this post from <code>/admin</code>.</p>',
  c.id,
  'published',
  'Sample Post — Replace With Real Content',
  'Placeholder meta description. Replace before launch.',
  now()
from public.categories c where c.slug = 'personal-notes'
on conflict (slug) do nothing;
