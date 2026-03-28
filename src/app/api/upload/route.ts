import { NextResponse } from "next/server";

/** Stub: accepts multipart file + documentType + department; returns success + file metadata. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const documentType = String(formData.get("documentType") || "Other");
    const department = String(formData.get("department") || "Other");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, message: "Missing file" },
        { status: 400 }
      );
    }

    const name =
      file instanceof File
        ? file.name
        : "upload";

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600));

    const meta = {
      id: crypto.randomUUID(),
      name,
      documentType,
      department,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      message: `“${name}” was received and queued for indexing.`,
      files: [meta],
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error during upload" },
      { status: 500 }
    );
  }
}
