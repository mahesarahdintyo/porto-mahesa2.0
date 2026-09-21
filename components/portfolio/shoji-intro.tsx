"use client"

import React, { useState, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"
import { playZenSound } from "@/lib/sound"

interface ShojiIntroProps {
  onComplete?: () => void
}

export function ShojiIntro({ onComplete }: ShojiIntroProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  const [slashed, setSlashed] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [impactFlash, setImpactFlash] = useState(false)
  const [opened, setOpened] = useState(false)
  const [visible, setVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Drag / swipe detection
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  const triggerSlash = () => {
    if (slashed) return
    setSlashed(true)
    playZenSound("slash", isDark)

    // Impact flash & screen shake
    setImpactFlash(true)
    setTimeout(() => setImpactFlash(false), 200)

    setTimeout(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 450)
    }, 60)

    // Doors slide apart revealing the courtyard
    setTimeout(() => {
      setOpened(true)
      playZenSound("shoji", isDark)
    }, 500)

    // Cleanup
    setTimeout(() => {
      setVisible(false)
      onComplete?.()
    }, 1650)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartPos.current || slashed) return
    triggerSlash()
    dragStartPos.current = null
  }

  if (!visible) return null

  // Dynamic Theme Content (100% English with clean aesthetic matching shrine-artifacts.tsx)
  const modeData = isDark
    ? {
        badge: "YAMAZAKI DOMAIN ・ 山崎白鬼門",
        title: "SHIRO ONI — THE YAMAZAKI GATE",
        quote: "“Sever the seal to enter the domain.”",
        buttonText: "SEVER THE SEAL",
        kanji: "斬",
        doorBorder: "#45384e",
        doorBg: "radial-gradient(ellipse at 95% 50%, #15111c 0%, #09070c 100%)",
        doorBgRight: "radial-gradient(ellipse at 5% 50%, #15111c 0%, #09070c 100%)",
        accentColor: "#c8b8ff",
        glowAura: "rgba(200, 184, 255, 0.4)",
        trailColor: "#c8b8ff",
      }
    : {
        badge: "SPRING SANCTUARY ・ 桜花神門",
        title: "HANAKAGE — THE BLOSSOM GATE",
        quote: "“Unsheathe the blade to enter the spring sanctuary.”",
        buttonText: "SLICE TO ENTER",
        kanji: "開",
        doorBorder: "#8e2b20",
        doorBg: "radial-gradient(ellipse at 95% 50%, #fdf7ee 0%, #eddcc7 100%)",
        doorBgRight: "radial-gradient(ellipse at 5% 50%, #fdf7ee 0%, #eddcc7 100%)",
        accentColor: "#b23a2e",
        glowAura: "rgba(178, 58, 46, 0.35)",
        trailColor: "#b23a2e",
      }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none cursor-pointer"
      style={{
        pointerEvents: opened ? "none" : "auto",
        background: isDark ? "#08070a" : "#1a120f",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }) }}
      onMouseMove={(e) => {
        if (!isHovered) return
        const rect = e.currentTarget.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        setMousePos({
          x: (e.clientX - cx) / (rect.width / 2),
          y: (e.clientY - cy) / (rect.height / 2),
        })
      }}
    >
      {/* ── Background Ambiance: Sakura Petals (Light) vs Rain & Embers (Dark) ── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-50">
        {isDark ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(105deg, transparent 0, transparent 48px, rgba(255,255,255,0.035) 48px, rgba(255,255,255,0.035) 49px)",
                animation: "hanakage-rain 0.75s linear infinite",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 35%, rgba(255,100,50,0.18) 1.5px, transparent 2.5px), radial-gradient(circle at 75% 65%, rgba(200,180,255,0.15) 1.5px, transparent 2.5px)",
                backgroundSize: "180px 180px",
                animation: "hanakage-ash 4s ease-in-out infinite alternate",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(255, 235, 200, 0.45) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 30% 40%, rgba(255, 182, 193, 0.35) 2.5px, transparent 4px), radial-gradient(ellipse at 70% 60%, rgba(255, 192, 203, 0.3) 2px, transparent 3.5px)",
                backgroundSize: "140px 140px",
                animation: "hanakage-ash 5s ease-in-out infinite alternate",
              }}
            />
          </>
        )}
      </div>

      {/* ── Impact Flash on Slicing ── */}
      {impactFlash && (
        <div
          className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-150"
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(180,160,255,0.7) 40%, rgba(10,8,14,0.9) 80%)"
              : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,210,140,0.8) 40%, rgba(142,43,32,0.8) 80%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* ── LEFT SHOJI DOOR (Half Gate Artifact anchored to right edge) ── */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 border-r z-20 overflow-hidden transition-transform duration-700 ease-in-out ${
          shaking ? "hanakage-shoji-shake" : ""
        }`}
        style={{
          transform: opened ? "translateX(-100%)" : "translateX(0)",
          background: modeData.doorBg,
          borderColor: modeData.doorBorder,
          boxShadow: isDark ? "15px 0 45px rgba(0,0,0,0.85)" : "10px 0 35px rgba(50,20,10,0.35)",
        }}
      >
        {/* Japanese Kumiko Geometric Lattice */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(142,43,32,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(142,43,32,0.25) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* LEFT HALF OF GATE ARTIFACT (Pinned to right seam of left door) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[280px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[300px] pointer-events-none"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          {isDark ? (
            <ShiroOniGateArtifact isHovered={isHovered} mousePos={mousePos} />
          ) : (
            <SakuraGateArtifact isHovered={isHovered} mousePos={mousePos} />
          )}
        </div>
      </div>

      {/* ── RIGHT SHOJI DOOR (Half Gate Artifact anchored to left edge) ── */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 border-l z-20 overflow-hidden transition-transform duration-700 ease-in-out ${
          shaking ? "hanakage-shoji-shake" : ""
        }`}
        style={{
          transform: opened ? "translateX(100%)" : "translateX(0)",
          background: modeData.doorBgRight,
          borderColor: modeData.doorBorder,
          boxShadow: isDark ? "-15px 0 45px rgba(0,0,0,0.85)" : "-10px 0 35px rgba(50,20,10,0.35)",
        }}
      >
        {/* Japanese Kumiko Geometric Lattice */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(142,43,32,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(142,43,32,0.25) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* RIGHT HALF OF GATE ARTIFACT (Pinned to left seam of right door) */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[280px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[300px] pointer-events-none"
          style={{ clipPath: "inset(0 0 0 50%)" }}
        >
          {isDark ? (
            <ShiroOniGateArtifact isHovered={isHovered} mousePos={mousePos} />
          ) : (
            <SakuraGateArtifact isHovered={isHovered} mousePos={mousePos} />
          )}
        </div>
      </div>

      {/* ── FOREGROUND OVERLAY: TITLE, QUOTE & INTERACTIVE BUTTON ── */}
      {!opened && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-between py-10 sm:py-14 px-4 pointer-events-none transition-all duration-300"
          style={{
            opacity: slashed ? 0 : 1,
            transform: slashed ? "scale(0.92)" : "scale(1)",
          }}
        >
          {/* Top Mode Badge */}
          <div className="flex flex-col items-center gap-1.5 pt-2">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-mono tracking-widest uppercase backdrop-blur-md"
              style={{
                borderColor: isDark ? "rgba(180,160,255,0.4)" : "rgba(178,58,46,0.35)",
                color: modeData.accentColor,
                background: isDark ? "rgba(10,8,14,0.75)" : "rgba(255,250,242,0.85)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ background: isDark ? "#c8b8ff" : "#b23a2e" }}
              />
              <span>{modeData.badge}</span>
            </div>
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest uppercase mt-1 font-serif text-center drop-shadow-md"
              style={{ color: isDark ? "#ffffff" : "#2b2320" }}
            >
              {modeData.title}
            </h1>
          </div>

          {/* Bottom Interactive Slash Prompt & Quote */}
          <div className="flex flex-col items-center gap-3 pb-2 text-center max-w-md">
            <p
              className="text-xs sm:text-sm font-serif italic tracking-wide drop-shadow px-4"
              style={{ color: isDark ? "#d4ccdf" : "#5a453e", opacity: 0.9 }}
            >
              {modeData.quote}
            </p>

            {/* Glowing Katana Slash Trigger Button */}
            <button
              onClick={triggerSlash}
              className="group pointer-events-auto relative px-7 py-2.5 rounded-xl border flex items-center gap-3 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              style={{
                borderColor: isHovered
                  ? modeData.accentColor
                  : isDark
                  ? "rgba(180,160,255,0.3)"
                  : "rgba(178,58,46,0.3)",
                background: isDark
                  ? "rgba(20,16,25,0.92)"
                  : "rgba(255,250,242,0.92)",
                color: isDark ? "#e4dcff" : "#8e2b20",
                boxShadow: isHovered
                  ? `0 0 25px ${modeData.glowAura}`
                  : "0 4px 15px rgba(0,0,0,0.35)",
              }}
            >
              <span className="font-serif text-base font-bold">{modeData.kanji}</span>
              <span>{modeData.buttonText}</span>
              <span className="font-serif text-base font-bold">{modeData.kanji}</span>
            </button>

            <span
              className="text-[10px] font-mono tracking-wider uppercase opacity-60"
              style={{ color: isDark ? "#a79cb5" : "#7c6861" }}
            >
              ✦ Tap, drag, or click to slash ✦
            </span>
          </div>
        </div>
      )}

      {/* ── Katana Slash Cutting Beam Animation ── */}
      {slashed && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="gate-spark-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Broad slash impact aura */}
          <path
            d="M -50,110 Q 500,320 1050,480"
            pathLength="1000"
            fill="none"
            stroke={modeData.trailColor}
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            filter="url(#gate-spark-glow)"
            style={{ animation: "hanakage-katana-trail 0.48s ease-out forwards" }}
          />

          {/* Incandescent white blade cutting edge */}
          <path
            d="M -50,110 Q 500,320 1050,480"
            pathLength="1000"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            style={{
              animation: "hanakage-katana-draw 0.5s cubic-bezier(0.15, 0.85, 0.35, 1) forwards",
              filter: "drop-shadow(0 0 12px #fff) drop-shadow(0 0 5px #ffb347)",
            }}
          />

          {/* Center impact flare */}
          <g transform="translate(500, 310) rotate(20)">
            <ellipse
              cx="0"
              cy="0"
              rx="160"
              ry="16"
              fill="white"
              style={{
                animation: "hanakage-slash-flare 0.45s ease-out forwards",
                filter: "blur(6px)",
              }}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="90"
              ry="40"
              fill={modeData.trailColor}
              style={{
                animation: "hanakage-slash-flare 0.45s ease-out forwards",
                filter: "blur(14px)",
              }}
            />
          </g>
        </svg>
      )}
    </div>
  )
}

