"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";

interface DailyStat {
  date: string;
  chats: number;
  positive: number;
  negative: number;
}

interface AnalyticsData {
  dailyStats: DailyStat[];
  modelUsage: Record<string, number>;
  totalChats: number;
  avgResponseTime: number;
  totalFeedback: number;
  positiveFeedback: number;
}

const MODEL_LABELS: Record<string, string> = {
  fast: "Gemini Flash Lite",
  quality: "Gemini Flash",
  none: "Skipped (low similarity)",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const maxChats = data
    ? Math.max(...data.dailyStats.map((d) => d.chats), 1)
    : 1;

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
          <div className="flex items-center justify-between">
            <h1 className="font-mono text-xl font-bold text-foreground">
              Analytics
            </h1>
            <div className="flex gap-1.5">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                    days === d
                      ? "bg-accent text-background"
                      : "border border-border text-secondary hover:border-border-emphasis"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center font-mono text-sm text-tertiary">
            Loading analytics...
          </p>
        ) : !data ? (
          <p className="text-center font-mono text-sm text-tertiary">
            Failed to load analytics.
          </p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-accent" />
                  <p className="font-mono text-xs text-tertiary">
                    Total Chats
                  </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {data.totalChats}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <p className="font-mono text-xs text-tertiary">
                    Avg Response
                  </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {data.avgResponseTime}
                  <span className="text-sm text-tertiary">ms</span>
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-success" />
                  <p className="font-mono text-xs text-tertiary">
                    Satisfaction
                  </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {data.totalFeedback > 0
                    ? `${Math.round((data.positiveFeedback / data.totalFeedback) * 100)}%`
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-warning" />
                  <p className="font-mono text-xs text-tertiary">
                    Feedback
                  </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {data.totalFeedback}
                </p>
              </div>
            </div>

            {/* Chat Volume Chart */}
            <div className="mb-8 rounded-lg border border-border bg-surface p-5">
              <h2 className="mb-4 font-mono text-sm font-medium text-foreground">
                Chat Volume
              </h2>
              {data.dailyStats.length === 0 ? (
                <p className="py-8 text-center font-mono text-xs text-tertiary">
                  No chat data for this period.
                </p>
              ) : (
                <div className="flex items-end gap-1" style={{ height: 160 }}>
                  {data.dailyStats.map((day) => {
                    const height = Math.max(
                      (day.chats / maxChats) * 100,
                      4,
                    );
                    return (
                      <div
                        key={day.date}
                        className="group relative flex flex-1 flex-col items-center"
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-10 hidden whitespace-nowrap rounded bg-foreground px-2 py-1 font-mono text-[10px] text-background group-hover:block">
                          {day.date}: {day.chats} chat
                          {day.chats !== 1 ? "s" : ""}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full min-w-[4px] rounded-t bg-accent/70 transition-colors hover:bg-accent"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {data.dailyStats.length > 0 && (
                <div className="mt-2 flex justify-between font-mono text-[10px] text-tertiary">
                  <span>{data.dailyStats[0]?.date}</span>
                  <span>
                    {data.dailyStats[data.dailyStats.length - 1]?.date}
                  </span>
                </div>
              )}
            </div>

            {/* Model Usage */}
            <div className="mb-8 rounded-lg border border-border bg-surface p-5">
              <h2 className="mb-4 font-mono text-sm font-medium text-foreground">
                Model Usage
              </h2>
              {Object.keys(data.modelUsage).length === 0 ? (
                <p className="py-4 text-center font-mono text-xs text-tertiary">
                  No model usage data.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(data.modelUsage)
                    .sort(([, a], [, b]) => b - a)
                    .map(([model, count]) => {
                      const pct = Math.round(
                        (count / data.totalChats) * 100,
                      );
                      return (
                        <div key={model}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-mono text-xs text-secondary">
                              {MODEL_LABELS[model] || model}
                            </span>
                            <span className="font-mono text-xs text-tertiary">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Feedback Breakdown */}
            {data.dailyStats.some(
              (d) => d.positive > 0 || d.negative > 0,
            ) && (
              <div className="rounded-lg border border-border bg-surface p-5">
                <h2 className="mb-4 font-mono text-sm font-medium text-foreground">
                  Daily Feedback
                </h2>
                <div className="space-y-2">
                  {data.dailyStats
                    .filter((d) => d.positive > 0 || d.negative > 0)
                    .map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                      >
                        <span className="font-mono text-xs text-tertiary">
                          {day.date}
                        </span>
                        <div className="flex items-center gap-3">
                          {day.positive > 0 && (
                            <span className="font-mono text-xs text-success">
                              +{day.positive}
                            </span>
                          )}
                          {day.negative > 0 && (
                            <span className="font-mono text-xs text-destructive">
                              -{day.negative}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
