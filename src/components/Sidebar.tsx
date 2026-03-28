"use client";

import { FileQuestion, FolderOpen, UploadCloud } from "lucide-react";

export type NavSection = "upload" | "ask" | "documents";

interface SidebarProps {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
}

const items: { id: NavSection; label: string; icon: typeof UploadCloud }[] = [
  { id: "upload", label: "Upload Documents", icon: UploadCloud },
  { id: "ask", label: "Ask AI", icon: FileQuestion },
  { id: "documents", label: "My Documents", icon: FolderOpen },
];

/** Left navigation (~220px) with Lucide icons and active highlight. */
export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="flex flex-col gap-1 p-4 pt-6">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={[
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition",
                isActive
                  ? "bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-muted"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
              ].join(" ")}
            >
              <Icon
                className="h-5 w-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