/**
 * SakuraGateArtifact:
 * Authentic Japanese Shrine Votive Ema & Torii Shimenawa Seal (Light Mode).
 * Uses the exact same gradient, linework, and architectural aesthetic
 * as ToriiGateArtifact and EmaWallArtifact in shrine-artifacts.tsx.
 */
function SakuraGateArtifact({ isHovered, mousePos }: { isHovered: boolean; mousePos: { x: number; y: number } }) {
  const tiltX = isHovered ? mousePos.y * -6 : 0
  const tiltY = isHovered ? mousePos.x * 6 : 0
  const floatY = isHovered ? mousePos.y * -5 : 0

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full h-full"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${floatY}px) scale(1.04)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        filter: isHovered
          ? "drop-shadow(0 18px 32px rgba(178,58,46,0.22)) drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.12))",
        transformOrigin: "center bottom",
      }}
    >
      <defs>
        {/* Same vermilion gradient as ToriiGateArtifact */}
        <linearGradient id="gate-vermilion" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c83a2d" />
          <stop offset="100%" stopColor="#871f16" />
        </linearGradient>

        {/* Same wood gradient as EmaWallArtifact */}
        <linearGradient id="gate-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d9ab7b" />
          <stop offset="100%" stopColor="#b58352" />
        </linearGradient>
      </defs>

      {/* ── 1. SAKURA TREE BRANCH OVERHEAD (From EmaWallArtifact style) ── */}
      <path
        d="M 20 45 Q 110 25 210 50 T 300 45"
        stroke="#59402f"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 40 Q 160 70 180 80"
        stroke="#59402f"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cherry blossom clusters */}
      <circle cx="70" cy="34" r="7" fill="#ffb7c5" opacity="0.95" />
      <circle cx="80" cy="28" r="5.5" fill="#ffd1dc" opacity="0.95" />
      <circle cx="230" cy="48" r="8" fill="#ffb7c5" opacity="0.95" />
      <circle cx="244" cy="42" r="6" fill="#ffd1dc" opacity="0.95" />

      {/* ── 2. SACRED TORII CROSSBEAM & SHIMENAWA ── */}
      {/* Curved Kasagi Beam */}
      <path
        d="M 40 52 Q 160 38 280 52 L 275 64 Q 160 50 45 64 Z"
        fill="url(#gate-vermilion)"
        stroke="#3a1510"
        strokeWidth="1.8"
      />

      {/* Sacred twisted rope (Shimenawa) */}
      <path
        d="M 60 72 Q 160 92 260 72"
        stroke="#d4a373"
        strokeWidth="5"
        fill="none"
        strokeDasharray="5 2.5"
      />

      {/* Zigzag paper streamers (Shide) */}
      <path d="M 85 82 L 91 94 L 85 106" stroke="#f5efe6" strokeWidth="3" fill="none" />
      <path d="M 235 82 L 241 94 L 235 106" stroke="#f5efe6" strokeWidth="3" fill="none" />

      {/* ── 3. SACRED EMA VOTIVE BOARD (House-shaped 5-sided polygon) ── */}
      {/* Red braided hanging cord */}
      <line x1="160" y1="44" x2="160" y2="92" stroke="#b23a2e" strokeWidth="2.5" />
      <circle cx="160" cy="92" r="3.5" fill="none" stroke="#b23a2e" strokeWidth="2" />

      {/* Five-sided Ema Plaque */}
      <polygon
        points="160,94 100,126 100,205 220,205 220,126"
        fill="url(#gate-wood)"
        stroke="#634324"
        strokeWidth="2.2"
        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.3))"
      />

      {/* Traditional Vermilion Seal on Ema Board */}
      <circle cx="160" cy="155" r="28" fill="rgba(178,58,46,0.14)" stroke="#b23a2e" strokeWidth="1.5" />
      <text
        x="160"
        y="166"
        textAnchor="middle"
        fontSize="30"
        fontFamily="serif"
        fontWeight="bold"
        fill="#b23a2e"
      >
        開
      </text>

      {/* Inscribed Japanese text */}
      <text
        x="160"
        y="194"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fill="#59402f"
        fontFamily="serif"
        fontWeight="bold"
      >
        桜花・神門
      </text>

      {/* Golden Suzu Bell hanging below Ema */}
      <circle cx="160" cy="216" r="8" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
      <path d="M 158 224 L 155 236 M 162 224 L 165 236" stroke="#b23a2e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * ShiroOniGateArtifact:
 * Authentic Yamazaki Clan Shiro Oni Sacred Shrine Seal (Dark / Yūrei Mode).
 * Matches the exact same vector gradients and linework as ToriiGateArtifact
 * in dark mode, featuring the Yamazaki White Demon crest, UI eyes rune, and rain/ash aesthetic.
 */
