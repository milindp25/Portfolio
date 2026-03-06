import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/embeddings";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { updateQuestionStatus } from "@/lib/supabase/admin-queries";

/**
 * POST /api/admin/questions/add-to-kb
 * Takes a question ID and an admin-written answer,
 * generates an embedding, and inserts it as a new knowledge chunk.
 */
export async function POST(request: NextRequest) {
  try {
    const { questionId, question, answer, category } = await request.json();

    if (!questionId || !question || !answer) {
      return NextResponse.json(
        { error: "questionId, question, and answer are required." },
        { status: 400 },
      );
    }

    // Build the chunk content — include the question for better retrieval
    const chunkContent = `Q: ${question.trim()}\nA: ${answer.trim()}`;

    // Generate embedding for the new chunk
    const embedding = await generateEmbedding(chunkContent);

    // Insert into knowledge_chunks
    const { error: insertError } = await getSupabaseAdmin()
      .from("knowledge_chunks")
      .insert({
        content: chunkContent,
        metadata: {
          category: category || "admin-added",
          subcategory: "qa-pair",
          keywords: [],
          source_question_id: questionId,
        },
        embedding,
      });

    if (insertError) {
      console.error("Failed to insert knowledge chunk:", insertError.message);
      return NextResponse.json(
        { error: "Failed to add to knowledge base." },
        { status: 500 },
      );
    }

    // Update question status to "added_to_kb"
    await updateQuestionStatus(questionId, "added_to_kb");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Add to KB error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
