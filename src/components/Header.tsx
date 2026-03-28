"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

/** Top bar: title, theme toggle, user avatar placeholder (~70px). */
export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 shadow-soft-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Document AI Assistant
      </h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
