"use client"

import React from "react"
import { useEmaki } from "./emaki-context"
import { useHanakageTheme } from "./theme-provider"
import { ThemeToggle } from "./theme-toggle"

export function EmakiTopBar() {
  const { activeSection, sections } = useEmaki()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const current = sections[activeSection]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none select-none">
      {/* Brand & Active Scroll Chapter */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div
          className="px-2.5 py-1 rounded border text-xs font-bold tracking-widest uppercase transition-colors"
          style={{
            borderColor: isDark ? "var(--border-color)" : "var(--accent-seal)",
            color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
            background: isDark ? "rgba(21, 18, 16, 0.7)" : "rgba(251, 245, 234, 0.7)",
            backdropFilter: "blur(6px)",
            fontFamily: "var(--font-heading)",
          }}
        >
          花影
        </div>
        <div
          className="hidden sm:flex items-center gap-2 text-xs tracking-wider opacity-80"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          <span className="font-semibold">{current.numeral}</span>
          <span className="opacity-40">/</span>
          <span>05</span>
          <span className="opacity-40">・</span>
          <span>
            {current.subtitle} ({current.title})
          </span>
        </div>
      </div>

      {/* Right Controls: Emaki Counter Stamp + Theme Toggle */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Woodblock Counter Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs shadow-sm transition-all"
          style={{
            borderColor: "var(--border-color)",
            background: isDark ? "rgba(21, 18, 16, 0.7)" : "rgba(251, 245, 234, 0.7)",
            backdropFilter: "blur(8px)",
            fontFamily: "var(--font-heading)",
          }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)" }}
          >
            {current.kanjiNumber}
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-70">五</span>
          <span className="text-[10px] tracking-widest px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase">
            {current.title}
          </span>
        </div>

        {/* The Andon Lantern Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
