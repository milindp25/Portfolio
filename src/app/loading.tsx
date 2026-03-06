export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
      </div>
    </div>
  );
}
