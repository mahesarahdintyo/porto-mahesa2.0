"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useHanakageTheme } from "./theme-provider"
import { usePortfolioData } from "./portfolio-data-provider"
import { playZenSound } from "@/lib/sound"
import { ThemeToggle } from "./theme-toggle"
import {
  ToriiGateArtifact,
  EmaWallArtifact,
  ChozubachiArtifact,
  OmikujiArtifact,
  ToroLanternArtifact,
} from "./shrine-artifacts"
import { ShrineChamberModal, ShrineId, SHRINES } from "./shrine-chamber-modal"
import { Volume2, VolumeX, Shield, Sparkles, Compass, Sword } from "lucide-react"
import { SensuFanNav } from "./sensu-fan-nav"
import { ShojiIntro } from "./shoji-intro"

/** Reusable plaque label shown below each shrine artifact */
function ArtifactLabel({
  kanji, name, sub, active, isDark,
}: {
  kanji: string; name: string; sub: string; active: boolean; isDark: boolean
}) {
  return (
    <div
      className={`mt-1 sm:mt-2 px-3 py-1 rounded-full border text-center transition-all duration-300 shadow-md backdrop-blur-md ${
        active ? "scale-110 shadow-lg" : "opacity-85"
      }`}
      style={{
        borderColor: active
          ? isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)"
          : "var(--border-color)",
        background: isDark ? "rgba(21,18,16,0.88)" : "rgba(251,245,234,0.92)",
        color: "var(--text-primary)",
      }}
    >
      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
        <span style={{ color: isDark ? "var(--accent-ghost,#7a6fa3)" : "var(--accent-seal)", fontFamily: "var(--font-heading)" }}>
          {kanji}
        </span>
        <span>{name}</span>
      </div>
      <p className="text-[10px] opacity-60 font-mono">{sub}</p>
    </div>
  )
}

