"use client"

import React, { useState, useEffect, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"
import { usePortfolioData } from "./portfolio-data-provider"
import { playZenSound } from "@/lib/sound"
import { X, ArrowUp } from "lucide-react"
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
  const { profile } = usePortfolioData()
  const isDark = theme === "yurei"

  const [doorsOpen, setDoorsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<ShrineId>(activeShrine || "hero")
  const isClosingRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isManualScrollRef = useRef(false)

  // Handle opening Shoji slide animation
  useEffect(() => {
    if (activeShrine) {
      isClosingRef.current = false
      setDoorsOpen(false)
      playZenSound("shoji", isDark)
      const timer = setTimeout(() => {
        setDoorsOpen(true)
      }, 40)
      return () => clearTimeout(timer)
    }
  }, [activeShrine, isDark])

  // Smooth scroll to initial section on entrance
  useEffect(() => {
    if (activeShrine) {
      setActiveSection(activeShrine)
      const timer = setTimeout(() => {
        const el = document.getElementById(`shrine-section-${activeShrine}`)
        if (el) {
          isManualScrollRef.current = true
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          setTimeout(() => {
            isManualScrollRef.current = false
          }, 800)
        }
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [activeShrine])

  const handleGracefulClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    setDoorsOpen(false)
    playZenSound("shoji", isDark)
    playZenSound("wood", isDark)
    setTimeout(() => {
      onClose()
      isClosingRef.current = false
    }, 400)
  }

  // Close on ESC key
  useEffect(() => {
    if (!activeShrine) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleGracefulClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeShrine, isDark])

  // Scroll to section handler
  const scrollToSection = (id: ShrineId) => {
    setActiveSection(id)
    onSelectShrine(id)
    playZenSound("paper", isDark)
    const element = document.getElementById(`shrine-section-${id}`)
    if (element) {
      isManualScrollRef.current = true
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setTimeout(() => {
        isManualScrollRef.current = false
      }, 700)
    }
  }

  // Zero-lag asynchronous ScrollSpy using IntersectionObserver
  useEffect(() => {
    if (!doorsOpen) return
    const container = scrollContainerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrollRef.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-shrine-id") as ShrineId
            if (id) {
              setActiveSection(id)
            }
          }
        })
      },
      {
        root: container,
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
      }
    )

    SHRINES.forEach((s) => {
      const el = document.getElementById(`shrine-section-${s.id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [doorsOpen])

  if (!activeShrine) return null

  const currentIdx = SHRINES.findIndex((s) => s.id === activeSection)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Balairung Kuil Hanakage"
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen overflow-hidden select-none"
      style={{
        background: "var(--bg-base)",
      }}
    >
      {/* Sliding Shoji Panels across the entire viewport */}
      <div
        className="absolute inset-0 pointer-events-none z-40 flex overflow-hidden"
        aria-hidden="true"
      >
        {/* Left Shoji Panel */}
        <div
          className="w-1/2 h-full transition-transform duration-500 ease-in-out border-r"
          style={{
            transform: doorsOpen ? "translateX(-100%)" : "translateX(0)",
            background: isDark ? "#17131e" : "#fdf6ec",
            borderColor: isDark ? "#3c324c" : "#8e2b20",
            boxShadow: "10px 0 35px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="w-full h-full opacity-25"
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
            boxShadow: "-10px 0 35px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="w-full h-full opacity-25"
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

      {/* Main Split Layout: Fixed Sticky Left Navigation + Continuous Scrollable Right Content */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row overflow-hidden">
        {/* ========================================================
            1. DESKTOP STICKY ZEN SIDEBAR (Left Panel)
            ======================================================== */}
        <aside
          className="hidden md:flex flex-col justify-between w-72 lg:w-80 border-r shrink-0 p-6 select-none"
          style={{
            borderColor: "var(--border-color)",
            background: isDark ? "#12100e" : "#fbf5ea",
          }}
        >
          {/* Top Brand / Profile Card (Without UI/UX & Web Dev badge boxes) */}
          <div className="space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest"
              style={{
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                background: isDark ? "rgba(122, 111, 163, 0.12)" : "rgba(178, 58, 46, 0.08)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>花影神社 ・ 本殿</span>
            </div>

            <div>
              <h2
                className="text-2xl font-black uppercase tracking-tight font-serif"
                style={{ color: "var(--text-primary)" }}
              >
                {profile?.name || "Mahesa"}
              </h2>
              <p className="text-xs opacity-60 font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                {profile?.title || "Perancang & Pengembang Antarmuka"}
              </p>
            </div>
          </div>

          {/* Center Navigation List with ScrollSpy */}
          <div className="my-auto py-6 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 px-2 mb-2 flex items-center justify-between">
              <span>NAVIGASI KUIL</span>
              <span>▼</span>
            </div>

            <nav className="space-y-1.5">
              {SHRINES.map((s, idx) => {
                const isActive = activeSection === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "shadow-sm font-semibold"
                        : "opacity-65 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 border-transparent"
                    }`}
                    style={{
                      borderColor: isActive
                        ? isDark
                          ? "var(--accent-ghost, #7a6fa3)"
                          : "var(--accent-seal)"
                        : "transparent",
                      background: isActive
                        ? isDark
                          ? "rgba(122, 111, 163, 0.18)"
                          : "rgba(178, 58, 46, 0.1)"
                        : "transparent",
                      color: "var(--text-primary)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs opacity-50">
                        0{idx + 1}
                      </span>
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs border font-serif"
                        style={{
                          borderColor: isActive
                            ? isDark
                              ? "var(--accent-ghost, #7a6fa3)"
                              : "var(--accent-seal)"
                            : "var(--border-color)",
                          color: isActive
                            ? isDark
                              ? "var(--accent-ghost, #c8b8ff)"
                              : "var(--accent-seal)"
                            : "var(--text-muted)",
                        }}
                      >
                        {s.kanji}
                      </span>
                      <div>
                        <div className="text-xs tracking-wide">
                          {s.name}
                        </div>
                        <p className="text-[10px] font-mono opacity-50 line-clamp-1">
                          {s.artifactName}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isDark
                            ? "var(--accent-ghost, #c8b8ff)"
                            : "var(--accent-seal)",
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom Footer Section: Section Indicator & Return Button */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex items-center justify-between text-xs font-mono opacity-60 px-1">
              <span>BAGIAN</span>
              <span className="font-bold">
                0{currentIdx + 1} / 05
              </span>
            </div>

            <button
              onClick={handleGracefulClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              style={{
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                background: isDark ? "rgba(122, 111, 163, 0.18)" : "rgba(178, 58, 46, 0.12)",
                color: isDark ? "var(--accent-ghost, #c8b8ff)" : "var(--accent-seal)",
              }}
              title="Kembali ke Taman Kuil Luar (ESC)"
            >
              <span className="font-serif font-bold text-sm">戻</span>
              <span>Kembali ke Taman (ESC)</span>
            </button>
          </div>
        </aside>

        {/* ========================================================
            2. MOBILE STICKY TOP NAVIGATION BAR
            ======================================================== */}
        <div
          className="md:hidden sticky top-0 z-30 px-4 py-2.5 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--border-color)", background: isDark ? "#12100e" : "#fbf5ea" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border font-serif"
              style={{
                borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                color: isDark ? "var(--accent-ghost, #c8b8ff)" : "var(--accent-seal)",
              }}
            >
              {SHRINES.find((s) => s.id === activeSection)?.kanji || "始"}
            </span>
            <span className="font-bold text-sm">
              {SHRINES.find((s) => s.id === activeSection)?.name || "Beranda"}
            </span>
          </div>

          {/* Quick horizontal scrollable tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[50%] py-1">
            {SHRINES.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`px-2 py-1 rounded text-xs font-serif transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? "font-bold underline text-amber-500"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {s.kanji}
              </button>
            ))}
          </div>

          <button
            onClick={handleGracefulClose}
            className="p-2 rounded-lg border text-xs font-bold transition-transform active:scale-95 cursor-pointer"
            style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            3. MAIN CONTINUOUS SCROLLABLE CONTENT (Right Panel)
               - Ultra-smooth native scrolling (no forced reflow on scroll)
            ======================================================== */}
        <div
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto emaki-scrollable select-text"
          style={{
            contain: "strict",
            willChange: "scroll-position",
          }}
        >
          <div className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-10 md:py-16 space-y-20 sm:space-y-28">
            {/* 1. HERO SECTION (01 壱・始) */}
            <section
              id="shrine-section-hero"
              data-shrine-id="hero"
              className="scroll-mt-8"
              style={{ contain: "layout style" }}
            >
              <HeroSection onNavigate={(s) => scrollToSection(s)} />
            </section>

            {/* Sacred Divider: 1 -> 2 */}
            <div className="flex items-center justify-center gap-4 opacity-40 select-none">
              <span className="h-px flex-1 bg-current" />
              <span className="font-serif text-xs tracking-widest">壱・始 ➔ 弐・影</span>
              <span className="h-px flex-1 bg-current" />
            </div>

            {/* 2. ABOUT SECTION (02 弐・影) */}
            <section
              id="shrine-section-about"
              data-shrine-id="about"
              className="scroll-mt-8"
              style={{ contain: "layout style" }}
            >
              <AboutSection />
            </section>

            {/* Sacred Divider: 2 -> 3 */}
            <div className="flex items-center justify-center gap-4 opacity-40 select-none">
              <span className="h-px flex-1 bg-current" />
              <span className="font-serif text-xs tracking-widest">弐・影 ➔ 参・印</span>
              <span className="h-px flex-1 bg-current" />
            </div>

            {/* 3. SKILLS SECTION (03 参・印) */}
            <section
              id="shrine-section-skills"
              data-shrine-id="skills"
              className="scroll-mt-8"
              style={{ contain: "layout style" }}
            >
              <SkillsSection />
            </section>

            {/* Sacred Divider: 3 -> 4 */}
            <div className="flex items-center justify-center gap-4 opacity-40 select-none">
              <span className="h-px flex-1 bg-current" />
              <span className="font-serif text-xs tracking-widest">参・印 ➔ 四・卷</span>
              <span className="h-px flex-1 bg-current" />
            </div>

            {/* 4. PROJECTS SECTION (04 四・卷) */}
            <section
              id="shrine-section-projects"
              data-shrine-id="projects"
              className="scroll-mt-8"
              style={{ contain: "layout style" }}
            >
              <ProjectsSection />
            </section>

            {/* Sacred Divider: 4 -> 5 */}
            <div className="flex items-center justify-center gap-4 opacity-40 select-none">
              <span className="h-px flex-1 bg-current" />
              <span className="font-serif text-xs tracking-widest">四・卷 ➔ 五・結</span>
              <span className="h-px flex-1 bg-current" />
            </div>

            {/* 5. CONTACT SECTION (05 五・結) */}
            <section
              id="shrine-section-contact"
              data-shrine-id="contact"
              className="scroll-mt-8 pb-16"
              style={{ contain: "layout style" }}
            >
              <ContactSection />
            </section>

            {/* Chamber Bottom Footer */}
            <div
              className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60 font-mono select-none"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p>© 2026 {profile?.name || "Mahesa Rahdintyo"} — 花影神社</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:underline hover:opacity-100 cursor-pointer flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Kembali ke Puncak Kuil</span>
                </button>
                <span>・</span>
                <button
                  onClick={handleGracefulClose}
                  className="hover:underline hover:opacity-100 cursor-pointer font-bold"
                  style={{
                    color: isDark ? "var(--accent-ghost, #c8b8ff)" : "var(--accent-seal)",
                  }}
                >
                  Keluar ke Taman Kuil ⛩️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