function ShiroOniGateArtifact({ isHovered, mousePos }: { isHovered: boolean; mousePos: { x: number; y: number } }) {
  const tiltX = isHovered ? mousePos.y * -6 : 0
  const tiltY = isHovered ? mousePos.x * 6 : 0
  const floatY = isHovered ? mousePos.y * -5 : 0

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full h-full"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${floatY}px) scale(1.04)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        filter: isHovered
          ? "drop-shadow(0 18px 32px rgba(200,184,255,0.25)) drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
        transformOrigin: "center bottom",
      }}
    >
      <defs>
        {/* Dark vermilion gradient from ToriiGateArtifact dark mode */}
        <linearGradient id="gate-vermilion-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e141a" />
          <stop offset="100%" stopColor="#120a0d" />
        </linearGradient>

        {/* Charred wood gradient from EmaWallArtifact dark mode */}
        <linearGradient id="gate-wood-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#261e24" />
          <stop offset="100%" stopColor="#130e12" />
        </linearGradient>

        {/* Ultra Instinct Eye Glow */}
        <filter id="ui-rune-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 1. CHARRED BRANCH OVERHEAD ── */}
      <path
        d="M 20 45 Q 110 25 210 50 T 300 45"
        stroke="#1c1619"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 40 Q 160 70 180 80"
        stroke="#1c1619"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ghostly ash/ember blossoms */}
      <circle cx="70" cy="34" r="6" fill="#4a3b45" opacity="0.85" />
      <circle cx="230" cy="48" r="6.5" fill="#4a3b45" opacity="0.85" />

      {/* ── 2. SACRED TORII CROSSBEAM & SHIMENAWA ── */}
      {/* Curved Kasagi Beam (Charred Obsidian & Deep Crimson) */}
      <path
        d="M 40 52 Q 160 38 280 52 L 275 64 Q 160 50 45 64 Z"
        fill="url(#gate-vermilion-dark)"
        stroke="#7a6fa3"
        strokeWidth="1.6"
      />

      {/* Dark Shimenawa twisted rope */}
      <path
        d="M 60 72 Q 160 92 260 72"
        stroke="#615951"
        strokeWidth="5"
        fill="none"
        strokeDasharray="5 2.5"
      />

      {/* Zigzag paper streamers (Shide) */}
      <path d="M 85 82 L 91 94 L 85 106" stroke="#e8e2d8" strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M 235 82 L 241 94 L 235 106" stroke="#e8e2d8" strokeWidth="2.5" fill="none" opacity="0.85" />

      {/* ── 3. YAMAZAKI CLAN SHIRO ONI EMA VOTIVE BOARD ── */}
      {/* Deep purple/crimson hanging cord */}
      <line x1="160" y1="44" x2="160" y2="92" stroke="#7a6fa3" strokeWidth="2.5" />
      <circle cx="160" cy="92" r="3.5" fill="none" stroke="#7a6fa3" strokeWidth="2" />

      {/* Five-sided Ema Plaque (Charred Obsidian Timber) */}
      <polygon
        points="160,94 100,126 100,205 220,205 220,126"
        fill="url(#gate-wood-dark)"
        stroke="#594d61"
        strokeWidth="2.2"
        filter="drop-shadow(0 6px 14px rgba(0,0,0,0.6))"
      />

      {/* PARK JONGGUN ULTRA INSTINCT (UI) EYES RUNE */}
      <g filter="url(#ui-rune-glow)">
        {/* Left UI Eye */}
        <polygon points="128,136 148,134 144,144 130,143" fill="#08070b" stroke="#7a6fa3" strokeWidth="0.8" />
        <circle cx="138" cy="139" r="3" fill="#ffffff" />
        <circle cx="138" cy="139" r="4.5" fill="none" stroke="#c8b8ff" strokeWidth="1" />

        {/* Right UI Eye */}
        <polygon points="192,136 172,134 176,144 190,143" fill="#08070b" stroke="#7a6fa3" strokeWidth="0.8" />
        <circle cx="182" cy="139" r="3" fill="#ffffff" />
        <circle cx="182" cy="139" r="4.5" fill="none" stroke="#c8b8ff" strokeWidth="1" />
      </g>

      {/* Traditional Seal on Ema: "白鬼" (Shiro Oni) */}
      <circle cx="160" cy="168" r="22" fill="rgba(122,111,163,0.15)" stroke="#7a6fa3" strokeWidth="1.5" />
      <text
        x="160"
        y="176"
        textAnchor="middle"
        fontSize="22"
        fontFamily="serif"
        fontWeight="bold"
        fill="#c8b8ff"
      >
        白鬼
      </text>

      {/* Inscribed Yamazaki Domain text */}
      <text
        x="160"
        y="198"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="2.5"
        fill="#9a927f"
        fontFamily="serif"
        fontWeight="bold"
      >
        山崎・白鬼門
      </text>

      {/* Glowing Ember Cigarette Accent below Ema */}
      <g transform="translate(150, 214)">
        <rect x="0" y="0" width="20" height="3" rx="0.5" fill="#e5e5e5" />
        <rect x="0" y="0" width="5" height="3" rx="0.5" fill="#b45309" />
        <circle cx="20" cy="1.5" r="1.8" fill="#ff4500" className="animate-pulse" />
      </g>
    </svg>
  )
}
