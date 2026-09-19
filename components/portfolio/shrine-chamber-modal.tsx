"use client"

import React, { useState, useEffect, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"
import { playZenSound } from "@/lib/sound"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { SkillsSection } from "./skills-section"
import { ProjectsSection } from "./projects-section"
import { ContactSection } from "./contact-section"

export type ShrineId = "hero" | "about" | "skills" | "projects" | "contact"

interface ShrineInfo {
  id: ShrineId
  name: string
  kanji: string
  subtitle: string
  artifactName: string
}

export const SHRINES: ShrineInfo[] = [
  { id: "hero", name: "Beranda", kanji: "始", subtitle: "序章・Hajime", artifactName: "Gerbang Torii" },
  { id: "about", name: "Tentang", kanji: "影", subtitle: "物語・Monogatari", artifactName: "Bejana Chōzubachi" },
  { id: "skills", name: "Keahlian", kanji: "印", subtitle: "印章・Inshō", artifactName: "Kotak Omikuji" },
  { id: "projects", name: "Karya", kanji: "卷", subtitle: "絵巻・Emaki", artifactName: "Papan Ema" },
  { id: "contact", name: "Kontak", kanji: "結", subtitle: "結び・Tegami", artifactName: "Lentera Tōrō" },
]

interface ShrineChamberModalProps {
  activeShrine: ShrineId | null
  onClose: () => void
  onSelectShrine: (id: ShrineId) => void
}

export function ShrineChamberModal({
  activeShrine,
  onClose,
  onSelectShrine,
}: ShrineChamberModalProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const [doorsOpen, setDoorsOpen] = useState(false)
  const isClosingRef = useRef(false)

  // Handle opening Shoji slide animation
  useEffect(() => {
    if (activeShrine) {
      isClosingRef.current = false
      setDoorsOpen(false)
      playZenSound("shoji", isDark)
      const timer = setTimeout(() => {
        setDoorsOpen(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [activeShrine, isDark])

  const handleGracefulClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    setDoorsOpen(false)
    playZenSound("shoji", isDark)
    playZenSound("wood", isDark)
    setTimeout(() => {
      onClose()
      isClosingRef.current = false
    }, 450)
  }

  // Close on ESC key or navigate with Arrow keys
  useEffect(() => {
    if (!activeShrine) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleGracefulClose()
      } else if (e.key === "ArrowRight") {
        const currentIdx = SHRINES.findIndex((s) => s.id === activeShrine)
        if (currentIdx < SHRINES.length - 1) {
          playZenSound("paper", isDark)
          onSelectShrine(SHRINES[currentIdx + 1].id)
        }
      } else if (e.key === "ArrowLeft") {
        const currentIdx = SHRINES.findIndex((s) => s.id === activeShrine)
        if (currentIdx > 0) {
          playZenSound("paper", isDark)
          onSelectShrine(SHRINES[currentIdx - 1].id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeShrine, isDark, onSelectShrine])

  if (!activeShrine) return null

  const currentShrine = SHRINES.find((s) => s.id === activeShrine) || SHRINES[0]
  const currentIdx = SHRINES.findIndex((s) => s.id === activeShrine)

  const handleNext = () => {
    if (currentIdx < SHRINES.length - 1) {
      playZenSound("paper", isDark)
      onSelectShrine(SHRINES[currentIdx + 1].id)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      playZenSound("paper", isDark)
      onSelectShrine(SHRINES[currentIdx - 1].id)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ruang Kuil: ${currentShrine.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 transition-opacity duration-300 backdrop-blur-md"
      style={{
        background: isDark ? "rgba(5, 4, 3, 0.88)" : "rgba(43, 35, 32, 0.6)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleGracefulClose()
        }
      }}
    >
      {/* Scroll Chamber Box */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(122, 111, 163, 0.3)"
            : "0 25px 50px -12px rgba(58, 53, 50, 0.35), 0 0 40px -10px rgba(232, 137, 159, 0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sliding Shoji Panels inside Chamber Window */}
        <div
          className="absolute inset-0 pointer-events-none z-30 flex overflow-hidden"
          aria-hidden="true"
        >
          {/* Left Shoji Panel */}
          <div
            className="w-1/2 h-full transition-transform duration-500 ease-in-out border-r"
            style={{
              transform: doorsOpen ? "translateX(-100%)" : "translateX(0)",
              background: isDark ? "#17131e" : "#fdf6ec",
              borderColor: isDark ? "#3c324c" : "#8e2b20",
              boxShadow: "5px 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(to right, rgba(122,111,163,0.4) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(122,111,163,0.4) 1px, transparent 1px)`
                  : `linear-gradient(to right, rgba(142,43,32,0.3) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(142,43,32,0.3) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />
          </div>

          {/* Right Shoji Panel */}
          <div
            className="w-1/2 h-full transition-transform duration-500 ease-in-out border-l"
            style={{
              transform: doorsOpen ? "translateX(100%)" : "translateX(0)",
              background: isDark ? "#17131e" : "#fdf6ec",
              borderColor: isDark ? "#3c324c" : "#8e2b20",
              boxShadow: "-5px 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(to right, rgba(122,111,163,0.4) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(122,111,163,0.4) 1px, transparent 1px)`
                  : `linear-gradient(to right, rgba(142,43,32,0.3) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(142,43,32,0.3) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />
          </div>
        </div>

        {/* Top Header Rail */}
        <div
          className="relative z-10 flex items-center justify-between px-6 py-4 border-b select-none"
          style={{ borderColor: "var(--border-color)", background: "var(--card-bg)" }}
        >
          {/* Shrine Title & Kanji Badge */}
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg border transition-colors shadow-sm"
              style={{
                fontFamily: "var(--font-heading)",
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                background: isDark ? "rgba(122, 111, 163, 0.15)" : "rgba(178, 58, 46, 0.08)",
              }}
            >
              {currentShrine.kanji}
            </span>
            <div>
              <h2
                className="text-lg font-bold leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
              >
                {currentShrine.name}
              </h2>
              <p className="text-[11px] opacity-60 font-mono tracking-wider" style={{ color: "var(--text-muted)" }}>
                {currentShrine.subtitle} ・ {currentShrine.artifactName}
              </p>
            </div>
          </div>

          {/* Controls: Prev/Next arrow + Hanko Seal Return Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 rounded-lg border transition-all disabled:opacity-20 hover:scale-105 active:scale-95"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              title="Kuil Sebelumnya (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIdx === SHRINES.length - 1}
              className="p-2 rounded-lg border transition-all disabled:opacity-20 hover:scale-105 active:scale-95"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              title="Kuil Selanjutnya (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Traditional Hanko Seal "戻" (Return) Close Button */}
            <button
              onClick={handleGracefulClose}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              style={{
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                background: isDark ? "rgba(122, 111, 163, 0.15)" : "rgba(178, 58, 46, 0.1)",
                color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              }}
              aria-label="Kembali ke Halaman Kuil"
            >
              <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                戻
              </span>
              <span className="text-xs font-semibold tracking-wider">Kembali</span>
              <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Chamber Content Scrollable Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 emaki-scrollable">
          {activeShrine === "hero" && (
            <HeroSection
              onNavigate={(s) => onSelectShrine(s === "projects" ? "projects" : "contact")}
            />
          )}
          {activeShrine === "about" && <AboutSection />}
          {activeShrine === "skills" && <SkillsSection />}
          {activeShrine === "projects" && <ProjectsSection />}
          {activeShrine === "contact" && <ContactSection />}
        </div>

        {/* Bottom footer bar with shrine shortcut tabs */}
        <div
          className="relative z-10 px-4 py-3 border-t flex items-center justify-between text-xs select-none bg-black/5 dark:bg-white/5"
          style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {SHRINES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playZenSound("paper", isDark)
                  onSelectShrine(s.id)
                }}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] whitespace-nowrap cursor-pointer ${
                  s.id === activeShrine
                    ? "font-bold shadow-sm"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  background:
                    s.id === activeShrine
                      ? isDark
                        ? "rgba(122, 111, 163, 0.2)"
                        : "rgba(178, 58, 46, 0.1)"
                      : "transparent",
                  color:
                    s.id === activeShrine
                      ? isDark
                        ? "var(--accent-ghost, #7a6fa3)"
                        : "var(--accent-seal)"
                      : "var(--text-primary)",
                  border:
                    s.id === activeShrine
                      ? `1px solid ${isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)"}`
                      : "1px solid transparent",
                }}
              >
                <span>{s.kanji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <span className="hidden sm:inline opacity-50 text-[10px]">
            Tekan ESC untuk kembali ke taman
          </span>
        </div>
      </div>
    </div>
  )
}
