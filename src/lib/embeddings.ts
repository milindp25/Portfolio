const GEMINI_EMBED_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";
const GEMINI_BATCH_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents";

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

/**
 * Generate an embedding vector for a text string using Gemini's
 * gemini-embedding-001 model (768 dimensions).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${GEMINI_EMBED_URL}?key=${getGeminiApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: { parts: [{ text: text.replace(/\n/g, " ").trim() }] },
      outputDimensionality: 768,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini embedding error (${response.status}): ${err}`);
  }

  const json = await response.json();
  return json.embedding.values;
}

/**
 * Generate embeddings for multiple texts in a single batch request.
 * More efficient than calling generateEmbedding in a loop.
 */
export async function generateEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const requests = texts.map((t) => ({
    model: "models/gemini-embedding-001",
    content: { parts: [{ text: t.replace(/\n/g, " ").trim() }] },
    outputDimensionality: 768,
  }));

  const response = await fetch(
    `${GEMINI_BATCH_URL}?key=${getGeminiApiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requests }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini embedding error (${response.status}): ${err}`);
  }

  const json = await response.json();
  return json.embeddings.map((e: { values: number[] }) => e.values);
}
