"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { Volume2, VolumeX, Shield, Sparkles, Sword } from "lucide-react"
import { ShojiIntro } from "./shoji-intro"

/** CelestialConstellation: Japanese mystical star map (Seishuku 星宿) connecting sacred shrines */
function CelestialConstellation({
  hoveredShrine,
  isDark,
}: {
  hoveredShrine: ShrineId | null
  isDark: boolean
}) {
  const activeColor = isDark ? "#c8b8ff" : "#b23a2e"
  const starGlow = isDark ? "rgba(200, 184, 255, 0.9)" : "rgba(178, 58, 46, 0.9)"

  const constellations = [
    {
      id: "skills" as ShrineId,
      // Torii center -> Omikuji (top-left)
      d: "M 480,250 Q 330,200 190,120",
      stars: [
        { cx: 395, cy: 215, delay: "0s" },
        { cx: 310, cy: 175, delay: "0.6s" },
        { cx: 235, cy: 140, delay: "1.2s" },
      ],
    },
    {
      id: "projects" as ShrineId,
      // Torii center -> Ema wall (top-right)
      d: "M 520,250 Q 670,200 810,120",
      stars: [
        { cx: 605, cy: 215, delay: "0.2s" },
        { cx: 690, cy: 175, delay: "0.8s" },
        { cx: 765, cy: 140, delay: "1.4s" },
      ],
    },
    {
      id: "about" as ShrineId,
      // Torii center -> Chozubachi (bottom-left)
      d: "M 480,290 Q 330,370 190,470",
      stars: [
        { cx: 395, cy: 335, delay: "0.3s" },
        { cx: 310, cy: 390, delay: "0.9s" },
        { cx: 235, cy: 440, delay: "1.5s" },
      ],
    },
    {
      id: "contact" as ShrineId,
      // Torii center -> Toro Lantern (bottom-right)
      d: "M 520,290 Q 670,370 810,470",
      stars: [
        { cx: 605, cy: 335, delay: "0.4s" },
        { cx: 690, cy: 390, delay: "1.0s" },
        { cx: 765, cy: 440, delay: "1.6s" },
      ],
    },
  ]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="celestial-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Central Torii Sacred Star Anchor - only visible when hovering the Torii (hero) itself */}
      {hoveredShrine === "hero" && (
        <g transform="translate(500, 270)">
          <circle
            cx="0"
            cy="0"
            r="4.5"
            fill={activeColor}
            fillOpacity="0.95"
            filter="url(#celestial-glow)"
            className="hanakage-star-twinkle"
          />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>
      )}

      {constellations.map((c) => {
        // When Torii (hero) is hovered → show all 4 constellations as a radial burst
        // When an outer shrine is hovered → only show that shrine's own ray
        const isActive =
          hoveredShrine === "hero" || hoveredShrine === c.id
        if (!isActive) return null

        return (
          <g key={c.id} className="transition-opacity duration-500">
            {/* Hairline starlight thread */}
            <path
              d={c.d}
              fill="none"
              stroke={activeColor}
              strokeWidth="1.2"
              strokeDasharray="5 7"
              strokeOpacity="0.85"
              className="hanakage-constellation-line"
              style={{
                filter: isDark ? "drop-shadow(0 0 4px #c8b8ff)" : "drop-shadow(0 0 4px #b23a2e)",
              }}
            />

            {/* Micro starlight sparks along the constellation ray */}
            {c.stars.map((s, idx) => (
              <g
                key={idx}
                transform={`translate(${s.cx}, ${s.cy})`}
                className="hanakage-star-twinkle"
                style={{
                  animationDelay: s.delay,
                  transformOrigin: "center",
                  color: starGlow,
                }}
              >
                {/* 4-point Diamond Star Sparkle */}
                <path
                  d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z"
                  fill={activeColor}
                  fillOpacity="0.95"
                  filter="url(#celestial-glow)"
                />
                <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
              </g>
            ))}


          </g>
        )
      })}
    </svg>
  )
}

