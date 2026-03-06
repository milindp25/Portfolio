import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] leading-relaxed tracking-wide",
        {
          default:
            "bg-[rgba(255,255,255,0.04)] text-secondary border border-[rgba(255,255,255,0.06)]",
          accent:
            "bg-accent-dim text-accent border border-accent/20",
        }[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
