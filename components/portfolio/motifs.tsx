"use client"

import { useEffect, useState } from "react"
import { useHanakageTheme } from "./theme-provider"

/** Torii gate silhouette — calm in Hanami, cracked & glowing in Yūrei */
export function ToriiSilhouette({ className = "" }: { className?: string }) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 160"
      className={className}
      style={{ opacity: isDark ? 0.22 : 0.12 }}
    >
      <defs>
        <filter id="torii-glow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {isDark && (
        <ellipse cx="100" cy="70" rx="26" ry="20" fill="#4a0e0e" opacity="0.5" filter="url(#torii-glow)" />
      )}
      <g stroke={isDark ? "#b9b0a0" : "#3a3532"} strokeWidth="3" fill="none" strokeLinecap="round">
        <line x1="35" y1="150" x2="40" y2="30" />
        <line x1="165" y1="150" x2="160" y2="30" />
        <path d={isDark ? "M20 40 L182 34" : "M20 38 L180 38"} strokeWidth="6" />
        <path d={isDark ? "M28 55 L172 52" : "M28 55 L172 55"} strokeWidth="3.5" />
        <line x1="100" y1="55" x2="100" y2="150" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  )
}

/** Single kanji fading in/out across the dark viewport */
export function GhostKanji({ char, top, left, delay }: { char: string; top: string; left: string; delay: number }) {
  const { theme } = useHanakageTheme()
  if (theme !== "yurei") return null
  return (
    <span
      aria-hidden="true"
      className="hanakage-kanji"
      style={{ top, left, animationDelay: `${delay}s` }}
    >
      {char}
    </span>
  )
}

/** Crow silhouette that occasionally glides across the screen */
export function CrowFlight() {
  const { theme } = useHanakageTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (theme !== "yurei") return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = 30000 + Math.random() * 30000
      timeout = setTimeout(() => {
        setVisible(true)
        setTimeout(() => setVisible(false), 4200)
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [theme])

  if (theme !== "yurei" || !visible) return null

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 30"
      className="fixed top-[18%] left-0 z-[2] pointer-events-none"
      style={{ width: 60, animation: "hanakage-crow-fly 4.2s linear forwards" }}
    >
      <path
        d="M2 15 Q12 2 22 13 Q28 6 30 12 Q32 6 38 13 Q48 2 58 15 Q40 12 30 18 Q20 12 2 15Z"
        fill="#151210"
      />
      <style>{`
        @keyframes hanakage-crow-fly {
          from { transform: translateX(-10vw) translateY(0); }
          to { transform: translateX(110vw) translateY(-40px); }
        }
      `}</style>
    </svg>
  )
}

/** Ink-brush stroke section divider */
export function BrushDivider() {
  const { theme } = useHanakageTheme()
  return (
    <svg viewBox="0 0 220 14" className="hanakage-divider" aria-hidden="true">
      <path
        d="M2 8 C 40 2, 80 12, 110 6 C 140 1, 180 11, 218 5"
        stroke="currentColor"
        strokeWidth={theme === "yurei" ? 1.5 : 2.5}
        fill="none"
        strokeLinecap="round"
        opacity={theme === "yurei" ? 0.5 : 0.8}
      />
    </svg>
  )
}

/** Hanko / rune badge used for skills */
export function SkillMark({ label }: { label: string }) {
  return (
    <div className="hanakage-stamp" role="img" aria-label={`Keahlian: ${label}`}>
      {label}
    </div>
  )
}
