import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        hover &&
          "transition-colors duration-200 hover:border-border-emphasis hover:bg-elevated",
        className,
      )}
    >
      {children}
    </div>
  );
}
