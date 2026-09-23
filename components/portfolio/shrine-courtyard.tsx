"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
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
  SteppingStonesArtifact,
} from "./shrine-artifacts"
import { ShrineChamberModal, ShrineId, SHRINES } from "./shrine-chamber-modal"
import { Volume2, VolumeX, Shield, Sparkles, Sword } from "lucide-react"
import { ShojiIntro } from "./shoji-intro"

interface ConstellationProps {
  hoveredShrine: ShrineId | null
  isDark: boolean
  mainRef: React.RefObject<HTMLDivElement | null>
  anchors: Record<ShrineId, React.RefObject<HTMLDivElement | null>>
}

function getBezierPoint(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number
) {
  const inv = 1 - t
  return {
    x: inv * inv * x0 + 2 * inv * t * cx + t * t * x1,
    y: inv * inv * y0 + 2 * inv * t * cy + t * t * y1,
  }
}

const CONSTELLATION_CONFIG: Array<{
  id: ShrineId
  curveOffset: { x: number; y: number }
}> = [
  { id: "skills", curveOffset: { x: -25, y: -30 } },
  { id: "projects", curveOffset: { x: 25, y: -30 } },
  { id: "about", curveOffset: { x: -35, y: 20 } },
  { id: "contact", curveOffset: { x: 35, y: 20 } },
  { id: "experience", curveOffset: { x: -20, y: 10 } },
]

