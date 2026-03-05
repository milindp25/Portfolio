import { NextRequest, NextResponse } from "next/server";
import {
  getUnansweredQuestions,
  updateQuestionStatus,
} from "@/lib/supabase/admin-queries";

/** GET /api/admin/questions — list unanswered questions */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { data, count } = await getUnansweredQuestions({
      status,
      limit,
      offset,
    });

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Admin questions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions." },
      { status: 500 },
    );
  }
}

/** PATCH /api/admin/questions — update question status */
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required." },
        { status: 400 },
      );
    }

    const validStatuses = ["pending", "resolved", "added_to_kb", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 },
      );
    }

    const success = await updateQuestionStatus(id, status);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update question." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin questions PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
