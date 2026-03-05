import type { MatchResult } from "@/lib/supabase/types";

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  model: ModelChoice;
  similarity: number;
}

export type ModelChoice = "fast" | "quality" | "none";

export interface RAGContext {
  chunks: MatchResult[];
  maxSimilarity: number;
  model: ModelChoice;
}

export const MODEL_IDS = {
  fast: "gemini-2.5-flash-lite",
  quality: "gemini-2.5-flash",
} as const;
