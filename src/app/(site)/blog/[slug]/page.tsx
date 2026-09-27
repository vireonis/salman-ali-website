import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: SITE_NAME },
    image: post.featured_image_url ?? undefined,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-prose">
          <div className="flex items-center gap-3 text-xs text-paper-200/50">
            {post.category && (
              <span className="rounded-full bg-accent-500/10 px-2.5 py-1 font-medium text-accent-400">
                {post.category.name}
              </span>
            )}
            <time dateTime={post.published_at ?? undefined}>
              {formatDate(post.published_at)}
            </time>
          </div>

          <h1 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-paper-50 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-paper-200/70">
              {post.excerpt}
            </p>
          )}

          {post.featured_image_url && (
            <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose-content mt-10"
            // Content is sanitized server-side at write time (see
            // src/lib/validation.ts sanitizeHtml) before it is ever stored.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-paper-200/60"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
