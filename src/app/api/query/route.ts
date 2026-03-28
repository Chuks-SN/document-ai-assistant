import { NextResponse } from "next/server";

/** Stub: accepts JSON { question, searchScope? }; returns { answer }. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      searchScope?: string;
    };
    const question = String(body.question || "").trim();
    const scope = body.searchScope || "All";

    if (!question) {
      return NextResponse.json(
        { ok: false, message: "question is required" },
        { status: 400 }
      );
    }

    await new Promise((r) => setTimeout(r, 900));

    const scopeNote =
      scope === "All"
        ? "across all departments"
        : `with emphasis on ${scope} documents`;

    const answer = `[Demo response] You asked: “${question}”. In a production app, this would call your RAG or document search pipeline ${scopeNote}. For now, this stub confirms the API is wired correctly.`;

    return NextResponse.json({ ok: true, answer });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
