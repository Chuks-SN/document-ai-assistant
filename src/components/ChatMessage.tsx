"use client";

import type { ChatMessageItem } from "@/types/chat";

interface ChatMessageProps {
  item: ChatMessageItem;
}

/** Single bubble: user right (blue), AI left (grey). */
export function ChatMessage({ item }: ChatMessageProps) {
  const isUser = item.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[min(92%,560px)] rounded-xl px-3.5 py-2.5 text-[15px] leading-relaxed sm:max-w-[min(85%,560px)] sm:rounded-2xl sm:px-4",
          isUser
            ? "bg-accent text-white shadow-soft-sm"
            : "border border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words">{item.message}</p>
      </div>
    </div>
  );
}
