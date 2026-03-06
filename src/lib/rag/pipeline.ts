import { searchKnowledge, getMaxSimilarity } from "@/lib/supabase/search";
import { routeModel } from "./model-router";
import { buildSystemPrompt, FALLBACK_MESSAGE } from "./prompt";
import { MODEL_IDS, type RAGContext, type ModelChoice } from "./types";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

/**
 * Step 1: Retrieve relevant context from the knowledge base.
 * Returns chunks, max similarity, and the routed model choice.
 */
export async function retrieveContext(
  question: string,
): Promise<RAGContext> {
  const chunks = await searchKnowledge(question, {
    threshold: 0.45, // fetch broadly, let model router decide
    maxResults: 8,
  });

  const maxSimilarity = getMaxSimilarity(chunks);
  const model = routeModel(maxSimilarity);

  // Filter to only chunks above 0.55 for the actual prompt
  const relevantChunks = chunks.filter((c) => c.similarity >= 0.55);

  return {
    chunks: relevantChunks,
    maxSimilarity,
    model,
  };
}

/**
 * Step 2: Generate a response using Gemini (streaming).
 * Uses direct fetch() to the Gemini REST API — no SDK needed.
 * Returns a ReadableStream for the API route to pipe to the client.
 */
export async function generateStreamingResponse(
  question: string,
  context: RAGContext,
): Promise<ReadableStream<Uint8Array>> {
  if (context.model === "none") {
    // No LLM call — return fallback as a stream
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(FALLBACK_MESSAGE));
        controller.close();
      },
    });
  }

  const systemPrompt = buildSystemPrompt(context.chunks);
  const modelId = MODEL_IDS[context.model as Exclude<ModelChoice, "none">];
  const apiKey = getGeminiApiKey();

  const response = await fetch(
    `${GEMINI_API_BASE}/${modelId}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          return;
        }

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              const content =
                json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Non-streaming variant for simpler use cases.
 */
export async function generateResponse(
  question: string,
  context: RAGContext,
): Promise<{ answer: string; model: ModelChoice }> {
  if (context.model === "none") {
    return { answer: FALLBACK_MESSAGE, model: "none" };
  }

  const systemPrompt = buildSystemPrompt(context.chunks);
  const modelId = MODEL_IDS[context.model as Exclude<ModelChoice, "none">];
  const apiKey = getGeminiApiKey();

  const response = await fetch(
    `${GEMINI_API_BASE}/${modelId}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const answer =
    json.candidates?.[0]?.content?.parts?.[0]?.text || FALLBACK_MESSAGE;

  return { answer, model: context.model };
}
