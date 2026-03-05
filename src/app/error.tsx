"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <p className="font-mono text-6xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-xl font-medium text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-tertiary">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
