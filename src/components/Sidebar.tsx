"use client";

import { FileQuestion, FolderOpen, UploadCloud, X } from "lucide-react";
import { useEffect } from "react";

export type NavSection = "upload" | "ask" | "documents";

const items: { id: NavSection; label: string; icon: typeof UploadCloud }[] = [
  { id: "upload", label: "Upload Documents", icon: UploadCloud },
  { id: "ask", label: "Ask AI", icon: FileQuestion },
  { id: "documents", label: "My Documents", icon: FolderOpen },
];

function NavList({
  active,
  onSelect,
  className = "",
}: {
  active: NavSection;
  onSelect: (id: NavSection) => void;
  className?: string;
}) {
  return (
    <nav className={`flex flex-col gap-1 ${className}`}>
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={[
              "flex w-full min-h-[44px] items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.99] sm:min-h-0",
              isActive
                ? "bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-muted"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
  /** Mobile / tablet slide-over; ignored on large screens. */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/** Desktop: fixed left rail. &lt; lg: off-canvas drawer with backdrop. */
export function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileClose]);

  const handleSelect = (id: NavSection) => {
    onNavigate(id);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile & tablet drawer */}
      <div className="fixed inset-0 z-40 lg:hidden" aria-hidden={!mobileOpen}>
        <button
          type="button"
          className={[
            "absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px] transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={onMobileClose}
          aria-label="Close menu"
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="nav-drawer-title"
          className={[
            "absolute left-0 top-0 flex h-full w-[min(288px,88vw)] max-w-full flex-col border-r border-zinc-200 bg-white shadow-soft transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 px-4 dark:border-zinc-800">
            <span
              id="nav-drawer-title"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Menu
            </span>
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            <NavList active={active} onSelect={handleSelect} />
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
        <NavList
          active={active}
          onSelect={(id) => onNavigate(id)}
          className="p-4 pt-6"
        />
      </aside>
    </>
  );
}
