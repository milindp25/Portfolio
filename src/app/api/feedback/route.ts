import { NextRequest, NextResponse } from "next/server";
import { saveFeedback } from "@/lib/supabase/admin-queries";

export async function POST(request: NextRequest) {
  try {
    const { question, answer, rating, comment } = await request.json();

    if (!question || !answer || !rating) {
      return NextResponse.json(
        { error: "question, answer, and rating are required." },
        { status: 400 },
      );
    }

    if (rating !== "positive" && rating !== "negative") {
      return NextResponse.json(
        { error: 'rating must be "positive" or "negative".' },
        { status: 400 },
      );
    }

    const success = await saveFeedback({ question, answer, rating, comment });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save feedback." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
