"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useHanakageTheme } from "./theme-provider"
import { playZenSound } from "@/lib/sound"

export interface EmakiSectionInfo {
  id: string
  title: string
  kanji: string
  numeral: string
  subtitle: string
  kanjiNumber: string
}

export const EMAKI_SECTIONS: EmakiSectionInfo[] = [
  { id: "hero", title: "Beranda", kanji: "始", numeral: "01", subtitle: "序章", kanjiNumber: "一" },
  { id: "about", title: "Tentang", kanji: "影", numeral: "02", subtitle: "物語", kanjiNumber: "二" },
  { id: "skills", title: "Keahlian", kanji: "印", numeral: "03", subtitle: "印章", kanjiNumber: "三" },
  { id: "projects", title: "Karya", kanji: "卷", numeral: "04", subtitle: "絵巻", kanjiNumber: "四" },
  { id: "contact", title: "Kontak", kanji: "結", numeral: "05", subtitle: "結び", kanjiNumber: "五" },
]

interface EmakiContextType {
  activeSection: number
  sections: typeof EMAKI_SECTIONS
  goToSection: (index: number) => void
  nextSection: () => void
  prevSection: () => void
  soundEnabled: boolean
  toggleSound: () => void
  isDragging: boolean
}

const EmakiContext = createContext<EmakiContextType | null>(null)

export function EmakiProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  const triggerWind = useCallback((direction: "next" | "prev") => {
    if (typeof window === "undefined") return
    const dir = direction === "next" ? -1.8 : 1.8
    window.dispatchEvent(
      new CustomEvent("hanakage:wind", {
        detail: { dir, speed: 3.5 },
      }),
    )
  }, [])

  const goToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= EMAKI_SECTIONS.length || index === activeSection) return
      const direction = index > activeSection ? "next" : "prev"
      triggerWind(direction)
      setActiveSection(index)

      if (soundEnabled) {
        playZenSound(index === 0 ? "chime" : "wood", isDark)
      }

      // Update URL hash without jumping
      try {
        window.history.replaceState(null, "", `#${EMAKI_SECTIONS[index].id}`)
      } catch {}
    },
    [activeSection, isDark, soundEnabled, triggerWind],
  )

  const nextSection = useCallback(() => {
    if (activeSection < EMAKI_SECTIONS.length - 1) {
      goToSection(activeSection + 1)
    }
  }, [activeSection, goToSection])

  const prevSection = useCallback(() => {
    if (activeSection > 0) {
      goToSection(activeSection - 1)
    }
  }, [activeSection, goToSection])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev
      if (next) playZenSound("chime", isDark)
      return next
    })
  }, [isDark])

  // Sync with initial URL hash
  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      const foundIndex = EMAKI_SECTIONS.findIndex((s) => s.id === hash)
      if (foundIndex !== -1) {
        setActiveSection(foundIndex)
      }
    }
  }, [])

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in form inputs or textareas
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return
      }

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        nextSection()
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        prevSection()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSection, prevSection])

  return (
    <EmakiContext.Provider
      value={{
        activeSection,
        sections: EMAKI_SECTIONS,
        goToSection,
        nextSection,
        prevSection,
        soundEnabled,
        toggleSound,
        isDragging,
      }}
    >
      {children}
    </EmakiContext.Provider>
  )
}

export function useEmaki() {
  const context = useContext(EmakiContext)
  if (!context) {
    throw new Error("useEmaki must be used within an EmakiProvider")
  }
  return context
}
