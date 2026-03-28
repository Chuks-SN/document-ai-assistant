import type { UploadedFileMeta } from "@/types/upload";

export const UPLOADS_STORAGE_KEY = "document-ai-assistant-uploads";

function isValidMeta(x: unknown): x is UploadedFileMeta {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.documentType === "string" &&
    typeof o.department === "string" &&
    typeof o.uploadedAt === "string"
  );
}

/** Read stored upload metadata (browser only). */
export function loadUploads(): UploadedFileMeta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMeta);
  } catch {
    return [];
  }
}

/** Persist upload metadata so other tabs (e.g. /documents) stay in sync. */
export function saveUploads(files: UploadedFileMeta[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(files));
  } catch {
    // Quota exceeded or private mode — ignore
  }
}
