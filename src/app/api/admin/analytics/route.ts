import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * GET /api/admin/analytics
 * Returns chat analytics data for the admin dashboard.
 * Supports ?days=7 (default 30) for the time range.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const supabase = getSupabaseAdmin();

    // Fetch chat analytics within the date range
    const { data: chats, error: chatsError } = await supabase
      .from("chat_analytics")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: true });

    if (chatsError) {
      console.error("Analytics chats error:", chatsError.message);
      return NextResponse.json(
        { error: "Failed to fetch analytics." },
        { status: 500 },
      );
    }

    // Fetch feedback within the date range
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedback")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: true });

    if (feedbackError) {
      console.error("Analytics feedback error:", feedbackError.message);
      return NextResponse.json(
        { error: "Failed to fetch feedback analytics." },
        { status: 500 },
      );
    }

    // Aggregate chats by date
    const chatsByDate: Record<string, number> = {};
    const modelUsage: Record<string, number> = {};
    let totalResponseTime = 0;

    for (const chat of chats || []) {
      const date = chat.created_at.split("T")[0];
      chatsByDate[date] = (chatsByDate[date] || 0) + 1;

      const model = chat.model_used || "unknown";
      modelUsage[model] = (modelUsage[model] || 0) + 1;

      totalResponseTime += chat.response_time_ms || 0;
    }

    // Aggregate feedback by date
    const feedbackByDate: Record<
      string,
      { positive: number; negative: number }
    > = {};

    for (const fb of feedback || []) {
      const date = fb.created_at.split("T")[0];
      if (!feedbackByDate[date]) {
        feedbackByDate[date] = { positive: 0, negative: 0 };
      }
      if (fb.rating === "positive") {
        feedbackByDate[date].positive += 1;
      } else {
        feedbackByDate[date].negative += 1;
      }
    }

    // Build daily timeline
    const dailyStats = Object.keys(chatsByDate)
      .sort()
      .map((date) => ({
        date,
        chats: chatsByDate[date],
        positive: feedbackByDate[date]?.positive || 0,
        negative: feedbackByDate[date]?.negative || 0,
      }));

    return NextResponse.json({
      dailyStats,
      modelUsage,
      totalChats: chats?.length || 0,
      avgResponseTime: chats?.length
        ? Math.round(totalResponseTime / chats.length)
        : 0,
      totalFeedback: feedback?.length || 0,
      positiveFeedback: (feedback || []).filter((f) => f.rating === "positive")
        .length,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
