"use client";

import { Loader2, SendHorizontal } from "lucide-react";
import type { FormEvent } from "react";

const SEARCH_SCOPES = ["All", "Finance", "HR"] as const;
export type SearchScope = (typeof SEARCH_SCOPES)[number];

const SUGGESTED_PROMPTS = [
  "Summarize this document",
  "What are key risks?",
  "Extract key insights",
] as const;

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  sending: boolean;
  searchScope: SearchScope;
  onSearchScopeChange: (scope: SearchScope) => void;
}

/** Suggested chips, scope filter, text field, send control. */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  sending,
  searchScope,
  onSearchScopeChange,
}: ChatInputProps) {
  const handleForm = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <div className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Suggested prompts
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((label) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(label)}
            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-accent/40 hover:bg-accent/5 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Search in:
        </span>
        <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900">
          {SEARCH_SCOPES.map((scope) => (
            <button
              key={scope}
              type="button"
              disabled={disabled}
              onClick={() => onSearchScopeChange(scope)}
              className={[
                "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                searchScope === scope
                  ? "bg-white text-accent-dark shadow-sm dark:bg-zinc-800 dark:text-accent-muted"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
              ].join(" ")}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleForm}
        className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <label htmlFor="chat-input" className="sr-only">
          Ask a question
        </label>
        <textarea
          id="chat-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleForm(e);
            }
          }}
          placeholder="Ask anything about your documents…"
          disabled={disabled}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <SendHorizontal className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}
