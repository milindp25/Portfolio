import { getSupabaseAdmin } from "./server";
import type {
  UnansweredQuestion,
  Feedback,
  AdminStats,
} from "./types";

// ── Unanswered Questions ─────────────────────────────────────

/** Log an unanswered question (auto-deduplicates by incrementing frequency). */
export async function logUnansweredQuestion(
  question: string,
  maxSimilarity: number,
): Promise<void> {
  const { error } = await getSupabaseAdmin().rpc("log_unanswered_question", {
    p_question: question,
    p_max_similarity: maxSimilarity,
  });

  if (error) {
    console.error("Failed to log unanswered question:", error.message);
  }
}

/** Log chat analytics for every request. */
export async function logChatAnalytics(data: {
  question: string;
  modelUsed: string;
  maxSimilarity: number;
  responseTimeMs: number;
}): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("chat_analytics")
    .insert({
      question: data.question,
      model_used: data.modelUsed,
      max_similarity: data.maxSimilarity,
      response_time_ms: data.responseTimeMs,
    });

  if (error) {
    console.error("Failed to log chat analytics:", error.message);
  }
}

/** Get all unanswered questions with pagination. */
export async function getUnansweredQuestions(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: UnansweredQuestion[]; count: number }> {
  const { status = "pending", limit = 20, offset = 0 } = options || {};

  let query = getSupabaseAdmin()
    .from("unanswered_questions")
    .select("*", { count: "exact" });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order("frequency", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to fetch unanswered questions:", error.message);
    return { data: [], count: 0 };
  }

  return { data: (data as UnansweredQuestion[]) || [], count: count || 0 };
}

/** Update the status of an unanswered question. */
export async function updateQuestionStatus(
  id: number,
  status: UnansweredQuestion["status"],
): Promise<boolean> {
  const { error } = await getSupabaseAdmin()
    .from("unanswered_questions")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Failed to update question status:", error.message);
    return false;
  }
  return true;
}

// ── Feedback ─────────────────────────────────────────────────

/** Save feedback (thumbs up/down) for an assistant response. */
export async function saveFeedback(data: {
  question: string;
  answer: string;
  rating: "positive" | "negative";
  comment?: string;
}): Promise<boolean> {
  const { error } = await getSupabaseAdmin()
    .from("feedback")
    .insert({
      question: data.question,
      answer: data.answer,
      rating: data.rating,
      comment: data.comment,
    });

  if (error) {
    console.error("Failed to save feedback:", error.message);
    return false;
  }
  return true;
}

/** Get all feedback entries with pagination. */
export async function getFeedback(options?: {
  rating?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Feedback[]; count: number }> {
  const { rating, limit = 20, offset = 0 } = options || {};

  let query = getSupabaseAdmin()
    .from("feedback")
    .select("*", { count: "exact" });

  if (rating && rating !== "all") {
    query = query.eq("rating", rating);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to fetch feedback:", error.message);
    return { data: [], count: 0 };
  }

  return { data: (data as Feedback[]) || [], count: count || 0 };
}

// ── Stats ────────────────────────────────────────────────────

/** Get admin dashboard statistics. */
export async function getAdminStats(): Promise<AdminStats> {
  const { data, error } = await getSupabaseAdmin().rpc("get_admin_stats");

  if (error) {
    console.error("Failed to fetch admin stats:", error.message);
    return {
      total_chats: 0,
      chats_today: 0,
      chats_this_week: 0,
      pending_questions: 0,
      total_feedback: 0,
      positive_feedback: 0,
      negative_feedback: 0,
      avg_similarity: null,
    };
  }

  return data as AdminStats;
}
