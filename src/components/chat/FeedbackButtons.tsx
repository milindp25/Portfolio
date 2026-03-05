"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackButtonsProps {
  question: string;
  answer: string;
}

export function FeedbackButtons({ question, answer }: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState<"positive" | "negative" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (rating: "positive" | "negative") => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, rating }),
      });
      setSubmitted(rating);
    } catch {
      // Silently fail — feedback is non-critical
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <p className="mt-1 font-mono text-[10px] text-tertiary">
        {submitted === "positive" ? "Thanks!" : "Thanks for the feedback"}
      </p>
    );
  }

  return (
    <div className="mt-1.5 flex gap-1">
      <button
        onClick={() => handleFeedback("positive")}
        disabled={isSubmitting}
        className={cn(
          "rounded p-1 text-tertiary transition-colors hover:bg-surface hover:text-success",
          isSubmitting && "pointer-events-none opacity-50",
        )}
        aria-label="Helpful"
      >
        <ThumbsUp size={12} />
      </button>
      <button
        onClick={() => handleFeedback("negative")}
        disabled={isSubmitting}
        className={cn(
          "rounded p-1 text-tertiary transition-colors hover:bg-surface hover:text-destructive",
          isSubmitting && "pointer-events-none opacity-50",
        )}
        aria-label="Not helpful"
      >
        <ThumbsDown size={12} />
      </button>
    </div>
  );
}
