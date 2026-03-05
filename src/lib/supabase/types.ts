export interface KnowledgeChunk {
  id: number;
  content: string;
  metadata: ChunkMetadata;
  embedding?: number[];
  created_at: string;
}

export interface ChunkMetadata {
  category: string;
  subcategory?: string;
  keywords: string[];
}

export interface MatchResult {
  id: number;
  content: string;
  metadata: ChunkMetadata;
  similarity: number;
}

// ── Phase 4: Feedback & Admin ────────────────────────────────

export interface UnansweredQuestion {
  id: number;
  question: string;
  max_similarity: number;
  frequency: number;
  status: "pending" | "resolved" | "added_to_kb" | "dismissed";
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: number;
  question: string;
  answer: string;
  rating: "positive" | "negative";
  comment?: string;
  created_at: string;
}

export interface ChatAnalytics {
  id: number;
  question: string;
  model_used: string;
  max_similarity: number;
  response_time_ms: number;
  created_at: string;
}

export interface AdminStats {
  total_chats: number;
  chats_today: number;
  chats_this_week: number;
  pending_questions: number;
  total_feedback: number;
  positive_feedback: number;
  negative_feedback: number;
  avg_similarity: number | null;
}