/** CelestialConstellation: Japanese mystical star map (Seishuku 星宿) connecting sacred shrines dynamically */
function CelestialConstellation({
  hoveredShrine,
  isDark,
  mainRef,
  anchors,
}: ConstellationProps) {
  const activeColor = isDark ? "#c8b8ff" : "#b23a2e"
  const starGlow = isDark ? "rgba(200, 184, 255, 0.9)" : "rgba(178, 58, 46, 0.9)"

  const pathRefs = useRef<Record<string, SVGPathElement | null>>({})
  const starRefs = useRef<Record<string, (SVGGElement | null)[]>>({})
  const heroStarRef = useRef<SVGGElement | null>(null)
  const targetStarRefs = useRef<Record<string, SVGGElement | null>>({})

  useEffect(() => {
    let animId: number
    const update = () => {
      const mainEl = mainRef.current
      const heroEl = anchors.hero.current
      if (mainEl && heroEl) {
        const mainRect = mainEl.getBoundingClientRect()
        const heroRect = heroEl.getBoundingClientRect()
        const hx = heroRect.left + heroRect.width / 2 - mainRect.left
        const hy = heroRect.top + heroRect.height / 2 - mainRect.top

        if (heroStarRef.current) {
          heroStarRef.current.setAttribute("transform", `translate(${hx.toFixed(1)}, ${hy.toFixed(1)})`)
        }

        CONSTELLATION_CONFIG.forEach(({ id, curveOffset }) => {
          const targetEl = anchors[id]?.current
          const pathEl = pathRefs.current[id]
          if (!targetEl || !pathEl) return

          const targetRect = targetEl.getBoundingClientRect()
          const tx = targetRect.left + targetRect.width / 2 - mainRect.left
          const ty = targetRect.top + targetRect.height / 2 - mainRect.top

          const cx = (hx + tx) / 2 + curveOffset.x
          const cy = (hy + ty) / 2 + curveOffset.y

          pathEl.setAttribute(
            "d",
            `M ${hx.toFixed(1)},${hy.toFixed(1)} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`
          )

          const sList = starRefs.current[id]
          if (sList) {
            const tValues = [0.28, 0.52, 0.76]
            tValues.forEach((t, i) => {
              const el = sList[i]
              if (el) {
                const pt = getBezierPoint(hx, hy, cx, cy, tx, ty, t)
                el.setAttribute("transform", `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`)
              }
            })
          }

          const tStar = targetStarRefs.current[id]
          if (tStar) {
            tStar.setAttribute("transform", `translate(${tx.toFixed(1)}, ${ty.toFixed(1)})`)
          }
        })
      }
      animId = requestAnimationFrame(update)
    }

    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [anchors, mainRef])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
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

      {/* Central Torii Sacred Star Anchor */}
      <g
        ref={heroStarRef}
        className="hanakage-star-twinkle transition-opacity duration-300"
        style={{ opacity: hoveredShrine ? 1 : 0.4 }}
      >
        <circle
          cx="0"
          cy="0"
          r="4.5"
          fill={activeColor}
          fillOpacity="0.95"
          filter="url(#celestial-glow)"
        />
        <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
      </g>

      {CONSTELLATION_CONFIG.map((c) => {
        const isActive = hoveredShrine === "hero" || hoveredShrine === c.id

        return (
          <g key={c.id} className="transition-opacity duration-300">
            {/* Sacred Constellation Thread */}
            <path
              ref={(el) => {
                pathRefs.current[c.id] = el
              }}
              fill="none"
              stroke={activeColor}
              strokeWidth={isActive ? "1.6" : "1.0"}
              strokeDasharray={isActive ? "5 6" : "3 6"}
              strokeOpacity={isActive ? "0.9" : "0.22"}
              className="hanakage-constellation-line transition-all duration-300"
              style={{
                filter: isActive
                  ? isDark
                    ? "drop-shadow(0 0 5px #c8b8ff)"
                    : "drop-shadow(0 0 5px #b23a2e)"
                  : "none",
              }}
            />

            {/* Micro Starlight Sparks Along Thread */}
            {[0, 1, 2].map((idx) => (
              <g
                key={idx}
                ref={(el) => {
                  if (!starRefs.current[c.id]) starRefs.current[c.id] = []
                  starRefs.current[c.id][idx] = el
                }}
                className="hanakage-star-twinkle transition-opacity duration-300"
                style={{
                  animationDelay: `${idx * 0.4}s`,
                  transformOrigin: "center",
                  color: starGlow,
                  opacity: isActive ? 1 : 0.35,
                }}
              >
                <path
                  d="M 0,-4.5 Q 0,0 4.5,0 Q 0,0 0,4.5 Q 0,0 -4.5,0 Q 0,0 0,-4.5 Z"
                  fill={activeColor}
                  fillOpacity={isActive ? 0.95 : 0.4}
                  filter="url(#celestial-glow)"
                />
                <circle cx="0" cy="0" r="1.2" fill="#ffffff" opacity={isActive ? 1 : 0.6} />
              </g>
            ))}

            {/* Target Sacred Star Anchor */}
            <g
              ref={(el) => {
                targetStarRefs.current[c.id] = el
              }}
              className="hanakage-star-twinkle transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              <circle cx="0" cy="0" r="3.5" fill={activeColor} filter="url(#celestial-glow)" />
              <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/** Ambient floating particles: sakura petals (light) or onibi wisps (dark) */
function CourtyardAmbientParticles({
  isDark,
  mouseOffset,
}: {
  isDark: boolean
  mouseOffset: { x: number; y: number }
}) {
  const [poppedIds, setPoppedIds] = useState<number[]>([])

  interface PetalItem {
    id: number
    top: string
    left?: string
    right?: string
    dur: string
    delay: string
    scale: number
    driftX: number
    driftY: number
  }

  const petals: PetalItem[] = [
    { id: 1, top: "12%",  left: "18%",  dur: "9s",   delay: "0s",   scale: 0.9, driftX: 35, driftY: 120 },
    { id: 2, top: "8%",   right: "22%", dur: "11s",  delay: "2s",   scale: 1.1, driftX: -40, driftY: 140 },
    { id: 3, top: "55%",  left: "8%",   dur: "8.5s", delay: "1.5s", scale: 0.8, driftX: 50, driftY: 90 },
    { id: 4, top: "60%",  right: "12%", dur: "10s",  delay: "3s",   scale: 1.0, driftX: -30, driftY: 110 },
    { id: 5, top: "30%",  left: "35%",  dur: "12s",  delay: "0.8s", scale: 0.85, driftX: 25, driftY: 130 },
    { id: 6, top: "25%",  right: "38%", dur: "9.5s", delay: "4s",   scale: 1.05, driftX: -45, driftY: 100 },
    { id: 7, top: "75%",  left: "28%",  dur: "8s",   delay: "2.5s", scale: 0.92, driftX: 40, driftY: 80 },
    { id: 8, top: "80%",  right: "30%", dur: "11s",  delay: "1s",   scale: 0.88, driftX: -35, driftY: 90 },
  ]

  const handlePop = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    playZenSound("bamboo", isDark)
    setPoppedIds((p) => [...p, id])
    setTimeout(() => setPoppedIds((p) => p.filter((x) => x !== id)), 3000)
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden">
      {isDark ? (
        /* ── Dark: Interactive Onibi Spirit Wisps ── */
        <>
          {[
            { left: "14%", top: "32%", size: 14, dur: "4.5s", delay: "0s",   driftMul: 22, color: "#c8b8ff", glow: "rgba(200,184,255,0.85)" },
            { left: "78%", top: "26%", size: 11, dur: "5.2s", delay: "1.2s", driftMul: -18, color: "#a78bfa", glow: "rgba(167,139,250,0.8)" },
            { left: "22%", top: "68%", size: 10, dur: "6.0s", delay: "0.6s", driftMul: 15,  color: "#818cf8", glow: "rgba(129,140,248,0.75)" },
            { left: "82%", top: "62%", size: 13, dur: "4.8s", delay: "2.0s", driftMul: -20, color: "#c8b8ff", glow: "rgba(200,184,255,0.8)" },
          ].map((wisp, i) => (
            <div
              key={i}
              className="absolute rounded-full cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-150 active:scale-125"
              style={{
                left: wisp.left,
                top: wisp.top,
                width: wisp.size,
                height: wisp.size,
                background: wisp.color,
                boxShadow: `0 0 18px ${wisp.glow}`,
                filter: "blur(1.5px)",
                transform: `translate(${mouseOffset.x * wisp.driftMul * 0.05}px, ${mouseOffset.y * wisp.driftMul * 0.04}px)`,
                animation: `hanakage-courtyard-wisp ${wisp.dur} ease-in-out ${wisp.delay} infinite`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                playZenSound("flame", true)
              }}
              title="Onibi Spirit Wisp"
            />
          ))}
        </>
      ) : (
        /* ── Light: Interactive Drifting Sakura Petals ── */
        <>
          {petals.map((petal) => {
            if (poppedIds.includes(petal.id)) return null
            const pos: React.CSSProperties = {
              top: petal.top,
              left: petal.left,
              right: petal.right,
            }
            return (
              <div
                key={petal.id}
                className="absolute cursor-pointer pointer-events-auto opacity-80 hover:opacity-100 hover:scale-150 active:scale-125 transition-transform duration-200"
                style={{
                  ...pos,
                  transform: `scale(${petal.scale}) translate(${mouseOffset.x * 0.55}px, ${mouseOffset.y * 0.45}px)`,
                  animation: `hanakage-courtyard-petal ${petal.dur} ${petal.delay} ease-in-out infinite`,
                }}
                onClick={(e) => handlePop(petal.id, e)}
                title="Sakura petal – click to pop"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffb7c5">
                  <path d="M12 2C10 6 6 8 6 12C6 16 9 19 12 22C15 19 18 16 18 12C18 8 14 6 12 2Z" />
                </svg>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

/** Click ripple burst that plays when an artifact is activated */
function ClickRipple({
  active,
  isDark,
}: {
  active: boolean
  isDark: boolean
}) {
  if (!active) return null
  return (
    <div
      className="absolute inset-0 rounded-full pointer-events-none z-50"
      style={{
        border: `2.5px solid ${isDark ? "#c8b8ff" : "#b23a2e"}`,
        animation: "hanakage-ripple-expand 0.65s ease-out forwards",
        boxShadow: `0 0 16px ${isDark ? "rgba(200,184,255,0.6)" : "rgba(178,58,46,0.5)"}`,
      }}
      aria-hidden="true"
    />
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
      className={`mt-1 sm:mt-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-center transition-all duration-300 backdrop-blur-md ${
        active
          ? "scale-105 sm:scale-110 shadow-xl"
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
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 font-bold text-[11px] sm:text-sm">
        <span
          className="px-1 py-0.5 rounded text-[10px] sm:text-[11px]"
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
      <p className="text-[9px] sm:text-[10px] opacity-60 font-mono mt-0.5 hidden xs:block">{sub}</p>
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
  // Normalized -1..1 for sharper per-element parallax (like shoji-intro)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [introKey, setIntroKey] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  // Track which shrine just got clicked for ripple animation
  const [rippleShrine, setRippleShrine] = useState<ShrineId | null>(null)
  const activeShrineRef = useRef(activeShrine)
  activeShrineRef.current = activeShrine

  // Dynamic constellation anchors tracking each artifact in real time
  const mainRef = useRef<HTMLDivElement>(null)
  const heroAnchorRef = useRef<HTMLDivElement>(null)
  const skillsAnchorRef = useRef<HTMLDivElement>(null)
  const projectsAnchorRef = useRef<HTMLDivElement>(null)
  const aboutAnchorRef = useRef<HTMLDivElement>(null)
  const contactAnchorRef = useRef<HTMLDivElement>(null)
  const experienceAnchorRef = useRef<HTMLDivElement>(null)

  const anchors = {
    hero: heroAnchorRef,
    skills: skillsAnchorRef,
    projects: projectsAnchorRef,
    about: aboutAnchorRef,
    contact: contactAnchorRef,
    experience: experienceAnchorRef,
  }

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
      // Normalized -1..1
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleHoverShrine = (id: ShrineId | null) => {
    setHoveredShrine(id)
    if (id && soundEnabled) {
      if (id === "hero") playZenSound("wood", isDark)
      else if (id === "about") playZenSound("water", isDark)
      else if (id === "experience") playZenSound("wood", isDark)
      else if (id === "skills") playZenSound("bamboo", isDark)
      else if (id === "projects") playZenSound("chime", isDark)
      else if (id === "contact") playZenSound("flame", isDark)
    }
  }

  const handleOpenShrine = useCallback((id: ShrineId) => {
    // Trigger ripple effect
    setRippleShrine(id)
    setTimeout(() => setRippleShrine(null), 700)

    if (soundEnabled) {
      if (id === "about") playZenSound("water", isDark)
      else if (id === "experience") playZenSound("wood", isDark)
      else if (id === "projects") playZenSound("wood", isDark)
      else if (id === "skills") playZenSound("bamboo", isDark)
      else if (id === "contact") playZenSound("flame", isDark)
      else playZenSound("gong", isDark)
    }
    setActiveShrine(id)
  }, [soundEnabled, isDark])

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      if (next) playZenSound("chime", isDark)
      return next
    })
  }

  // Parallax helpers: each artifact gets its own depth multiplier
  // Positive = moves in mouse direction; Negative = moves opposite (counter-parallax)
  const px = (mul: number) => `${mousePos.x * mul}px`
  const py = (mul: number) => `${mousePos.y * mul}px`

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* Top HUD Navigation Bar */}
      {/* Top HUD Navigation Bar */}
      <header className="relative z-30 px-3 sm:px-8 pt-3 sm:pt-5 pb-2 flex items-center justify-between">
        {/* Shrine Garden Crest & Profile Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all shadow-md backdrop-blur-md shrink-0"
            style={{
              borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              fontFamily: "var(--font-heading)",
            }}
          >
            花影神社
          </div>
          <div className="min-w-0">
            <h1
              className="text-xs sm:text-base font-bold tracking-wide truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none"
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 sm:p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
            title={soundEnabled ? "Suara Kuil: Aktif" : "Suara Kuil: Hening"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-50" />
            )}
          </button>

          {/* Katana Slash Shoji Intro Replay Button */}
          <button
            onClick={triggerIntroReplay}
            className="p-2 sm:p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm group cursor-pointer"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label="Tebas & Buka Pintu Shoji"
            title="Tebas & Buka Pintu Shoji (Intro Sinematik)"
          >
            <Sword className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-rotate-45" />
          </button>

          {/* Admin CMS Portal Link */}
          <Link
            href="/admin"
            className="p-2 sm:p-2.5 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              background: isDark ? "rgba(21, 18, 16, 0.75)" : "rgba(251, 245, 234, 0.8)",
              color: "var(--text-primary)",
            }}
            aria-label="Panel Kelola Admin"
            title="Panel Kelola Admin"
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          {/* Andon Lantern Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Interactive Courtyard Stage (Zen Garden Space) */}
      <main
        ref={mainRef}
        className="relative flex-1 w-full overflow-hidden"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
          transition: "transform 0.8s ease-out",
        }}
      >
        {/* Background Zen Garden concentric gravel sand pattern (枯山水 - Karesansui)
            Has its own deeper parallax layer */}
        <div
          className="absolute inset-4 sm:inset-8 rounded-3xl pointer-events-none border border-current/10 hanakage-karesansui-ambient"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 24px, currentColor 24px, currentColor 26px)`,
            maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 80%)",
            color: isDark ? "rgba(122,111,163,0.6)" : "rgba(178,58,46,0.5)",
            // Deepest background layer — moves slightly opposite to mouse (counter-parallax)
            transform: `translate(${px(-3)}, ${py(-2)})`,
            transition: "transform 1.2s ease-out",
          }}
          aria-hidden="true"
        />

        {/* CelestialConstellation: Japanese mystical star map (Seishuku 星宿) dynamically tracking all artifacts */}
        <CelestialConstellation
          hoveredShrine={hoveredShrine}
          isDark={isDark}
          mainRef={mainRef}
          anchors={anchors}
        />

        {/* Ambient Floating Particles (Sakura / Onibi) */}
        <CourtyardAmbientParticles isDark={isDark} mouseOffset={mouseOffset} />

        {/* 1. CENTER: Gerbang Torii (Home / 始) — Focal point, medium depth */}
        <div
          className="absolute top-[41%] sm:top-[40%] left-1/2 z-20 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("hero")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("hero")}
          style={{
            transform: `translate(calc(-50% + ${px(7)}), calc(-50% + ${py(5)}))`,
            transition: "transform 0.35s ease-out",
          }}
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
          {/* Click Ripple */}
          <ClickRipple active={rippleShrine === "hero"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 4.2s ease-in-out infinite",
            }}
          >
            {/* Dynamic Constellation Anchor */}
            <div
              ref={heroAnchorRef}
              className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <ToriiGateArtifact isHovered={hoveredShrine === "hero"} />
          </div>
          <ArtifactLabel
            kanji="壱・始"
            name="Home & Profile"
            sub="Torii Shrine Gate"
            active={hoveredShrine === "hero"}
            isDark={isDark}
          />
        </div>

        {/* 2. TOP LEFT: Kotak Omikuji (Skills / 印) — Nearest layer, moves fastest */}
        <div
          className="absolute top-[4%] sm:top-[6%] left-[6%] sm:left-[8%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("skills")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("skills")}
          style={{
            transform: `translate(${px(-14)}, ${py(-10)})`,
            transition: "transform 0.3s ease-out",
          }}
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
          <ClickRipple active={rippleShrine === "skills"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 3.5s ease-in-out 0.4s infinite",
            }}
          >
            {/* Dynamic Constellation Anchor: center on fortune box */}
            <div
              ref={skillsAnchorRef}
              className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <OmikujiArtifact isHovered={hoveredShrine === "skills"} />
          </div>
          <ArtifactLabel
            kanji="五・印"
            name="Skills"
            sub="Omikuji Fortune Box"
            active={hoveredShrine === "skills"}
            isDark={isDark}
          />
        </div>

        {/* 3. TOP RIGHT: Pohon & Papan Ema (Projects / 卷) */}
        <div
          className="absolute top-[4%] sm:top-[6%] right-[6%] sm:right-[8%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("projects")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("projects")}
          style={{
            transform: `translate(${px(14)}, ${py(-10)})`,
            transition: "transform 0.3s ease-out",
          }}
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
          <ClickRipple active={rippleShrine === "projects"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 3.8s ease-in-out 1.1s infinite",
            }}
          >
            {/* Dynamic Constellation Anchor: center on main Ema tablet */}
            <div
              ref={projectsAnchorRef}
              className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <EmaWallArtifact isHovered={hoveredShrine === "projects"} />
          </div>
          <ArtifactLabel
            kanji="四・卷"
            name="Projects"
            sub="Ema Votive Plaque"
            active={hoveredShrine === "projects"}
            isDark={isDark}
          />
        </div>

        {/* 4. MID LEFT: Bejana Air Chōzubachi (About Me / 影) */}
        <div
          className="absolute top-[32%] sm:top-[40%] left-[2%] sm:left-[4%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("about")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("about")}
          style={{
            transform: `translate(${px(-10)}, ${py(-5)})`,
            transition: "transform 0.4s ease-out",
          }}
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
          <ClickRipple active={rippleShrine === "about"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 4.6s ease-in-out 0.7s infinite",
            }}
          >
            {/* Dynamic Constellation Anchor: center of water basin */}
            <div
              ref={aboutAnchorRef}
              className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <ChozubachiArtifact isHovered={hoveredShrine === "about"} />
          </div>
          <ArtifactLabel
            kanji="弐・影"
            name="About Me"
            sub="Stone Water Basin"
            active={hoveredShrine === "about"}
            isDark={isDark}
          />
        </div>

        {/* 5. MID RIGHT: Lentera Kasuga Tōrō (Contact / 結) */}
        <div
          className="absolute top-[32%] sm:top-[40%] right-[2%] sm:right-[4%] z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("contact")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("contact")}
          style={{
            transform: `translate(${px(10)}, ${py(-5)})`,
            transition: "transform 0.4s ease-out",
          }}
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
          <ClickRipple active={rippleShrine === "contact"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 5.0s ease-in-out 1.8s infinite",
            }}
          >
            {/* Dynamic Constellation Anchor: center of glowing flame window */}
            <div
              ref={contactAnchorRef}
              className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <ToroLanternArtifact isHovered={hoveredShrine === "contact"} />
          </div>
          <ArtifactLabel
            kanji="六・結"
            name="Contact"
            sub="Kasuga Stone Lantern"
            active={hoveredShrine === "contact"}
            isDark={isDark}
          />
        </div>

        {/* 6. BOTTOM CENTER: Batu Pijakan Taman Zen (Experience / 歩) — deepest in scene, moves least */}
        <div
          className="absolute bottom-[1.5%] sm:bottom-[3%] left-1/2 z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => handleHoverShrine("experience")}
          onMouseLeave={() => handleHoverShrine(null)}
          onClick={() => handleOpenShrine("experience")}
          style={{
            transform: `translate(calc(-50% + ${px(5)}), ${py(6)})`,
            transition: "transform 0.5s ease-out",
          }}
        >
          {/* Sumi-e Ensō Aura on hover */}
          {hoveredShrine === "experience" && (
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
          <ClickRipple active={rippleShrine === "experience"} isDark={isDark} />
          <div
            className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              animation: "hanakage-artifact-bob 4.0s ease-in-out 2.2s infinite",
            }}
          >
            {/* Dynamic Constellation Anchor: center of main stepping stone */}
            <div
              ref={experienceAnchorRef}
              className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />
            <SteppingStonesArtifact isHovered={hoveredShrine === "experience"} />
          </div>
          <ArtifactLabel
            kanji="参・歩"
            name="Experience"
            sub="Stepping Stone Path"
            active={hoveredShrine === "experience"}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Zen Garden Ambient Exploration Footer */}
      <footer className="relative z-30 px-3 pb-3 sm:pb-6 flex flex-col items-center gap-2 select-none pointer-events-none">
        <div
          className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs tracking-wider sm:tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 pointer-events-auto shadow-md max-w-[92vw] truncate"
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
              ? `Constellation Linked: ${SHRINES.find((s) => s.id === hoveredShrine)?.name} (Click to enter)`
              : "Touch shrine artifacts to link the Hanakage constellations"}
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
