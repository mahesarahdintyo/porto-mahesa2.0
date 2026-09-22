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
  const [centerArtifactHovered, setCenterArtifactHovered] = useState(false)

  // Drag / swipe detection for Katana slash
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
    const dx = e.clientX - dragStartPos.current.x
    const dy = e.clientY - dragStartPos.current.y
    const distance = Math.hypot(dx, dy)

    // If dragged more than 40px, treat as katana blade swipe gesture
    if (distance > 40) {
      triggerSlash()
    }
    dragStartPos.current = null
  }

  if (!visible) return null

  // Dynamic Theme Content (100% English with authentic Japanese aesthetic)
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
        tanzakuLeft: "山崎白鬼門",
        tanzakuRight: "修羅の領域",
        tanzakuSubLeft: "SHIRO ONI DOMAIN",
        tanzakuSubRight: "WAY OF THE WARRIOR",
        lanternKanjiLeft: "山",
        lanternKanjiRight: "崎",
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
        tanzakuLeft: "春光神門開",
        tanzakuRight: "一期一会庭",
        tanzakuSubLeft: "SACRED SPRING GATE",
        tanzakuSubRight: "TREASURED ENCOUNTER",
        lanternKanjiLeft: "桜",
        lanternKanjiRight: "春",
      }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none cursor-default"
      style={{
        pointerEvents: opened ? "none" : "auto",
        background: isDark ? "#08070a" : "#1a120f",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
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
      <div
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-50 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 4}px)`,
        }}
      >
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

      {/* ── LEFT SHOJI DOOR ── */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 border-r z-20 overflow-hidden transition-transform duration-700 ease-in-out ${
          shaking ? "hanakage-shoji-shake" : ""
        }`}
        style={{
          transform: opened ? "translateX(-100%)" : "translateX(0)",
          background: modeData.doorBg,
          borderColor: modeData.doorBorder,
          boxShadow: opened
            ? isDark
              ? "15px 0 45px rgba(0,0,0,0.85)"
              : "10px 0 35px rgba(50,20,10,0.35)"
            : "none",
        }}
      >
        {/* Japanese Kumiko Geometric Lattice with Parallax Depth */}
        <div
          className="absolute inset-0 opacity-20 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(142,43,32,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(142,43,32,0.25) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 6}px)`,
          }}
        />

        {/* Interactive Corner Fittings (Kanamono) - Left Door */}
        <InteractiveCornerFitting position="top-left" isDark={isDark} mousePos={mousePos} />
        <InteractiveCornerFitting position="bottom-left" isDark={isDark} mousePos={mousePos} />

        {/* Interactive Hanging Shrine Lantern - Left Flank */}
        <div
          className="absolute left-4 sm:left-8 md:left-14 top-6 sm:top-10 transition-transform duration-300 ease-out hidden sm:block"
          style={{
            transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 8}px)`,
          }}
        >
          <InteractiveLantern
            kanji={modeData.lanternKanjiLeft}
            side="left"
            isDark={isDark}
            mousePos={mousePos}
          />
        </div>

        {/* Interactive Vertical Poetry Scroll (Tanzaku) - Left Flank */}
        <div
          className="absolute left-6 sm:left-10 md:left-16 top-1/2 transition-transform duration-300 ease-out hidden md:block"
          style={{
            transform: `translate(${mousePos.x * 16}px, calc(-50% + ${mousePos.y * 10}px))`,
          }}
        >
          <InteractiveTanzaku
            kanji={modeData.tanzakuLeft}
            subtitle={modeData.tanzakuSubLeft}
            isDark={isDark}
            mousePos={mousePos}
          />
        </div>

        {/* LEFT HALF OF GATE ARTIFACT (Active only when doors slide apart) */}
        {opened && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[280px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[300px] pointer-events-none"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            {isDark ? (
              <ShiroOniGateArtifact isHovered={false} mousePos={{ x: 0, y: 0 }} />
            ) : (
              <SakuraGateArtifact isHovered={false} mousePos={{ x: 0, y: 0 }} />
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT SHOJI DOOR ── */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 border-l z-20 overflow-hidden transition-transform duration-700 ease-in-out ${
          shaking ? "hanakage-shoji-shake" : ""
        }`}
        style={{
          transform: opened ? "translateX(100%)" : "translateX(0)",
          background: modeData.doorBgRight,
          borderColor: modeData.doorBorder,
          boxShadow: opened
            ? isDark
              ? "-15px 0 45px rgba(0,0,0,0.85)"
              : "-10px 0 35px rgba(50,20,10,0.35)"
            : "none",
        }}
      >
        {/* Japanese Kumiko Geometric Lattice with Parallax Depth */}
        <div
          className="absolute inset-0 opacity-20 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(142,43,32,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(142,43,32,0.25) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 6}px)`,
          }}
        />

        {/* Interactive Corner Fittings (Kanamono) - Right Door */}
        <InteractiveCornerFitting position="top-right" isDark={isDark} mousePos={mousePos} />
        <InteractiveCornerFitting position="bottom-right" isDark={isDark} mousePos={mousePos} />

        {/* Interactive Hanging Shrine Lantern - Right Flank */}
        <div
          className="absolute right-4 sm:right-8 md:right-14 top-6 sm:top-10 transition-transform duration-300 ease-out hidden sm:block"
          style={{
            transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 8}px)`,
          }}
        >
          <InteractiveLantern
            kanji={modeData.lanternKanjiRight}
            side="right"
            isDark={isDark}
            mousePos={mousePos}
          />
        </div>

        {/* Interactive Vertical Poetry Scroll (Tanzaku) - Right Flank */}
        <div
          className="absolute right-6 sm:right-10 md:right-16 top-1/2 transition-transform duration-300 ease-out hidden md:block"
          style={{
            transform: `translate(${mousePos.x * 16}px, calc(-50% + ${mousePos.y * 10}px))`,
          }}
        >
          <InteractiveTanzaku
            kanji={modeData.tanzakuRight}
            subtitle={modeData.tanzakuSubRight}
            isDark={isDark}
            mousePos={mousePos}
          />
        </div>

        {/* RIGHT HALF OF GATE ARTIFACT (Active only when doors slide apart) */}
        {opened && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[280px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[300px] pointer-events-none"
            style={{ clipPath: "inset(0 0 0 50%)" }}
          >
            {isDark ? (
              <ShiroOniGateArtifact isHovered={false} mousePos={{ x: 0, y: 0 }} />
            ) : (
              <SakuraGateArtifact isHovered={false} mousePos={{ x: 0, y: 0 }} />
            )}
          </div>
        )}
      </div>

      {/* ── UNIFIED INTERACTIVE SACRED GATE ARTIFACT (Centered & Continuous while doors are closed) ── */}
      {!opened && (
        <div
          className="absolute left-1/2 top-1/2 w-[280px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[300px] z-30 cursor-pointer transition-opacity duration-300"
          style={{
            opacity: slashed ? 0.4 : 1,
            transform: `translate(calc(-50% + ${mousePos.x * 20}px), calc(-50% + ${mousePos.y * 14}px))`,
            transition: "transform 0.2s ease-out, opacity 0.3s ease",
          }}
          onMouseEnter={() => {
            setCenterArtifactHovered(true)
            playZenSound("wood", isDark)
          }}
          onMouseLeave={() => setCenterArtifactHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            playZenSound("chime", isDark)
          }}
        >
          {/* Rotating Sumi-e Ensō Aura on hover (Same game-like feedback as courtyard Torii) */}
          {centerArtifactHovered && (
            <div
              className="absolute -inset-10 sm:-inset-16 pointer-events-none z-0 hanakage-sumi-enso flex items-center justify-center animate-pulse"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke={isDark ? "#c8b8ff" : "#b23a2e"}
                  strokeWidth="3.2"
                  strokeDasharray="420 70"
                  strokeLinecap="round"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </div>
          )}

          <div className="relative z-10 w-full h-full transition-transform duration-300 hover:scale-105">
            {isDark ? (
              <ShiroOniGateArtifact
                isHovered={centerArtifactHovered}
                mousePos={mousePos}
              />
            ) : (
              <SakuraGateArtifact
                isHovered={centerArtifactHovered}
                mousePos={mousePos}
              />
            )}
          </div>
        </div>
      )}

      {/* ── ATMOSPHERIC INTERACTIVE FLOATING PARTICLES (Sakura Petals / Spirit Wisps) ── */}
      {!opened && (
        <InteractiveFloatingParticles isDark={isDark} mousePos={mousePos} />
      )}

      {/* ── FOREGROUND OVERLAY: TITLE, QUOTE & INTERACTIVE BUTTON ── */}
      {!opened && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-between py-10 sm:py-14 px-4 pointer-events-none transition-all duration-300"
          style={{
            opacity: slashed ? 0 : 1,
            transform: slashed
              ? "scale(0.92)"
              : `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px)`,
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
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest uppercase mt-1 font-serif text-center drop-shadow-sm"
              style={{ color: isDark ? "#ffffff" : "#2b2320" }}
            >
              {modeData.title}
            </h1>
          </div>

          {/* Bottom Interactive Slash Prompt & Quote */}
          <div className="flex flex-col items-center gap-3 pb-2 text-center max-w-md pointer-events-auto">
            <p
              className="text-xs sm:text-sm font-serif italic tracking-wide drop-shadow px-4"
              style={{ color: isDark ? "#d4ccdf" : "#5a453e", opacity: 0.9 }}
            >
              {modeData.quote}
            </p>

            {/* Glowing Katana Slash Trigger Button */}
            <button
              onClick={triggerSlash}
              className="group pointer-events-auto relative px-7 py-2.5 rounded-xl border flex items-center gap-3 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
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
                  : "0 4px 15px rgba(0,0,0,0.18)",
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
              ✦ Swipe / drag across screen or click button to slash ✦
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
 * Completely clean vectors without muddy drop-shadow artifacts.
 */
function SakuraGateArtifact({
  isHovered,
  mousePos,
}: {
  isHovered: boolean
  mousePos: { x: number; y: number }
}) {
  const tiltX = isHovered ? mousePos.y * -5 : 0
  const tiltY = isHovered ? mousePos.x * 5 : 0
  const floatY = isHovered ? mousePos.y * -4 : 0

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full h-full"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${floatY}px) scale(1.04)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered ? "transform 0.15s ease-out" : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        transformOrigin: "center center",
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
          <stop offset="0%" stopColor="#dfb78c" />
          <stop offset="100%" stopColor="#b58352" />
        </linearGradient>
      </defs>

      {/* ── Soft Ambient Radiance (Clean vector aura, no murky square shadows) ── */}
      <ellipse
        cx="160"
        cy="135"
        rx="105"
        ry="75"
        fill={isHovered ? "rgba(232, 137, 159, 0.22)" : "rgba(232, 137, 159, 0.08)"}
        className="transition-all duration-300"
      />

      {/* ── 1. SAKURA TREE BRANCH OVERHEAD ── */}
      <path
        d="M 20 45 Q 110 25 210 50 T 300 45"
        stroke="#59402f"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 40 Q 160 70 180 80"
        stroke="#59402f"
        strokeWidth="4"
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
        strokeWidth="1.6"
      />

      {/* Sacred twisted rope (Shimenawa) */}
      <path
        d="M 60 72 Q 160 92 260 72"
        stroke="#d4a373"
        strokeWidth="4.5"
        fill="none"
        strokeDasharray="5 2.5"
      />

      {/* Zigzag paper streamers (Shide) */}
      <path d="M 85 82 L 91 94 L 85 106" stroke="#fdfbf7" strokeWidth="2.8" fill="none" />
      <path d="M 235 82 L 241 94 L 235 106" stroke="#fdfbf7" strokeWidth="2.8" fill="none" />

      {/* ── 3. SACRED EMA VOTIVE BOARD ── */}
      {/* Red braided hanging cord */}
      <line x1="160" y1="44" x2="160" y2="92" stroke="#b23a2e" strokeWidth="2.2" />
      <circle cx="160" cy="92" r="3.2" fill="none" stroke="#b23a2e" strokeWidth="1.8" />

      {/* Five-sided Ema Plaque - Clean, sharp vector borders */}
      <polygon
        points="160,94 100,126 100,205 220,205 220,126"
        fill="url(#gate-wood)"
        stroke="#634324"
        strokeWidth="2"
      />

      {/* Traditional Vermilion Seal on Ema Board */}
      <circle cx="160" cy="155" r="28" fill="rgba(178,58,46,0.12)" stroke="#b23a2e" strokeWidth="1.4" />
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
      <path d="M 158 224 L 155 236 M 162 224 L 165 236" stroke="#b23a2e" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/**
 * ShiroOniGateArtifact:
 * Authentic Yamazaki Clan Shiro Oni Sacred Shrine Seal (Dark / Yūrei Mode).
 * Completely clean vectors without muddy drop-shadow artifacts.
 */
function ShiroOniGateArtifact({
  isHovered,
  mousePos,
}: {
  isHovered: boolean
  mousePos: { x: number; y: number }
}) {
  const tiltX = isHovered ? mousePos.y * -5 : 0
  const tiltY = isHovered ? mousePos.x * 5 : 0
  const floatY = isHovered ? mousePos.y * -4 : 0

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full h-full"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${floatY}px) scale(1.04)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered ? "transform 0.15s ease-out" : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        transformOrigin: "center center",
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
          <stop offset="0%" stopColor="#2a2028" />
          <stop offset="100%" stopColor="#140f13" />
        </linearGradient>

        {/* Ultra Instinct Eye Glow */}
        <filter id="ui-rune-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Soft Ambient Radiance (Clean vector aura, no murky square shadows) ── */}
      <ellipse
        cx="160"
        cy="135"
        rx="105"
        ry="75"
        fill={isHovered ? "rgba(200, 184, 255, 0.22)" : "rgba(200, 184, 255, 0.06)"}
        className="transition-all duration-300"
      />

      {/* ── 1. CHARRED BRANCH OVERHEAD ── */}
      <path
        d="M 20 45 Q 110 25 210 50 T 300 45"
        stroke="#1c1619"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 40 Q 160 70 180 80"
        stroke="#1c1619"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ghostly ash/ember blossoms */}
      <circle cx="70" cy="34" r="6" fill="#4a3b45" opacity="0.85" />
      <circle cx="230" cy="48" r="6.5" fill="#4a3b45" opacity="0.85" />

      {/* ── 2. SACRED TORII CROSSBEAM & SHIMENAWA ── */}
      {/* Curved Kasagi Beam */}
      <path
        d="M 40 52 Q 160 38 280 52 L 275 64 Q 160 50 45 64 Z"
        fill="url(#gate-vermilion-dark)"
        stroke="#7a6fa3"
        strokeWidth="1.5"
      />

      {/* Dark Shimenawa twisted rope */}
      <path
        d="M 60 72 Q 160 92 260 72"
        stroke="#615951"
        strokeWidth="4.5"
        fill="none"
        strokeDasharray="5 2.5"
      />

      {/* Zigzag paper streamers (Shide) */}
      <path d="M 85 82 L 91 94 L 85 106" stroke="#e8e2d8" strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M 235 82 L 241 94 L 235 106" stroke="#e8e2d8" strokeWidth="2.5" fill="none" opacity="0.85" />

      {/* ── 3. YAMAZAKI CLAN SHIRO ONI EMA VOTIVE BOARD ── */}
      {/* Deep purple/crimson hanging cord */}
      <line x1="160" y1="44" x2="160" y2="92" stroke="#7a6fa3" strokeWidth="2.2" />
      <circle cx="160" cy="92" r="3.2" fill="none" stroke="#7a6fa3" strokeWidth="1.8" />

      {/* Five-sided Ema Plaque - Clean, sharp vector borders */}
      <polygon
        points="160,94 100,126 100,205 220,205 220,126"
        fill="url(#gate-wood-dark)"
        stroke="#594d61"
        strokeWidth="2"
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
      <circle cx="160" cy="168" r="22" fill="rgba(122,111,163,0.15)" stroke="#7a6fa3" strokeWidth="1.4" />
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

/**
 * Interactive Corner Fittings (Kanamono / 四隅の飾り金具)
 * Reactive to hover and click with metallic gleam and clink sound.
 */
function InteractiveCornerFitting({
  position,
  isDark,
  mousePos,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  isDark: boolean
  mousePos: { x: number; y: number }
}) {
  const [isHovered, setIsHovered] = useState(false)
  const isTop = position.startsWith("top")
  const isLeft = position.endsWith("left")

  const transform = `${isTop ? "" : "scaleY(-1)"} ${isLeft ? "" : "scaleX(-1)"}`
  const metalColor = isHovered
    ? isDark
      ? "#6b5c7c"
      : "#e5b95a"
    : isDark
    ? "#483d54"
    : "#c49a45"
  const rivetColor = isDark ? "#c8b8ff" : "#b23a2e"
  const edgeColor = isDark ? "#2a2232" : "#7d5a1b"

  return (
    <div
      className="absolute z-10 w-12 h-12 sm:w-16 sm:h-16 cursor-pointer transition-all duration-300"
      style={{
        top: isTop ? 8 : "auto",
        bottom: !isTop ? 8 : "auto",
        left: isLeft ? 8 : "auto",
        right: !isLeft ? 8 : "auto",
        transform: `${transform} scale(${isHovered ? 1.15 : 1}) translate(${
          mousePos.x * 6
        }px, ${mousePos.y * 6}px)`,
        filter: isHovered
          ? `drop-shadow(0 0 10px ${isDark ? "#c8b8ff" : "#ffd700"})`
          : "none",
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        playZenSound("wood", isDark)
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        playZenSound("chime", isDark)
      }}
      title="Ornamental Kanamono Corner Fitting"
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {/* L-bracket metal plate */}
        <path
          d="M 4 4 L 56 4 L 56 16 L 16 16 L 16 56 L 4 56 Z"
          fill={metalColor}
          stroke={edgeColor}
          strokeWidth="1.5"
          className="transition-colors duration-200"
        />
        {/* Decorative inner flourish curve */}
        <path
          d="M 16 16 Q 32 32 16 48"
          stroke={edgeColor}
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
        {/* Sacred rivet pins (Kugikakushi) */}
        <circle cx="10" cy="10" r="3" fill={rivetColor} stroke={edgeColor} strokeWidth="1" />
        <circle cx="48" cy="10" r="2.2" fill={rivetColor} />
        <circle cx="10" cy="48" r="2.2" fill={rivetColor} />
      </svg>
    </div>
  )
}

/**
 * Interactive Japanese Lantern (Chōchin / 提灯):
 * Swings with physics when hovered or clicked, flare candle flame and plays chime.
 */
function InteractiveLantern({
  kanji,
  side,
  isDark,
  mousePos,
}: {
  kanji: string
  side: "left" | "right"
  isDark: boolean
  mousePos: { x: number; y: number }
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [swingImpulse, setSwingImpulse] = useState(0)

  const handleMouseEnter = () => {
    setIsHovered(true)
    playZenSound("flame", isDark)
    setSwingImpulse(side === "left" ? 6 : -6)
    setTimeout(() => setSwingImpulse(0), 700)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playZenSound("flame", isDark)
    playZenSound("chime", isDark)
    setSwingImpulse(side === "left" ? 14 : -14)
    setTimeout(() => setSwingImpulse(0), 900)
  }

  const woodColor = isDark ? "#1b1420" : "#4a1c14"
  const paperBg = isHovered
    ? isDark
      ? "radial-gradient(circle at 50% 50%, #443452 0%, #1c1524 100%)"
      : "radial-gradient(circle at 50% 50%, #fffbf2 0%, #fae6cb 100%)"
    : isDark
    ? "radial-gradient(circle at 50% 50%, #2e2438 0%, #17111d 100%)"
    : "radial-gradient(circle at 50% 50%, #fff7eb 0%, #f3dec2 100%)"
  const glowColor = isHovered
    ? isDark
      ? "rgba(200, 184, 255, 0.75)"
      : "rgba(255, 190, 90, 0.8)"
    : isDark
    ? "rgba(200, 184, 255, 0.35)"
    : "rgba(255, 180, 80, 0.4)"
  const kanjiColor = isDark ? "#c8b8ff" : "#8e2b20"
  const tasselColor = isDark ? "#7a6fa3" : "#b23a2e"

  // Base sway from cursor distance + impulse
  const dynamicTilt = (mousePos.x * (side === "left" ? -4 : 4)) + swingImpulse

  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-transform duration-300 ease-out select-none"
      style={{
        transformOrigin: "top center",
        transform: `rotate(${dynamicTilt}deg) scale(${isHovered ? 1.08 : 1})`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title="Sacred Shrine Lantern - Click to swing & chime"
    >
      {/* Top Braided Hanging Cord */}
      <div
        className="w-[2px] h-8 sm:h-12 transition-colors duration-200"
        style={{ background: isDark ? "#594d68" : "#8e2b20" }}
      />

      {/* Top Roof Cap (Kasagi) */}
      <div
        className="w-11 sm:w-13 h-2 rounded-t-sm border transition-colors"
        style={{
          background: woodColor,
          borderColor: isDark ? "#483a54" : "#2b100a",
        }}
      />

      {/* Translucent Lantern Body */}
      <div
        className="relative w-9 sm:w-11 h-14 sm:h-16 rounded-md border flex items-center justify-center my-0.5 transition-all duration-300"
        style={{
          background: paperBg,
          borderColor: isDark ? "#594d68" : "#caa174",
          boxShadow: `0 0 ${isHovered ? "28px" : "16px"} ${glowColor}`,
        }}
      >
        {/* Subtle Horizontal Ribs (Hone) */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-25">
          <div className="w-full h-[1px] bg-black" />
          <div className="w-full h-[1px] bg-black" />
          <div className="w-full h-[1px] bg-black" />
        </div>

        {/* Center Kanji */}
        <span
          className="font-serif font-black text-sm sm:text-base select-none z-10 transition-transform duration-200"
          style={{
            color: kanjiColor,
            transform: isHovered ? "scale(1.15)" : "scale(1)",
          }}
        >
          {kanji}
        </span>
      </div>

      {/* Bottom Wood Base */}
      <div
        className="w-10 sm:w-12 h-1.5 rounded-b-sm border"
        style={{
          background: woodColor,
          borderColor: isDark ? "#483a54" : "#2b100a",
        }}
      />

      {/* Bottom Hanging Silk Tassel (Fusa) */}
      <div
        className="flex flex-col items-center mt-0.5 transition-transform duration-500"
        style={{
          transform: `rotate(${dynamicTilt * 1.5}deg)`,
          transformOrigin: "top center",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: tasselColor }} />
        <div
          className="w-[1.5px] h-5 sm:h-7"
          style={{
            background: `linear-gradient(to bottom, ${tasselColor}, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * Interactive Vertical Tanzaku Poetry Scroll (短冊)
 * Flutters on hover, plays bamboo/paper rustle sound, and pulses on click.
 */
function InteractiveTanzaku({
  kanji,
  subtitle,
  isDark,
  mousePos,
}: {
  kanji: string
  subtitle: string
  isDark: boolean
  mousePos: { x: number; y: number }
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    playZenSound("paper", isDark)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playZenSound("bamboo", isDark)
    setClicked(true)
    setTimeout(() => setClicked(false), 500)
  }

  const flutterAngle = isHovered ? (mousePos.x > 0 ? 5 : -5) : 0

  return (
    <div
      className="px-2.5 py-4 rounded border flex flex-col items-center gap-2 backdrop-blur-sm cursor-pointer select-none transition-all duration-300"
      style={{
        background: isHovered
          ? isDark
            ? "rgba(28, 22, 36, 0.9)"
            : "rgba(255, 253, 248, 0.95)"
          : isDark
          ? "rgba(18, 14, 23, 0.72)"
          : "rgba(255, 250, 242, 0.78)",
        borderColor: isHovered
          ? isDark
            ? "#c8b8ff"
            : "#b23a2e"
          : isDark
          ? "rgba(180, 160, 255, 0.2)"
          : "rgba(178, 58, 46, 0.2)",
        transform: `rotate(${flutterAngle}deg) scale(${
          clicked ? 1.12 : isHovered ? 1.08 : 1
        }) translateY(${isHovered ? -6 : 0}px)`,
        boxShadow: isHovered
          ? `0 10px 25px ${
              isDark ? "rgba(200, 184, 255, 0.3)" : "rgba(178, 58, 46, 0.25)"
            }`
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title="Sacred Tanzaku Scroll - Click to interact"
    >
      {/* Top decorative cord loop */}
      <div
        className="w-1 h-3 rounded-full mb-1 transition-transform"
        style={{
          background: isDark ? "#7a6fa3" : "#b23a2e",
          transform: isHovered ? "scaleY(1.3)" : "scaleY(1)",
        }}
      />

      {/* Vertical Japanese Kanji Characters */}
      <div
        className="font-serif font-bold text-sm tracking-widest leading-relaxed select-none transition-transform"
        style={{
          writingMode: "vertical-rl",
          color: isHovered
            ? isDark
              ? "#ffffff"
              : "#000000"
            : isDark
            ? "#e4dcff"
            : "#3e2e28",
        }}
      >
        {kanji}
      </div>

      {/* Red Hanko Stamp / Seal */}
      <div
        className="w-4 h-4 rounded-sm border flex items-center justify-center text-[8px] font-serif font-black mt-2 transition-transform duration-200"
        style={{
          borderColor: isDark ? "#c8b8ff" : "#b23a2e",
          color: isDark ? "#c8b8ff" : "#b23a2e",
          background: isDark ? "rgba(200, 184, 255, 0.15)" : "rgba(178, 58, 46, 0.12)",
          transform: isHovered ? "rotate(12deg) scale(1.1)" : "rotate(0deg)",
        }}
      >
        印
      </div>

      {/* Tiny Subtitle */}
      <span
        className="text-[7px] font-mono tracking-tighter uppercase opacity-50 mt-1"
        style={{
          writingMode: "vertical-rl",
          color: isDark ? "#a79cb5" : "#7c6861",
        }}
      >
        {subtitle}
      </span>
    </div>
  )
}

/**
 * Interactive Floating Particles (Sakura Petals or Spirit Flames)
 * Reacts to mouse movement and clicks with evasive burst physics.
 */
function InteractiveFloatingParticles({
  isDark,
  mousePos,
}: {
  isDark: boolean
  mousePos: { x: number; y: number }
}) {
  const petals = [
    { id: 1, top: "18%", left: "20%", dur: "7s", scale: 0.9 },
    { id: 2, top: "25%", right: "22%", dur: "8s", scale: 1.1 },
    { id: 3, top: "65%", left: "15%", dur: "6.5s", scale: 0.8 },
    { id: 4, top: "70%", right: "25%", dur: "7.5s", scale: 1 },
    { id: 5, top: "42%", left: "28%", dur: "9s", scale: 0.95 },
    { id: 6, top: "35%", right: "32%", dur: "7.2s", scale: 0.85 },
  ]

  const [poppedIds, setPoppedIds] = useState<number[]>([])

  const handleParticleClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    playZenSound("bamboo", isDark)
    setPoppedIds((prev) => [...prev, id])
    setTimeout(() => {
      setPoppedIds((prev) => prev.filter((p) => p !== id))
    }, 2000)
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-24 overflow-hidden">
      {isDark ? (
        <>
          {/* Interactive Spirit Onibi Wisps */}
          <div
            className="absolute left-[15%] top-[35%] w-3.5 h-3.5 rounded-full blur-[2px] cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-150"
            style={{
              background: "#c8b8ff",
              boxShadow: "0 0 18px rgba(200, 184, 255, 0.85)",
              transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 20}px)`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              playZenSound("flame", true)
            }}
            title="Onibi Spirit Wisp"
          />
          <div
            className="absolute right-[18%] top-[42%] w-3 h-3 rounded-full blur-[2px] cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-150"
            style={{
              background: "#a78bfa",
              boxShadow: "0 0 15px rgba(167, 139, 250, 0.8)",
              transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -16}px)`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              playZenSound("flame", true)
            }}
            title="Onibi Spirit Wisp"
          />
        </>
      ) : (
        <>
          {/* Interactive Drifting Sakura Petals */}
          {petals.map((petal) => {
            const isPopped = poppedIds.includes(petal.id)
            if (isPopped) return null

            return (
              <div
                key={petal.id}
                className="absolute cursor-pointer pointer-events-auto opacity-70 transition-transform duration-300 hover:scale-150 active:scale-125"
                style={{
                  top: petal.top,
                  left: petal.left,
                  right: petal.right,
                  transform: `scale(${petal.scale}) translate(${
                    mousePos.x * 30
                  }px, ${mousePos.y * 25}px)`,
                  animation: `hanakage-intro-petal ${petal.dur} ease-in-out infinite`,
                }}
                onClick={(e) => handleParticleClick(petal.id, e)}
                title="Sakura Petal - Click to pop"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffb7c5">
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