/** Reusable plaque label shown below each shrine artifact */
function ArtifactLabel({
  kanji, name, sub, active, isDark,
}: {
  kanji: string; name: string; sub: string; active: boolean; isDark: boolean
}) {
  return (
    <div
      className={`mt-1 sm:mt-2 px-3.5 py-1.5 rounded-full border text-center transition-all duration-300 backdrop-blur-md ${
        active
          ? "scale-110 shadow-xl"
          : "opacity-85 scale-100 shadow-sm"
      }`}
      style={{
        borderColor: active
          ? isDark ? "var(--accent-ghost, #9b8fd4)" : "var(--accent-seal)"
          : "var(--border-color)",
        background: active
          ? isDark ? "rgba(122, 111, 163, 0.28)" : "rgba(178, 58, 46, 0.18)"
          : isDark ? "rgba(21,18,16,0.85)" : "rgba(251,245,234,0.9)",
        boxShadow: active
          ? isDark
            ? "0 0 20px rgba(155, 143, 212, 0.45)"
            : "0 0 20px rgba(178, 58, 46, 0.35)"
          : undefined,
        color: "var(--text-primary)",
      }}
    >
      <div className="flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm">
        <span
          className="px-1 py-0.5 rounded text-[11px]"
          style={{
            background: active
              ? isDark ? "rgba(155, 143, 212, 0.25)" : "rgba(178, 58, 46, 0.15)"
              : "transparent",
            color: isDark ? "var(--accent-ghost,#c8b8ff)" : "var(--accent-seal)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {kanji}
        </span>
        <span className="tracking-wide">{name}</span>
      </div>
      <p className="text-[10px] opacity-60 font-mono mt-0.5">{sub}</p>
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
  const activeShrineRef = useRef(activeShrine)
  activeShrineRef.current = activeShrine

  const triggerIntroReplay = () => {
    setIntroKey((k) => k + 1)
    setShowIntro(true)
  }

  // Parallax tilt based on cursor (paused when chamber modal is active to ensure silky smooth 120 FPS scrolling)
  useEffect(() => {
    setMounted(true)

    function handleMouseMove(e: MouseEvent) {
      if (activeShrineRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 15
      setMouseOffset({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleHoverShrine = (id: ShrineId | null) => {
    setHoveredShrine(id)
    if (id && soundEnabled) {
      if (id === "hero") playZenSound("wood", isDark)
      else if (id === "about") playZenSound("water", isDark)
      else if (id === "skills") playZenSound("bamboo", isDark)
      else if (id === "projects") playZenSound("chime", isDark)
      else if (id === "contact") playZenSound("flame", isDark)
    }
  }

  const handleOpenShrine = (id: ShrineId) => {
    if (soundEnabled) {
      if (id === "about") playZenSound("water", isDark)
      else if (id === "projects") playZenSound("wood", isDark)
      else if (id === "skills") playZenSound("bamboo", isDark)
      else if (id === "contact") playZenSound("flame", isDark)
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

        {/* CelestialConstellation: Japanese mystical star map (Seishuku 星宿) */}
        <CelestialConstellation hoveredShrine={hoveredShrine} isDark={isDark} />

        {/* 1. CENTER: Gerbang Torii (Beranda / 序章) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-20 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("hero")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("hero")}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "hero" && (
            <div
              className="absolute -inset-10 sm:-inset-14 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.5"
                  strokeDasharray="420 70"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <ToriiGateArtifact isHovered={hoveredShrine === "hero"} />
          </div>
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
          className="absolute top-[5%] right-[6%] sm:right-[12%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("projects")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("projects")}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "projects" && (
            <div
              className="absolute -inset-8 sm:-inset-12 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
                <circle
                  cx="100"
                  cy="100"
                  r="76"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.5"
                  strokeDasharray="400 80"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <EmaWallArtifact isHovered={hoveredShrine === "projects"} />
          </div>
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
          className="absolute bottom-[5%] left-[6%] sm:left-[12%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("about")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("about")}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "about" && (
            <div
              className="absolute -inset-8 sm:-inset-12 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
                <circle
                  cx="100"
                  cy="100"
                  r="76"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.5"
                  strokeDasharray="400 80"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <ChozubachiArtifact isHovered={hoveredShrine === "about"} />
          </div>
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
          className="absolute top-[5%] left-[6%] sm:left-[12%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("skills")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("skills")}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "skills" && (
            <div
              className="absolute -inset-8 sm:-inset-12 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
                <circle
                  cx="100"
                  cy="100"
                  r="76"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.5"
                  strokeDasharray="400 80"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <OmikujiArtifact isHovered={hoveredShrine === "skills"} />
          </div>
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
          className="absolute bottom-[5%] right-[6%] sm:right-[12%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("contact")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("contact")}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "contact" && (
            <div
              className="absolute -inset-8 sm:-inset-12 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
                <circle
                  cx="100"
                  cy="100"
                  r="76"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.5"
                  strokeDasharray="400 80"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <ToroLanternArtifact isHovered={hoveredShrine === "contact"} />
          </div>
          <ArtifactLabel
            kanji="五・結"
            name="Hubungi / Pesan"
            sub="Lentera Kasuga Kuno"
            active={hoveredShrine === "contact"}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Zen Garden Ambient Exploration Footer */}
      <footer className="relative z-30 px-4 pb-6 flex flex-col items-center gap-2 select-none pointer-events-none">
        <div
          className="flex items-center gap-2 text-xs tracking-widest px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 pointer-events-auto shadow-md"
          style={{
            borderColor: hoveredShrine
              ? isDark
                ? "var(--accent-ghost, #9b8fd4)"
                : "var(--accent-seal)"
              : "var(--border-color)",
            background: isDark ? "rgba(18, 16, 14, 0.85)" : "rgba(251, 245, 234, 0.85)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          <Sparkles
            className="w-3.5 h-3.5 animate-pulse"
            style={{ color: isDark ? "#c8b8ff" : "var(--accent-seal)" }}
          />
          <span>
            {hoveredShrine
              ? `Rasi Bintang Terhubung: ${SHRINES.find((s) => s.id === hoveredShrine)?.name} (Klik untuk masuk)`
              : "Sentuh artefak kuil untuk menghubungkan rasi bintang Hanakage"}
          </span>
        </div>
      </footer>

      {/* Modal / Unfolding Chamber for the selected Shrine */}
      <ShrineChamberModal
        activeShrine={activeShrine}
        onClose={() => setActiveShrine(null)}
        onSelectShrine={(id) => handleOpenShrine(id)}
      />

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
