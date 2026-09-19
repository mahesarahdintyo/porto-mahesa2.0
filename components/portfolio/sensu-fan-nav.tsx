"use client"

import React, { useState, useEffect, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"
import { playZenSound } from "@/lib/sound"
import { ShrineId } from "./shrine-chamber-modal"

interface SensuFanNavProps {
  onSelectShrine: (id: ShrineId) => void
  activeShrine: ShrineId | null
}

const BLADES = [
  { id: "hero" as ShrineId, kanji: "始", title: "Beranda", angle: -50 },
  { id: "about" as ShrineId, kanji: "影", title: "Tentang", angle: -25 },
  { id: "skills" as ShrineId, kanji: "印", title: "Keahlian", angle: 0 },
  { id: "projects" as ShrineId, kanji: "卷", title: "Karya", angle: 25 },
  { id: "contact" as ShrineId, kanji: "結", title: "Kontak", angle: 50 },
]

export function SensuFanNav({ onSelectShrine, activeShrine }: SensuFanNavProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const [isOpen, setIsOpen] = useState(false)
  const firstRender = useRef(true)

  // After mount, mark as no longer first render — avoids SSR diff
  useEffect(() => {
    firstRender.current = false
  }, [])

  const toggleFan = () => {
    setIsOpen((prev) => !prev)
    playZenSound(!isOpen ? "wood" : "paper", isDark)
  }

  const handleSelect = (id: ShrineId) => {
    playZenSound("chime", isDark)
    onSelectShrine(id)
    setIsOpen(false)
  }

  return (
    <nav
      aria-label="Navigasi Kipas Sensu"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "auto",
      }}
    >
      {/* Fan blades — only shown when open and on client */}
      {isOpen && (
        <div
          style={{
            position: "relative",
            width: 260,
            height: 260,
            marginBottom: 8,
            pointerEvents: "none",
          }}
        >
          {BLADES.map((blade, idx) => {
            const isSelected = activeShrine === blade.id
            return (
              <button
                key={blade.id}
                type="button"
                onClick={() => handleSelect(blade.id)}
                title={blade.title}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 40,
                  width: 44,
                  height: 160,
                  transformOrigin: "50% 100%",
                  transform: `rotate(${blade.angle}deg)`,
                  borderRadius: "22px 22px 4px 4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingTop: 10,
                  background: isSelected
                    ? isDark
                      ? "linear-gradient(180deg, #7a6fa3 0%, #2a2238 100%)"
                      : "linear-gradient(180deg, #b23a2e 0%, #ecd8bd 100%)"
                    : isDark
                      ? "linear-gradient(180deg, #2b2438 0%, #17131e 100%)"
                      : "linear-gradient(180deg, #fff7eb 0%, #e6d3ba 100%)",
                  border: "1px solid",
                  borderColor: isSelected
                    ? isDark ? "#bfa8ff" : "#b23a2e"
                    : "var(--border-color)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  zIndex: 5 - idx,
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transitionDelay: `${idx * 35}ms`,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isSelected ? "#fff" : isDark ? "#d3c8f5" : "#5a1f18",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {blade.kanji}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    writingMode: "vertical-rl",
                    marginTop: 6,
                    opacity: 0.75,
                    color: isSelected ? "#fff" : "var(--text-muted)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {blade.title}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Fan toggle button */}
      <button
        type="button"
        onClick={toggleFan}
        aria-label={isOpen ? "Tutup Kipas Navigasi" : "Buka Kipas Navigasi (扇子)"}
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 9999,
          border: "1px solid",
          borderColor: isOpen
            ? isDark ? "#bfa8ff" : "#b23a2e"
            : "var(--border-color)",
          background: isDark ? "rgba(25,20,32,0.92)" : "rgba(255,250,242,0.95)",
          color: "var(--text-primary)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <span style={{ fontSize: 16 }}>🪭</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontFamily: "var(--font-heading)",
            color: isDark ? "#d3c8f5" : "#5a1f18",
          }}
        >
          {isOpen ? "Tutup 扇子" : "Navigasi 扇子"}
        </span>
      </button>
    </nav>
  )
}
