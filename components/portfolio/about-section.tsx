"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { usePortfolioData } from "./portfolio-data-provider"
import { ToriiSilhouette, BrushDivider } from "./motifs"

export function AboutSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { about, loading } = usePortfolioData()

  return (
    <section id="about" className="hanakage-section relative overflow-hidden">
      <ToriiSilhouette className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-72 pointer-events-none" />

      <div ref={revealRef} className="hanakage-reveal relative max-w-2xl">
        <p className="hanakage-eyebrow mb-4">{about?.eyebrow ?? "Tentang"}</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">{about?.heading ?? ""}</h2>
        <BrushDivider />
        {!loading && (
          <>
            <p className="hanakage-body-text text-base md:text-lg">{about?.paragraph_1}</p>
            <p className="hanakage-body-text text-base md:text-lg mt-4">{about?.paragraph_2}</p>
          </>
        )}
      </div>
    </section>
  )
}
