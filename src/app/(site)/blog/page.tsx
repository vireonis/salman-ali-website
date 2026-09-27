import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and essays by Salman Ali on business, media and digital strategy.",
};

// Re-fetch periodically so newly published posts (including AI-published
// ones) appear without a full redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          Blog
        </p>
      </Reveal>
      <Reveal delay="100ms">
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">
          Writing &amp; ideas
        </h1>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal delay="150ms">
          <div className="mt-16 rounded-2xl border border-dashed border-white/10 p-16 text-center">
            <p className="text-paper-200/50">
              No posts published yet. Check back soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-16 grid gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={`${Math.min(i, 5) * 60}ms`}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}
