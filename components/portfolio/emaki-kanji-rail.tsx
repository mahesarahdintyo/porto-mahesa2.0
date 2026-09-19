"use client"

import React from "react"
import { useEmaki } from "./emaki-context"
import { useHanakageTheme } from "./theme-provider"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function EmakiKanjiRail() {
  const { activeSection, sections, goToSection, prevSection, nextSection } = useEmaki()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className="fixed bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none">
      {/* Floating Rail Capsule */}
      <nav
        aria-label="Pemilihan Bagian Kanji"
        className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 rounded-full backdrop-blur-md shadow-xl border transition-all duration-300"
        style={{
          background: isDark ? "rgba(18, 16, 14, 0.85)" : "rgba(251, 245, 234, 0.85)",
          borderColor: "var(--border-color)",
          boxShadow: isDark
            ? "0 10px 30px -8px rgba(0, 0, 0, 0.8), 0 0 15px -3px rgba(122, 111, 163, 0.2)"
            : "0 10px 30px -8px rgba(58, 53, 50, 0.15), 0 0 15px -3px rgba(232, 137, 159, 0.3)",
        }}
      >
        {/* Previous Section Button */}
        <button
          onClick={prevSection}
          disabled={activeSection === 0}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:scale-110 active:scale-95"
          style={{
            color: "var(--text-primary)",
            background: "rgba(0, 0, 0, 0.04)",
          }}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Kanji Number Markers */}
        <div className="relative flex items-center gap-1 sm:gap-3">
          {sections.map((sec, idx) => {
            const isActive = idx === activeSection

            return (
              <button
                key={sec.id}
                onClick={() => goToSection(idx)}
                className={`relative px-2.5 py-1 flex flex-col items-center transition-all duration-300 group ${
                  isActive ? "scale-110" : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Pindah ke bagian ${sec.title}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Kanji Numeral */}
                <span
                  className="text-lg sm:text-xl font-bold tracking-wider transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: isActive
                      ? isDark
                        ? "var(--accent-ghost, #7a6fa3)"
                        : "var(--accent-seal)"
                      : "var(--text-primary)",
                    textShadow: isActive
                      ? isDark
                        ? "0 0 8px rgba(122, 111, 163, 0.6)"
                        : "0 0 8px rgba(232, 137, 159, 0.5)"
                      : "none",
                  }}
                >
                  {sec.kanjiNumber}
                </span>

                {/* Subtitle / Name under Kanji */}
                <span
                  className="text-[9px] sm:text-[10px] uppercase tracking-widest transition-opacity duration-200"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {sec.title}
                </span>

                {/* Active Underline Ink Stroke */}
                {isActive && (
                  <span
                    className="absolute -bottom-1 w-full h-[2.5px] rounded-full animate-pulse transition-all"
                    style={{
                      background: isDark
                        ? "linear-gradient(90deg, transparent, #7a6fa3, transparent)"
                        : "linear-gradient(90deg, transparent, var(--accent-seal), transparent)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Next Section Button */}
        <button
          onClick={nextSection}
          disabled={activeSection === sections.length - 1}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:scale-110 active:scale-95"
          style={{
            color: "var(--text-primary)",
            background: "rgba(0, 0, 0, 0.04)",
          }}
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Subtle Hint */}
      <span
        className="hidden sm:inline-block text-[10px] tracking-wider opacity-40 select-none"
        style={{ fontFamily: "var(--font-heading)", color: "var(--text-muted)" }}
      >
        ← Geser atau gunakan tombol panah untuk membuka gulungan →
      </span>
    </div>
  )
}
