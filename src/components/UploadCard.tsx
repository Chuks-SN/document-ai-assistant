"use client";

import { FileUp, Loader2, Trash2 } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react";
import type { UploadedFileMeta } from "@/types/upload";

const DOC_TYPES = [
  "Contract",
  "Policy",
  "Report",
  "Invoice",
  "Other",
] as const;

const DEPARTMENTS = ["Finance", "HR", "Legal", "Operations", "Other"] as const;

interface UploadCardProps {
  files: UploadedFileMeta[];
  onRemoveFile: (id: string) => void;
  /** Called after successful API upload with new metadata rows. */
  onUploaded: (items: UploadedFileMeta[]) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

/** Drag-drop zone, metadata dropdowns, upload action, recent file list. */
export function UploadCard({
  files,
  onRemoveFile,
  onUploaded,
  onError,
  onSuccess,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>(DOC_TYPES[0]);
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const pickFiles = useCallback((fileList: FileList | null) => {
    const f = fileList?.[0];
    if (f) setSelectedFile(f);
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    pickFiles(e.dataTransfer.files);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    pickFiles(e.target.files);
    e.target.value = "";
  };

  const upload = async () => {
    if (!selectedFile) {
      onError("Please choose a file first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);
      formData.append("department", department);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        files?: UploadedFileMeta[];
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Upload failed");
      }

      onSuccess(data.message || "Document uploaded successfully.");
      if (data.files?.length) onUploaded(data.files);
      setSelectedFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="section-upload"
      className="shrink-0 rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Upload Document
      </h2>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Add files and metadata so the assistant can answer in context.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr,280px]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={[
            "flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition",
            dragOver
              ? "border-accent bg-accent/5"
              : "border-zinc-300 bg-zinc-50/80 dark:border-zinc-600 dark:bg-zinc-900/50",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={onFileChange}
            aria-label="Choose file"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft-sm dark:bg-zinc-800">
            <FileUp
              className="h-7 w-7 text-accent"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
          <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Drag &amp; drop files or click to upload
          </p>
          {selectedFile && (
            <p className="max-w-full truncate text-xs text-zinc-500 dark:text-zinc-400">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="doc-type"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Document type
            </label>
            <select
              id="doc-type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="department"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={upload}
            disabled={loading || !selectedFile}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Recent uploads
          </h3>
          <ul className="mt-3 space-y-2">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {f.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {f.documentType} · {f.department} ·{" "}
                    {new Date(f.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(f.id)}
                  className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                  aria-label={`Remove ${f.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
