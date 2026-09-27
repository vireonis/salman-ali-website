import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-400">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper-50 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-paper-200/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
    </Container>
  );
}
