import type { ModelChoice } from "./types";

/**
 * Route to the appropriate Gemini model based on similarity score.
 *
 * Thresholds calibrated for Gemini gemini-embedding-001 (768 dims).
 * Scores are well-calibrated: ~0.75 for relevant, ~0.5 for tangential.
 *
 * > 0.7   → Gemini 2.5 Flash Lite (clear factual match, fast)
 * 0.55-0.7 → Gemini 2.5 Flash (needs synthesis, more nuanced)
 * < 0.55  → None (no good match, skip LLM call entirely)
 */
export function routeModel(maxSimilarity: number): ModelChoice {
  if (maxSimilarity > 0.7) return "fast";
  if (maxSimilarity >= 0.55) return "quality";
  return "none";
}
