import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { parseKnowledgeSource, type Chunk } from "./chunk-utils";

// ── Clients ──────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const GEMINI_BATCH_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents";

// ── Helpers ──────────────────────────────────────────────────
async function generateEmbeddings(
  texts: string[],
  maxRetries = 5,
): Promise<number[][]> {
  const requests = texts.map((t) => ({
    model: "models/gemini-embedding-001",
    content: { parts: [{ text: t.replace(/\n/g, " ").trim() }] },
    outputDimensionality: 768,
  }));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(
      `${GEMINI_BATCH_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      },
    );

    if (response.ok) {
      const json = await response.json();
      return json.embeddings.map((e: { values: number[] }) => e.values);
    }

    if (response.status === 429) {
      const wait = 30;
      console.log(
        `  ⏳ Rate limited, waiting ${wait}s (attempt ${attempt + 1}/${maxRetries})...`,
      );
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }

    const err = await response.text();
    throw new Error(`Gemini embedding error (${response.status}): ${err}`);
  }

  throw new Error("Max retries exceeded for Gemini embeddings");
}

/** Process chunks in batches */
async function batchEmbed(
  chunks: Chunk[],
  batchSize: number = 5,
): Promise<{ chunk: Chunk; embedding: number[] }[]> {
  const results: { chunk: Chunk; embedding: number[] }[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.content);

    console.log(
      `  Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)} (${batch.length} chunks)...`,
    );

    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      results.push({ chunk: batch[j], embedding: embeddings[j] });
    }

    // Small delay between batches to be respectful
    if (i + batchSize < chunks.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting knowledge base seed...\n");

  // 1. Parse knowledge source
  console.log("1. Parsing knowledge source...");
  const chunks = parseKnowledgeSource();
  console.log(`   Found ${chunks.length} chunks\n`);

  // 2. Clear existing data
  console.log("2. Clearing existing knowledge_chunks...");
  const { error: deleteError } = await supabase
    .from("knowledge_chunks")
    .delete()
    .gte("id", 0);

  if (deleteError) {
    console.error("   Error clearing table:", deleteError.message);
    process.exit(1);
  }
  console.log("   Cleared.\n");

  // 3. Generate embeddings
  console.log("3. Generating embeddings (Gemini gemini-embedding-001)...");
  const embedded = await batchEmbed(chunks);
  console.log(`   Generated ${embedded.length} embeddings\n`);

  // 4. Insert into Supabase
  console.log("4. Inserting into Supabase...");
  const rows = embedded.map(({ chunk, embedding }) => ({
    content: chunk.content,
    metadata: chunk.metadata,
    embedding,
  }));

  // Insert in batches of 5 with retry
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 5) {
    const batch = rows.slice(i, i + 5);
    let retries = 3;
    while (retries > 0) {
      const { error: insertError } = await supabase
        .from("knowledge_chunks")
        .insert(batch);

      if (!insertError) {
        inserted += batch.length;
        console.log(`   Inserted ${inserted}/${rows.length} rows...`);
        break;
      }

      retries--;
      if (retries === 0) {
        console.error(
          `   Error inserting batch ${Math.floor(i / 5) + 1}:`,
          insertError.message,
        );
        process.exit(1);
      }
      console.log(`   Retrying batch ${Math.floor(i / 5) + 1}...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n✅ Seeded ${inserted} knowledge chunks successfully!`);

  // 5. Verify with a test query
  console.log("\n5. Running test query...");
  const testQuery = "What is Milind's current job?";
  const [testEmbedding] = await generateEmbeddings([testQuery]);

  const { data: matches, error: matchError } = await supabase.rpc(
    "match_knowledge",
    {
      query_embedding: testEmbedding,
      match_threshold: 0.3,
      match_count: 3,
    },
  );

  if (matchError) {
    console.error("   Test query error:", matchError.message);
    process.exit(1);
  }

  console.log(`   Query: "${testQuery}"`);
  console.log(`   Found ${matches.length} matches:\n`);
  for (const match of matches) {
    console.log(
      `   [${match.similarity.toFixed(3)}] ${match.metadata.category}: ${match.content.slice(0, 100)}...`,
    );
  }

  console.log("\n🎉 Knowledge base seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
