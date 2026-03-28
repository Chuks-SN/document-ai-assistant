"use client";

/**
 * App shell: orchestrates navigation highlight, uploaded file list, and chat history.
 * API: POST /api/upload (multipart), POST /api/query (JSON).
 */
import { useCallback, useState } from "react";
import { Header } from "./Header";
import { Sidebar, type NavSection } from "./Sidebar";
import { UploadCard } from "./UploadCard";
import { ChatWindow } from "./ChatWindow";
import type { SearchScope } from "./ChatInput";
import { useToast } from "@/context/ToastContext";
import type { ChatMessageItem } from "@/types/chat";
import type { UploadedFileMeta } from "@/types/upload";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Shell: sidebar, header, upload card + chat; wires APIs and local state. */
export function HomeDashboard() {
  const { showToast } = useToast();
  const [nav, setNav] = useState<NavSection>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMeta[]>([]);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchScope, setSearchScope] = useState<SearchScope>("All");

  const onNavigate = useCallback((section: NavSection) => {
    setNav(section);
    if (section === "ask") scrollToId("section-chat");
    else scrollToId("section-upload"); // upload + my documents both focus upload area
  }, []);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || sending) return;

    const userMsg: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: "user",
      message: q,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, searchScope }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        answer?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Query failed");
      }

      const aiMsg: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: "ai",
        message: data.answer || "",
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Query failed", "error");
      const errMsg: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: "ai",
        message:
          "Something went wrong while contacting the assistant. Please try again.",
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  }, [input, sending, searchScope, showToast]);

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar active={nav} onNavigate={onNavigate} />
        <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-8">
            <UploadCard
              files={uploadedFiles}
              onRemoveFile={(id) =>
                setUploadedFiles((list) => list.filter((f) => f.id !== id))
              }
              onUploaded={(items) =>
                setUploadedFiles((list) => [...items, ...list])
              }
              onError={(msg) => showToast(msg, "error")}
              onSuccess={(msg) => showToast(msg, "success")}
            />
            <div className="min-h-[420px] shrink-0 lg:min-h-[480px]">
              <ChatWindow
                messages={messages}
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                isTyping={isTyping}
                sending={sending}
                searchScope={searchScope}
                onSearchScopeChange={setSearchScope}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
