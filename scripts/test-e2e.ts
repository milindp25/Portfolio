import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

async function test() {
  const question = "Where does Milind work?";
  console.log(`\n🧪 End-to-end test: "${question}"\n`);

  // 1. Embed query with Voyage AI
  console.log("1. Embedding query with Voyage AI...");
  const embRes = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: question, model: "voyage-3.5-lite" }),
  });

  if (!embRes.ok) {
    console.error("Voyage error:", await embRes.text());
    return;
  }

  const embJson = await embRes.json();
  const embedding = embJson.data[0].embedding;
  console.log(`   ✓ Embedding generated (${embedding.length} dims)\n`);

  // 2. Vector search in Supabase
  console.log("2. Searching Supabase...");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: matches, error } = await sb.rpc("match_knowledge", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 5,
  });

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  const maxSim = Math.max(...matches.map((m: any) => m.similarity));
  console.log(
    `   ✓ Found ${matches.length} matches (max similarity: ${maxSim.toFixed(3)})`,
  );
  for (const m of matches) {
    console.log(
      `     [${m.similarity.toFixed(3)}] ${m.metadata.category}: ${m.content.slice(0, 60)}...`,
    );
  }

  // Determine model route
  const modelRoute =
    maxSim > 0.55 ? "fast" : maxSim >= 0.4 ? "quality" : "none";
  const modelId =
    modelRoute === "fast" ? "gemini-2.5-flash-lite" : "gemini-2.5-flash";
  console.log(`   → Model route: ${modelRoute} (${modelId})\n`);

  if (modelRoute === "none") {
    console.log("   ⚠ No good match — would return fallback message.");
    return;
  }

  // 3. Call Gemini
  console.log("3. Calling Gemini...");
  const relevantChunks = matches.filter((m: any) => m.similarity >= 0.4);
  const context = relevantChunks
    .map(
      (m: any, i: number) =>
        `[${i + 1}] (${m.metadata.category}, similarity: ${m.similarity.toFixed(2)})\n${m.content}`,
    )
    .join("\n\n");

  const geminiRes = await fetch(
    `${GEMINI_API_BASE}/${modelId}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: `You are Milind's portfolio assistant. Answer questions about Milind Prabhakar's professional background only using the context below. Keep responses to 2-4 sentences.\n\nCONTEXT:\n${context}`,
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
    },
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    console.error(`Gemini error (${geminiRes.status}):`, err.slice(0, 300));
    return;
  }

  const json = await geminiRes.json();
  const answer = json.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log(`   ✓ Gemini responded!\n`);
  console.log(`   📝 Answer: ${answer}`);
  console.log(`\n✅ End-to-end test PASSED!`);
}

test().catch((e) => {
  console.error("❌ Test failed:", e);
  process.exit(1);
});
