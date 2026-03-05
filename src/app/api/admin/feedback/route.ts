import { NextRequest, NextResponse } from "next/server";
import { getFeedback } from "@/lib/supabase/admin-queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get("rating") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { data, count } = await getFeedback({ rating, limit, offset });

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Admin feedback GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback." },
      { status: 500 },
    );
  }
}
