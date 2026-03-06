"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Feedback } from "@/lib/supabase/types";

type RatingFilter = "all" | "positive" | "negative";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RatingFilter>("all");

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/feedback?rating=${filter}&limit=50`,
      );
      const data = await res.json();
      setFeedback(data.data || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filters: { label: string; value: RatingFilter }[] = [
    { label: "All", value: "all" },
    { label: "Positive", value: "positive" },
    { label: "Negative", value: "negative" },
  ];

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 font-mono text-xs text-tertiary transition-colors hover:text-secondary"
          >
            <ArrowLeft size={12} />
            Back to Dashboard
          </Link>
          <h1 className="font-mono text-xl font-bold text-foreground">
            Feedback
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            {count} feedback entr{count !== 1 ? "ies" : "y"} found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                filter === f.value
                  ? "bg-accent text-background"
                  : "border border-border text-secondary hover:border-border-emphasis"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {loading ? (
          <p className="text-center font-mono text-sm text-tertiary">
            Loading...
          </p>
        ) : feedback.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <p className="font-mono text-sm text-tertiary">
              No feedback yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {feedback.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  {f.rating === "positive" ? (
                    <ThumbsUp size={14} className="text-success" />
                  ) : (
                    <ThumbsDown size={14} className="text-destructive" />
                  )}
                  <span className="font-mono text-[10px] text-tertiary">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-mono text-[10px] text-tertiary">
                      Question
                    </p>
                    <p className="text-sm text-foreground">
                      &ldquo;{f.question}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-tertiary">
                      Answer
                    </p>
                    <p className="text-sm text-secondary">
                      {f.answer.length > 200
                        ? `${f.answer.slice(0, 200)}...`
                        : f.answer}
                    </p>
                  </div>
                  {f.comment && (
                    <div>
                      <p className="font-mono text-[10px] text-tertiary">
                        Comment
                      </p>
                      <p className="text-sm text-secondary italic">
                        {f.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
