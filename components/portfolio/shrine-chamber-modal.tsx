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
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen overflow-hidden transition-opacity duration-300"
      style={{
        background: isDark ? "#0a0908" : "#f5efe6",
      }}
    >
      {/* Scroll Chamber - Fullscreen Layout */}
      <div
        className="relative w-full h-full flex flex-col overflow-hidden transition-all duration-300"
        style={{
          background: "var(--card-bg)",
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
              boxShadow: "5px 0 25px rgba(0,0,0,0.4)",
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
              boxShadow: "-5px 0 25px rgba(0,0,0,0.4)",
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
          className="relative z-20 flex items-center justify-between px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 border-b select-none backdrop-blur-md shrink-0"
          style={{ borderColor: "var(--border-color)", background: "var(--card-bg)" }}
        >
          {/* Shrine Title & Kanji Badge */}
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl border transition-colors shadow-sm"
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
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg sm:text-xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
                >
                  {currentShrine.name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono border opacity-75 hidden sm:inline-block"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {currentShrine.artifactName}
                </span>
              </div>
              <p className="text-xs opacity-60 font-mono tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>
                {currentShrine.subtitle}
              </p>
            </div>
          </div>

          {/* Controls: Prev/Next arrow + Hanko Seal Return Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border transition-all disabled:opacity-20 hover:scale-105 active:scale-95 flex items-center gap-1 text-xs"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              title="Kuil Sebelumnya (←)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">Sebelumnya</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIdx === SHRINES.length - 1}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border transition-all disabled:opacity-20 hover:scale-105 active:scale-95 flex items-center gap-1 text-xs"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              title="Kuil Selanjutnya (→)"
            >
              <span className="hidden md:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Traditional Hanko Seal "戻" (Return) Close Button */}
            <button
              onClick={handleGracefulClose}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer ml-1 sm:ml-2"
              style={{
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                background: isDark ? "rgba(122, 111, 163, 0.18)" : "rgba(178, 58, 46, 0.12)",
                color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              }}
              aria-label="Kembali ke Halaman Kuil (Tutup)"
              title="Kembali ke Halaman Kuil (ESC)"
            >
              <span className="font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>
                戻
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider">Kembali</span>
              <X className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Chamber Content Scrollable Area */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 emaki-scrollable [&_.hanakage-section]:py-4 [&_.hanakage-section]:sm:py-8 [&_.hanakage-section]:px-0 [&_.hanakage-section]:max-w-none">
          <div className="max-w-5xl xl:max-w-6xl mx-auto w-full">
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
        </div>

        {/* Bottom footer bar with shrine shortcut tabs */}
        <div
          className="relative z-20 px-4 sm:px-8 md:px-12 py-3 border-t flex items-center justify-between text-xs select-none bg-black/5 dark:bg-white/5 backdrop-blur-md shrink-0"
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
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                  s.id === activeShrine
                    ? "font-bold shadow-sm scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  background:
                    s.id === activeShrine
                      ? isDark
                        ? "rgba(122, 111, 163, 0.25)"
                        : "rgba(178, 58, 46, 0.15)"
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
                <span className="font-bold">{s.kanji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline opacity-60 text-xs font-mono">
              Gunakan ← → untuk navigasi antar kuil
            </span>
            <button
              onClick={handleGracefulClose}
              className="text-xs hover:underline opacity-70 hover:opacity-100 flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>[ESC] Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
