import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PrefsSheet } from "@/components/prefs-sheet";

export function AppHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 rounded-lg px-1 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-7 place-items-center rounded-md bg-accent text-accent-fg" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6.5c3-1.2 6-1.2 8 0v12c-2-1.2-5-1.2-8 0v-12z" />
              <path d="M12 6.5c2-1.2 5-1.2 8 0v12c-3-1.2-6-1.2-8 0" />
            </svg>
          </span>
          <span className="text-sm font-medium tracking-tight">Learn</span>
        </Link>
        <div className="flex items-center gap-1">
          {trailing}
          <PrefsSheet />
        </div>
      </div>
    </header>
  );
}
