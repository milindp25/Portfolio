"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminStats } from "@/lib/supabase/types";
import {
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Activity,
  ArrowRight,
  LogOut,
  BarChart3,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-tertiary">{label}</p>
        <Icon size={14} className={accent || "text-tertiary"} />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-sm text-tertiary">Loading...</p>
      </div>
    );
  }

  const satisfactionRate =
    stats && stats.total_feedback > 0
      ? Math.round(
          (stats.positive_feedback / stats.total_feedback) * 100,
        )
      : null;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              Chat analytics and knowledge base management
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs text-secondary transition-colors hover:border-border-emphasis hover:text-foreground"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Chats"
            value={stats?.total_chats ?? 0}
            icon={MessageSquare}
            accent="text-accent"
          />
          <StatCard
            label="This Week"
            value={stats?.chats_this_week ?? 0}
            icon={Activity}
            accent="text-accent"
          />
          <StatCard
            label="Pending Questions"
            value={stats?.pending_questions ?? 0}
            icon={HelpCircle}
            accent="text-warning"
          />
          <StatCard
            label="Satisfaction"
            value={satisfactionRate !== null ? `${satisfactionRate}%` : "—"}
            icon={ThumbsUp}
            accent="text-success"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="font-mono text-xs text-tertiary">Today</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {stats?.chats_today ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <ThumbsUp size={12} className="text-success" />
              <p className="font-mono text-xs text-tertiary">Positive</p>
            </div>
            <p className="mt-1 text-lg font-bold text-foreground">
              {stats?.positive_feedback ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <ThumbsDown size={12} className="text-destructive" />
              <p className="font-mono text-xs text-tertiary">Negative</p>
            </div>
            <p className="mt-1 text-lg font-bold text-foreground">
              {stats?.negative_feedback ?? 0}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            href="/admin/questions"
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-emphasis"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} className="text-warning" />
              <div>
                <p className="font-mono text-sm font-medium text-foreground">
                  Unanswered Questions
                </p>
                <p className="text-xs text-tertiary">
                  Review and resolve questions the chatbot couldn&apos;t answer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(stats?.pending_questions ?? 0) > 0 && (
                <span className="rounded-full bg-warning/20 px-2 py-0.5 font-mono text-xs text-warning">
                  {stats?.pending_questions}
                </span>
              )}
              <ArrowRight size={14} className="text-tertiary" />
            </div>
          </Link>

          <Link
            href="/admin/feedback"
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-emphasis"
          >
            <div className="flex items-center gap-3">
              <ThumbsUp size={18} className="text-success" />
              <div>
                <p className="font-mono text-sm font-medium text-foreground">
                  Feedback
                </p>
                <p className="text-xs text-tertiary">
                  View all thumbs up/down feedback from users
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-tertiary" />
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-emphasis"
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-accent" />
              <div>
                <p className="font-mono text-sm font-medium text-foreground">
                  Analytics
                </p>
                <p className="text-xs text-tertiary">
                  Chat volume, model usage, and response times
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-tertiary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
