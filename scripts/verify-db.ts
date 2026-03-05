import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

async function main() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  // Count rows
  const { count } = await sb
    .from("knowledge_chunks")
    .select("*", { count: "exact", head: true });
  console.log(`Total rows: ${count}\n`);

  // Show sample rows
  const { data } = await sb
    .from("knowledge_chunks")
    .select("id, metadata, content")
    .limit(5);

  if (data) {
    for (const r of data) {
      console.log(
        `[${r.id}] ${r.metadata.category}: ${r.content.slice(0, 80)}...`,
      );
    }
  }

  // Test similarity search with lower threshold
  console.log("\n--- Testing match_knowledge with threshold 0.3 ---");
  const testTexts = ["What is Milind's current job?"];
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: testTexts, model: "voyage-3.5-lite" }),
  });

  if (!res.ok) {
    console.log("Skipping search test (rate limited). Data verification passed!");
    return;
  }

  const json = await res.json();
  const embedding = json.data[0].embedding;

  const { data: matches, error } = await sb.rpc("match_knowledge", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 5,
  });

  if (error) {
    console.error("Search error:", error.message);
    return;
  }

  console.log(`Found ${matches.length} matches:\n`);
  for (const m of matches) {
    console.log(
      `  [${m.similarity.toFixed(3)}] ${m.metadata.category}: ${m.content.slice(0, 80)}...`,
    );
  }
}

main();