export function ShrineCourtyard() {
  const { theme } = useHanakageTheme()
  const { profile, loading } = usePortfolioData()
  const isDark = theme === "yurei"

  const [mounted, setMounted] = useState(false)
  const [activeShrine, setActiveShrine] = useState<ShrineId | null>(null)
  const [hoveredShrine, setHoveredShrine] = useState<ShrineId | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [introKey, setIntroKey] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  const triggerIntroReplay = () => {
    setIntroKey((k) => k + 1)
    setShowIntro(true)
  }

  // Parallax tilt based on cursor
  useEffect(() => {
    setMounted(true)

    function handleMouseMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 15
      setMouseOffset({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleOpenShrine = (id: ShrineId) => {
    if (soundEnabled) {
      if (id === "about") playZenSound("water", isDark)
      else if (id === "projects") playZenSound("wood", isDark)
      else if (id === "skills") playZenSound("paper", isDark)
      else if (id === "contact") playZenSound("chime", isDark)
      else playZenSound("gong", isDark)
    }
    setActiveShrine(id)
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      if (next) playZenSound("chime", isDark)
      return next
    })
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* Top HUD Navigation Bar */}
      <header className="relative z-30 px-4 sm:px-8 pt-5 pb-2 flex items-center justify-between">
        {/* Shrine Garden Crest & Profile Title */}
        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-lg border text-xs font-bold tracking-widest uppercase transition-all shadow-md backdrop-blur-md"
            style={{
              borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              fontFamily: "var(--font-heading)",
            }}
          >
            花影神社
          </div>
          <div>
            <h1
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
            >
              {!loading && (profile?.name || "Hanakage Portfolio")}
            </h1>
            <p className="text-[11px] opacity-60 hidden sm:block font-mono" style={{ color: "var(--text-muted)" }}>
              {isDark ? "幽霊の庭園 ・ Ghost Shrine Courtyard" : "桜の境内 ・ Zen Temple Courtyard"}
            </p>
          </div>
        </div>

        {/* Right HUD Controls: Sound, Theme, Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
            title={soundEnabled ? "Suara Kuil: Aktif" : "Suara Kuil: Hening"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>

          {/* Katana Slash Shoji Intro Replay Button */}
          <button
            onClick={triggerIntroReplay}
            className="p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm group cursor-pointer"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label="Tebas & Buka Pintu Shoji"
            title="Tebas & Buka Pintu Shoji (Intro Sinematik)"
          >
            <Sword className="w-4 h-4 transition-transform group-hover:-rotate-45" />
          </button>

          {/* Admin CMS Portal Link */}
          <Link
            href="/admin"
            className="p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label="Panel Kelola Admin"
            title="Panel Kelola Admin"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Andon Lantern Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Interactive Courtyard Stage (Zen Garden Space) */}
      <main
        className="relative flex-1 w-full overflow-hidden"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
          transition: "transform 0.8s ease-out",
        }}
      >
        {/* Background Zen Garden concentric gravel sand pattern (枯山水 - Karesansui) */}
        <div
          className="absolute inset-8 rounded-3xl opacity-20 pointer-events-none border border-current/10"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 24px, currentColor 24px, currentColor 26px)`,
            maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 80%)",
            color: isDark ? "rgba(122,111,163,0.6)" : "rgba(178,58,46,0.5)",
          }}
          aria-hidden="true"
        />

        {/* 1. CENTER: Gerbang Torii (Beranda / 序章) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-20 flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredShrine("hero")}
          onMouseLeave={() => setHoveredShrine(null)}
          onClick={() => handleOpenShrine("hero")}
        >
          <ToriiGateArtifact isHovered={hoveredShrine === "hero"} />
          <ArtifactLabel
            kanji="壱・始"
            name="Beranda & Profil"
            sub="Gerbang Torii Kuil"
            active={hoveredShrine === "hero"}
            isDark={isDark}
          />
        </div>

        {/* 2. TOP RIGHT: Pohon & Papan Ema (Karya / 卷) */}
        <div
          className="absolute top-[5%] right-[6%] sm:right-[12%] z-10 flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredShrine("projects")}
          onMouseLeave={() => setHoveredShrine(null)}
          onClick={() => handleOpenShrine("projects")}
        >
          <EmaWallArtifact isHovered={hoveredShrine === "projects"} />
          <ArtifactLabel
            kanji="四・卷"
            name="Karya & Proyek"
            sub="Papan Gantung Ema"
            active={hoveredShrine === "projects"}
            isDark={isDark}
          />
        </div>

        {/* 3. BOTTOM LEFT: Bejana Air Chōzubachi (Tentang / 影) */}
        <div
          className="absolute bottom-[5%] left-[6%] sm:left-[12%] z-10 flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredShrine("about")}
          onMouseLeave={() => setHoveredShrine(null)}
          onClick={() => handleOpenShrine("about")}
        >
          <ChozubachiArtifact isHovered={hoveredShrine === "about"} />
          <ArtifactLabel
            kanji="弐・影"
            name="Tentang Saya"
            sub="Bejana Air Batu"
            active={hoveredShrine === "about"}
            isDark={isDark}
          />
        </div>

        {/* 4. TOP LEFT: Kotak Omikuji (Keahlian / 印) */}
        <div
          className="absolute top-[5%] left-[6%] sm:left-[12%] z-10 flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredShrine("skills")}
          onMouseLeave={() => setHoveredShrine(null)}
          onClick={() => handleOpenShrine("skills")}
        >
          <OmikujiArtifact isHovered={hoveredShrine === "skills"} />
          <ArtifactLabel
            kanji="参・印"
            name="Keahlian"
            sub="Kotak Ramalan Omikuji"
            active={hoveredShrine === "skills"}
            isDark={isDark}
          />
        </div>

        {/* 5. BOTTOM RIGHT: Lentera Kasuga Tōrō (Kontak / 結) */}
        <div
          className="absolute bottom-[5%] right-[6%] sm:right-[12%] z-10 flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredShrine("contact")}
          onMouseLeave={() => setHoveredShrine(null)}
          onClick={() => handleOpenShrine("contact")}
        >
          <ToroLanternArtifact isHovered={hoveredShrine === "contact"} />
          <ArtifactLabel
            kanji="五・結"
            name="Hubungi / Pesan"
            sub="Lentera Kasuga Kuno"
            active={hoveredShrine === "contact"}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Bottom Shrine Quick Dock & Exploration Hint */}
      <footer className="relative z-30 px-4 pb-6 flex flex-col items-center gap-2.5 select-none">
        {/* Quick Shrine Selector Pills (For instant jump) */}
        <nav
          aria-label="Peta Cepat Kuil Zen"
          className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 rounded-full border backdrop-blur-md shadow-xl transition-all"
          style={{
            borderColor: "var(--border-color)",
            background: isDark ? "rgba(18, 16, 14, 0.85)" : "rgba(251, 245, 234, 0.85)",
          }}
        >
          {SHRINES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleOpenShrine(s.id)}
              className="group px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95"
              style={{
                border: "1px solid transparent",
                color: "var(--text-primary)",
              }}
              onMouseEnter={() => setHoveredShrine(s.id)}
              onMouseLeave={() => setHoveredShrine(null)}
            >
              <span
                className="font-bold text-xs"
                style={{
                  color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {s.kanji}
              </span>
              <span className="text-xs hidden sm:inline">{s.name}</span>
            </button>
          ))}
        </nav>

        {/* Exploration Helper Hint */}
        <div
          className="flex items-center gap-2 text-xs tracking-wider opacity-60"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-muted)" }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Sentuh atau klik objek kuil di taman untuk membuka rahasianya</span>
          <Compass className="w-3.5 h-3.5 hidden sm:inline" />
        </div>
      </footer>

      {/* Modal / Unfolding Chamber for the selected Shrine */}
      <ShrineChamberModal
        activeShrine={activeShrine}
        onClose={() => setActiveShrine(null)}
        onSelectShrine={(id) => handleOpenShrine(id)}
      />

      {/* Client-only components: rendered only after hydration (mounted = true) */}
      {mounted && (
        <SensuFanNav
          activeShrine={activeShrine}
          onSelectShrine={(id) => handleOpenShrine(id)}
        />
      )}

      {/* Shoji Door Entrance Experience: appears on first visit & on manual replay */}
      {showIntro && (
        <ShojiIntro
          key={introKey}
          onComplete={() => setShowIntro(false)}
        />
      )}
    </div>
  )
}
