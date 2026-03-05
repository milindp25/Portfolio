"use client";

import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatToggle({ isOpen, onClick }: ChatToggleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200",
        isOpen
          ? "bg-elevated text-secondary hover:text-foreground"
          : "bg-accent text-background hover:brightness-110",
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X size={18} /> : <MessageCircle size={18} />}

      {/* Pulse ring when closed */}
      {!isOpen && (
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20" />
      )}
    </button>
  );
}
