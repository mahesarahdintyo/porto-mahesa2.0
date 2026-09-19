"use client"

import React from "react"
import { useEmaki } from "./emaki-context"
import { useHanakageTheme } from "./theme-provider"
import { Home, User, Sparkles, Layers, Send } from "lucide-react"

const ICONS = [Home, User, Sparkles, Layers, Send]

export function EmakiNavDock() {
  const { activeSection, sections, goToSection } = useEmaki()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <aside
      aria-label="Navigasi Halaman Gulungan Emaki"
      className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 select-none"
    >
      {/* Decorative vertical thread / cord */}
      <div
        className="w-[1.5px] h-8 sm:h-12 opacity-30 transition-colors"
        style={{ background: isDark ? "var(--accent-ink)" : "var(--accent-seal)" }}
        aria-hidden="true"
      />

      {/* Floating Hanko Stamp Buttons */}
      <nav className="flex flex-col gap-2.5 p-1.5 rounded-2xl backdrop-blur-md bg-black/5 dark:bg-white/5 border border-current/10 shadow-lg">
        {sections.map((sec, idx) => {
          const isActive = idx === activeSection
          const Icon = ICONS[idx]

          return (
            <button
              key={sec.id}
              onClick={() => goToSection(idx)}
              className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? "scale-110 shadow-md"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
              style={{
                background: isActive
                  ? isDark
                    ? "rgba(122, 111, 163, 0.25)"
                    : "rgba(178, 58, 46, 0.12)"
                  : "transparent",
                border: isActive
                  ? `2px solid ${isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)"}`
                  : "1px solid var(--border-color)",
                boxShadow: isActive
                  ? isDark
                    ? "0 0 16px -2px rgba(122, 111, 163, 0.6)"
                    : "0 0 16px -2px rgba(232, 137, 159, 0.6)"
                  : "none",
                color: isActive
                  ? isDark
                    ? "var(--accent-ghost, #7a6fa3)"
                    : "var(--accent-seal)"
                  : "var(--text-primary)",
              }}
              aria-label={`Buka halaman ${sec.title} (${sec.subtitle})`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Kanji Watermark behind icon */}
              <span
                className="absolute text-lg sm:text-xl font-serif pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ fontFamily: "var(--font-heading)" }}
                aria-hidden="true"
              >
                {sec.kanji}
              </span>

              {/* Foreground Icon */}
              <Icon className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />

              {/* Tooltip Ribbon on hover (appears to the right) */}
              <div
                className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs flex items-center gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-md backdrop-blur-md"
                style={{
                  background: isDark ? "rgba(21, 18, 16, 0.95)" : "rgba(251, 245, 234, 0.95)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)" }}
                >
                  {sec.kanjiNumber}・{sec.subtitle}
                </span>
                <span className="opacity-80">| {sec.title}</span>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Decorative vertical thread / cord */}
      <div
        className="w-[1.5px] h-8 sm:h-12 opacity-30 transition-colors"
        style={{ background: isDark ? "var(--accent-ink)" : "var(--accent-seal)" }}
        aria-hidden="true"
      />
    </aside>
  )
}
