"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Plus,
  Loader2,
  BookPlus,
} from "lucide-react";
import type { UnansweredQuestion } from "@/lib/supabase/types";

type StatusFilter =
  | "pending"
  | "all"
  | "resolved"
  | "dismissed"
  | "added_to_kb";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  // Answer form state
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/questions?status=${filter}&limit=50`,
      );
      const data = await res.json();
      setQuestions(data.data || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const updateStatus = async (
    id: number,
    status: UnansweredQuestion["status"],
  ) => {
    try {
      await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update question:", err);
    }
  };

  const handleAddToKB = async (question: UnansweredQuestion) => {
    if (!answerText.trim() || submittingAnswer) return;
    setSubmittingAnswer(true);

    try {
      const res = await fetch("/api/admin/questions/add-to-kb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          answer: answerText.trim(),
        }),
      });

      if (res.ok) {
        setAnsweringId(null);
        setAnswerText("");
        fetchQuestions();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add to knowledge base.");
      }
    } catch (err) {
      console.error("Failed to add to KB:", err);
      alert("Something went wrong.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "All", value: "all" },
    { label: "Resolved", value: "resolved" },
    { label: "Added to KB", value: "added_to_kb" },
    { label: "Dismissed", value: "dismissed" },
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
            Unanswered Questions
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            {count} question{count !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
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

        {/* Questions List */}
        {loading ? (
          <p className="text-center font-mono text-sm text-tertiary">
            Loading...
          </p>
        ) : questions.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <p className="font-mono text-sm text-tertiary">
              No questions found.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <div
                key={q.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      &ldquo;{q.question}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="font-mono text-[10px] text-tertiary">
                        Similarity: {q.max_similarity.toFixed(3)}
                      </span>
                      <span className="font-mono text-[10px] text-tertiary">
                        Asked {q.frequency}x
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          q.status === "pending"
                            ? "bg-warning/20 text-warning"
                            : q.status === "dismissed"
                              ? "bg-muted text-tertiary"
                              : q.status === "added_to_kb"
                                ? "bg-success/20 text-success"
                                : "bg-accent/20 text-accent"
                        }`}
                      >
                        {q.status === "added_to_kb" ? "in KB" : q.status}
                      </span>
                    </div>
                  </div>

                  {q.status === "pending" && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => {
                          setAnsweringId(
                            answeringId === q.id ? null : q.id,
                          );
                          setAnswerText("");
                        }}
                        className="rounded-lg border border-border p-2 text-tertiary transition-colors hover:border-accent hover:text-accent"
                        title="Answer & add to knowledge base"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => updateStatus(q.id, "resolved")}
                        className="rounded-lg border border-border p-2 text-tertiary transition-colors hover:border-success hover:text-success"
                        title="Mark as resolved (no KB addition needed)"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => updateStatus(q.id, "dismissed")}
                        className="rounded-lg border border-border p-2 text-tertiary transition-colors hover:border-destructive hover:text-destructive"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {q.status !== "pending" && (
                    <button
                      onClick={() => updateStatus(q.id, "pending")}
                      className="shrink-0 rounded-lg border border-border p-2 text-tertiary transition-colors hover:border-border-emphasis hover:text-foreground"
                      title="Reopen"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>

                {/* Answer & Add to KB form */}
                {answeringId === q.id && q.status === "pending" && (
                  <div className="mt-3 border-t border-border pt-3">
                    <label className="mb-1.5 block font-mono text-[10px] text-tertiary">
                      Write an answer (will be embedded and added to the
                      knowledge base)
                    </label>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder={`Answer for: "${q.question.slice(0, 60)}..."`}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-tertiary focus:border-accent focus:outline-none"
                      autoFocus
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-mono text-[10px] text-tertiary">
                        This will generate an embedding and insert a new
                        knowledge chunk.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setAnsweringId(null);
                            setAnswerText("");
                          }}
                          className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-border-emphasis"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddToKB(q)}
                          disabled={
                            !answerText.trim() || submittingAnswer
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {submittingAnswer ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <BookPlus size={12} />
                          )}
                          {submittingAnswer
                            ? "Adding..."
                            : "Add to KB"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
