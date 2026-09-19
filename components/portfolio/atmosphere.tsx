"use client"

import { useEffect, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"
import { CrowFlight } from "./motifs"

export function Atmosphere() {
  const { theme } = useHanakageTheme()
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (theme !== "yurei") return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    function handleMove(e: PointerEvent) {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
        glowRef.current.style.opacity = "1"
      }
    }
    function handleLeave() {
      if (glowRef.current) glowRef.current.style.opacity = "0"
    }
    window.addEventListener("pointermove", handleMove, { passive: true })
    window.addEventListener("pointerleave", handleLeave)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerleave", handleLeave)
    }
  }, [theme])

  return (
    <>
      <div className="hanakage-bg hanakage-flicker-layer" aria-hidden="true" />
      <div className="hanakage-grain" aria-hidden="true" />
      <div className="hanakage-vignette" aria-hidden="true" />
      <div className="hanakage-fog" aria-hidden="true" />
      <div className="hanakage-scanlines" aria-hidden="true" />
      {theme === "yurei" && <div ref={glowRef} className="hanakage-cursor-glow" style={{ opacity: 0 }} aria-hidden="true" />}
      <CrowFlight />
    </>
  )
}
