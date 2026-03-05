import { cn } from "@/lib/utils";

interface TerminalBlockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function TerminalBlock({ children, className, title }: TerminalBlockProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        {title && (
          <span className="ml-2 font-mono text-[11px] text-tertiary">
            {title}
          </span>
        )}
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}
