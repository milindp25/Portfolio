import { getSupabaseAdmin } from "./server";
import { generateEmbedding } from "../embeddings";
import type { MatchResult } from "./types";

/**
 * Search the knowledge base for chunks relevant to a query.
 * Returns matched chunks sorted by similarity (highest first).
 */
export async function searchKnowledge(
  query: string,
  options?: {
    threshold?: number;
    maxResults?: number;
  },
): Promise<MatchResult[]> {
  const { threshold = 0.7, maxResults = 5 } = options || {};

  // 1. Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // 2. Call Supabase RPC to find matching chunks
  const { data, error } = await getSupabaseAdmin().rpc("match_knowledge", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: maxResults,
  });

  if (error) {
    console.error("Knowledge search error:", error.message);
    return [];
  }

  return (data as MatchResult[]) || [];
}

/**
 * Get the max similarity score from search results.
 * Used by the model router to decide Haiku vs Sonnet vs skip.
 */
export function getMaxSimilarity(results: MatchResult[]): number {
  if (results.length === 0) return 0;
  return Math.max(...results.map((r) => r.similarity));
}
