"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

/** Top bar: menu (mobile/tablet), title, theme toggle, avatar (~70px). */
export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 shadow-soft-sm sm:px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 lg:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </button>
        )}
        <h1 className="truncate text-base font-semibold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
          Document AI Assistant
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-sm font-medium text-white shadow-soft-sm"
          title="User"
          aria-hidden
        >
          JD
        </div>
      </div>
    </header>
  );
}
