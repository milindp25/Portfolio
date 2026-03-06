import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, generateStreamingResponse } from "@/lib/rag/pipeline";
import {
  logUnansweredQuestion,
  logChatAnalytics,
} from "@/lib/supabase/admin-queries";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 20 requests per minute per IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const { allowed, remaining, resetAt } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "A question string is required." },
        { status: 400 },
      );
    }

    // Trim and enforce reasonable length
    const trimmed = question.trim().slice(0, 500);

    if (trimmed.length === 0) {
      return NextResponse.json(
        { error: "Question cannot be empty." },
        { status: 400 },
      );
    }

    const startTime = Date.now();

    // 1. Retrieve context from knowledge base
    const context = await retrieveContext(trimmed);

    // 2. Log unanswered question if similarity is too low
    if (context.model === "none") {
      // Fire-and-forget — don't block the response
      logUnansweredQuestion(trimmed, context.maxSimilarity).catch(() => {});
    }

    // 3. Generate streaming response
    const stream = await generateStreamingResponse(trimmed, context);

    // 4. Log analytics (fire-and-forget)
    const responseTimeMs = Date.now() - startTime;
    logChatAnalytics({
      question: trimmed,
      modelUsed: context.model,
      maxSimilarity: context.maxSimilarity,
      responseTimeMs,
    }).catch(() => {});

    // 5. Return as streaming response with metadata headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Model-Used": context.model,
        "X-Max-Similarity": context.maxSimilarity.toFixed(3),
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
