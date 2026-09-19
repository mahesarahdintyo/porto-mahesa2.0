"use client"

import React, { useState, useEffect } from "react"
import { useHanakageTheme } from "./theme-provider"
import { playZenSound } from "@/lib/sound"

interface ShojiIntroProps {
  onComplete?: () => void
  manualTrigger?: boolean
}

export function ShojiIntro({ onComplete, manualTrigger = false }: ShojiIntroProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  const [mounted, setMounted] = useState(false)
  const [slashed, setSlashed] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [opened, setOpened] = useState(false)
  const [visible, setVisible] = useState(manualTrigger)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (manualTrigger) {
      setVisible(true)
      setSlashed(false)
      setShaking(false)
      setOpened(false)
    } else {
      setVisible(false)
    }
  }, [manualTrigger])

  const handleSlashAndEnter = () => {
    if (slashed) return
    setSlashed(true)
    playZenSound("slash", isDark)

    // Screen shake on the shoji doors right away
    setTimeout(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 400)
    }, 80)

    // After slash finishes drawing, open doors
    setTimeout(() => {
      setOpened(true)
      playZenSound("shoji", isDark)
    }, 500)

    // Cleanup
    setTimeout(() => {
      sessionStorage.setItem("hanakage_shoji_intro_seen", "true")
      setVisible(false)
      onComplete?.()
    }, 1600)
  }

  if (!mounted || !visible) return null

  // Colors based on theme
  const bladeColor = isDark ? "#c8b8ff" : "#ffffff"
  const trailColor = isDark ? "#7a6fa3" : "#b23a2e"
  const glowFilter = isDark
    ? "drop-shadow(0 0 14px #9b8fd4) drop-shadow(0 0 6px #fff)"
    : "drop-shadow(0 0 14px #ffd6d0) drop-shadow(0 0 8px #fff)"

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{ pointerEvents: opened ? "none" : "auto" }}
    >
      {/* ── Left Shoji Door ── */}
      <div
        className={shaking ? "hanakage-shoji-shake" : ""}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "50%",
          transform: opened ? "translateX(-100%)" : "translateX(0)",
          transition: opened ? "transform 1.1s cubic-bezier(0.55, 0, 0.1, 1)" : "none",
          background: isDark
            ? "radial-gradient(ellipse at 80% 50%, #1c1822 0%, #100d14 100%)"
            : "radial-gradient(ellipse at 80% 50%, #faf3e8 0%, #ede0cb 100%)",
          borderRight: isDark ? "3px solid #3c324c" : "3px solid #8e2b20",
          boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Kumiko lattice */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(122,111,163,0.4) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(122,111,163,0.4) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(142,43,32,0.3) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(142,43,32,0.3) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Inner shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 100% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Right Shoji Door ── */}
      <div
        className={shaking ? "hanakage-shoji-shake" : ""}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "50%",
          transform: opened ? "translateX(100%)" : "translateX(0)",
          transition: opened ? "transform 1.1s cubic-bezier(0.55, 0, 0.1, 1)" : "none",
          background: isDark
            ? "radial-gradient(ellipse at 20% 50%, #1c1822 0%, #100d14 100%)"
            : "radial-gradient(ellipse at 20% 50%, #faf3e8 0%, #ede0cb 100%)",
          borderLeft: isDark ? "3px solid #3c324c" : "3px solid #8e2b20",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Kumiko lattice */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(122,111,163,0.4) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(122,111,163,0.4) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(142,43,32,0.3) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(142,43,32,0.3) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Inner shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 0% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Katana Slash SVG (layered: trail → blade → vapor afterglow → anamorphic flare) ── */}
      {slashed && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 30,
            overflow: "visible",
          }}
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="slash-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="slash-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* Layer 1: Broad soft ambient aura trail */}
          <path
            d="M -40,90 Q 490,335 1040,490"
            pathLength="1000"
            fill="none"
            stroke={trailColor}
            strokeWidth="32"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            filter="url(#slash-soft)"
            style={{ animation: "hanakage-katana-trail 0.5s ease-out forwards" }}
          />

          {/* Layer 2: Medium glowing katana body aura */}
          <path
            d="M -40,90 Q 490,335 1040,490"
            pathLength="1000"
            fill="none"
            stroke={trailColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            filter="url(#slash-glow)"
            style={{ animation: "hanakage-katana-trail 0.48s ease-out forwards" }}
          />

          {/* Layer 3: Razor-sharp luminous white blade edge */}
          <path
            d="M -40,90 Q 490,335 1040,490"
            pathLength="1000"
            fill="none"
            stroke={bladeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            style={{
              animation: "hanakage-katana-draw 0.5s cubic-bezier(0.15, 0.85, 0.35, 1) forwards",
              filter: glowFilter,
            }}
          />

          {/* Layer 4: Incandescent vapor along the cut line */}
          <path
            d="M -40,90 Q 490,335 1040,490"
            pathLength="1000"
            fill="none"
            stroke={bladeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="0"
            style={{
              animation: "hanakage-katana-vapor 0.52s ease-out forwards",
              filter: glowFilter,
            }}
          />

          {/* Layer 5: Anamorphic impact flare at center (rotated along blade trajectory) */}
          <g transform="translate(495, 312) rotate(21)">
            <ellipse
              cx="0"
              cy="0"
              rx="150"
              ry="14"
              fill="white"
              style={{
                animation: "hanakage-slash-flare 0.46s ease-out forwards",
                filter: "blur(6px)",
              }}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="75"
              ry="36"
              fill={trailColor}
              style={{
                animation: "hanakage-slash-flare 0.46s ease-out forwards",
                filter: "blur(12px)",
              }}
            />
          </g>
        </svg>
      )}

      {/* ── Center Seal / Call-to-Action ── */}
      {!opened && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            cursor: slashed ? "default" : "pointer",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: slashed ? 0 : 1,
            transform: slashed ? "scale(0.88)" : "scale(1)",
            pointerEvents: slashed ? "none" : "auto",
          }}
          onClick={handleSlashAndEnter}
        >
          {/* Hanko seal */}
          <div
            className="hanakage-shoji-seal"
            style={{
              width: 112,
              height: 112,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${isDark ? "#7a6fa3" : "#b23a2e"}`,
              background: isDark ? "rgba(21,18,25,0.9)" : "rgba(255,250,242,0.92)",
              boxShadow: isDark
                ? "0 0 40px rgba(122,111,163,0.45)"
                : "0 0 40px rgba(178,58,46,0.35)",
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: "bold",
                letterSpacing: "0.15em",
                color: isDark ? "#bfa8ff" : "#b23a2e",
                fontFamily: "var(--font-heading)",
              }}
            >
              開門
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                marginTop: 4,
                opacity: 0.65,
                fontFamily: "monospace",
                color: "var(--text-primary)",
              }}
            >
              KAI MON
            </span>
          </div>

          <h2
            style={{
              marginTop: 24,
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              textAlign: "center",
            }}
          >
            花影神社 — Masuk Kuil
          </h2>

          <p
            style={{
              marginTop: 8,
              fontSize: "clamp(0.72rem, 1.5vw, 0.875rem)",
              opacity: 0.65,
              maxWidth: 280,
              textAlign: "center",
              fontFamily: "monospace",
              color: "var(--text-muted)",
            }}
          >
            Klik untuk menebas gerbang Shoji &amp; membuka taman
          </p>

          <div
            style={{
              marginTop: 16,
              padding: "6px 18px",
              borderRadius: 9999,
              border: `1px solid ${isDark ? "rgba(191,168,255,0.4)" : "rgba(178,58,46,0.35)"}`,
              fontSize: 11,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: isDark ? "#bfa8ff" : "#b23a2e",
              background: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
            }}
          >
            ✦ SENTUH UNTUK MEMBUKA ✦
          </div>
        </div>
      )}
    </div>
  )
}
