"use client"

import React, { useRef, useEffect } from "react"
import { useEmaki } from "./emaki-context"
import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { SkillsSection } from "./skills-section"
import { ProjectsSection } from "./projects-section"
import { ContactSection } from "./contact-section"

export function EmakiContainer() {
  const { activeSection, nextSection, prevSection, sections } = useEmaki()
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const wheelCooldown = useRef(false)

  // Wheel horizontal navigation with cooldown
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      // Don't intercept if user is scrolling inside a scrollable child that still has scroll room
      const target = e.target as HTMLElement | null
      const scrollable = target?.closest(".emaki-scrollable") as HTMLElement | null
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0
        const atBottom = scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 2
        // Only allow horizontal page navigation if at the edges
        if (e.deltaY > 0 && !atBottom) return
        if (e.deltaY < 0 && !atTop) return
      }

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 40 || wheelCooldown.current) return

      wheelCooldown.current = true
      if (delta > 0) {
        nextSection()
      } else {
        prevSection()
      }

      setTimeout(() => {
        wheelCooldown.current = false
      }, 700)
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [nextSection, prevSection])

  // Touch swipe handling
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Ensure it's a predominantly horizontal swipe
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        nextSection()
      } else {
        prevSection()
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  // Ensure scrollable panel scrolls back to top when navigated
  const containerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = containerRefs.current[activeSection]
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [activeSection])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-text"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Horizontal Sliding Emaki Scroll Track */}
      <div
        className="flex h-screen w-[500vw] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `translateX(-${activeSection * 100}vw)`,
        }}
      >
        {/* Section 0: Hero / 序章 */}
        <div
          ref={(el) => {
            containerRefs.current[0] = el
          }}
          className="emaki-scrollable w-screen h-screen flex-shrink-0 overflow-y-auto px-4 sm:px-16 pt-20 pb-28 flex flex-col justify-center items-center relative"
        >
          <div className="w-full max-w-4xl mx-auto">
            <HeroSection />
          </div>
        </div>

        {/* Section 1: About / 物語 */}
        <div
          ref={(el) => {
            containerRefs.current[1] = el
          }}
          className="emaki-scrollable w-screen h-screen flex-shrink-0 overflow-y-auto px-4 sm:px-16 pt-20 pb-28 flex flex-col justify-center items-center relative"
        >
          <div className="w-full max-w-4xl mx-auto">
            <AboutSection />
          </div>
        </div>

        {/* Section 2: Skills / 印章 */}
        <div
          ref={(el) => {
            containerRefs.current[2] = el
          }}
          className="emaki-scrollable w-screen h-screen flex-shrink-0 overflow-y-auto px-4 sm:px-16 pt-20 pb-28 flex flex-col justify-center items-center relative"
        >
          <div className="w-full max-w-4xl mx-auto">
            <SkillsSection />
          </div>
        </div>

        {/* Section 3: Projects / 絵巻 */}
        <div
          ref={(el) => {
            containerRefs.current[3] = el
          }}
          className="emaki-scrollable w-screen h-screen flex-shrink-0 overflow-y-auto px-4 sm:px-16 pt-20 pb-28 flex flex-col justify-center items-center relative"
        >
          <div className="w-full max-w-4xl mx-auto">
            <ProjectsSection />
          </div>
        </div>

        {/* Section 4: Contact / 結び */}
        <div
          ref={(el) => {
            containerRefs.current[4] = el
          }}
          className="emaki-scrollable w-screen h-screen flex-shrink-0 overflow-y-auto px-4 sm:px-16 pt-20 pb-28 flex flex-col justify-center items-center relative"
        >
          <div className="w-full max-w-4xl mx-auto">
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  )
}
