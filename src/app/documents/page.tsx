"use client";

import { ArrowLeft, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { loadUploads, UPLOADS_STORAGE_KEY } from "@/lib/uploadsPersistence";
import type { UploadedFileMeta } from "@/types/upload";

/** Full-page list of uploads; data from localStorage (same browser as main app). */
export default function DocumentsPage() {
  const [files, setFiles] = useState<UploadedFileMeta[]>([]);

  const refresh = useCallback(() => {
    setFiles(loadUploads());
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === UPLOADS_STORAGE_KEY) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#0f172a]">
      <header className="flex h-[70px] shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 shadow-soft-sm sm:px-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Back to app"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
              My documents
            </h1>
            <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
              Files you uploaded in this browser
            </p>
          </div>
        </div>
        <FolderOpen
          className="h-8 w-8 shrink-0 text-accent/80"
          strokeWidth={1.5}
          aria-hidden
        />
      </header>

      <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        {files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-600 dark:bg-zinc-950">
            <FileText
              className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600"
              strokeWidth={1.25}
            />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No documents yet
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Upload files from the main app, then refresh this tab or return
              here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-accent-dark"
            >
              Go to upload
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-100 px-4 py-4 dark:border-zinc-800 sm:px-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {files.length} document{files.length === 1 ? "" : "s"}
              </p>
            </div>
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      <FileText
                        className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                        {f.name}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {f.documentType} · {f.department}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 pl-[52px] text-xs text-zinc-400 sm:pl-0 sm:text-right dark:text-zinc-500">
                    {new Date(f.uploadedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
