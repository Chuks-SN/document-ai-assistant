"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput, type SearchScope } from "./ChatInput";
import type { ChatMessageItem } from "@/types/chat";

interface ChatWindowProps {
  messages: ChatMessageItem[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  isTyping: boolean;
  sending: boolean;
  searchScope: SearchScope;
  onSearchScopeChange: (scope: SearchScope) => void;
}

/** Scrollable message list + ChatInput footer; auto-scrolls on new messages. */
export function ChatWindow({
  messages,
  input,
  onInputChange,
  onSend,
  isTyping,
  sending,
  searchScope,
  onSearchScopeChange,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <section
      id="section-chat"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Ask AI
        </h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Query your uploaded documents with natural language.
        </p>
      </div>

      <div className="chat-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
            Start by uploading a document, then ask a question below.
          </p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} item={m} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">Typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
                </span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSend}
        disabled={sending}
        sending={sending}
        searchScope={searchScope}
        onSearchScopeChange={onSearchScopeChange}
      />
    </section>
  );
}
