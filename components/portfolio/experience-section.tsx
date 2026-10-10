"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider } from "./motifs"
import { usePortfolioData } from "./portfolio-data-provider"
import type { Experience } from "@/lib/supabase/types"

function ExperienceCard({
  item,
  index,
}: {
  item: Experience
  index: number
}) {
  const revealRef = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={revealRef}
      className="hanakage-reveal hanakage-card p-6 flex flex-col gap-3"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h3 className="hanakage-heading text-xl font-bold">{item.role}</h3>
          <p className="hanakage-body-text text-sm mt-0.5 font-medium opacity-80">
            {item.organization}
          </p>
        </div>
        <span
          className="shrink-0 text-xs font-mono px-3 py-1 border rounded-full self-start"
          style={{
            borderColor: "var(--accent-seal)",
            color: "var(--accent-seal)",
            background: "rgba(178, 58, 46, 0.06)",
          }}
        >
          {item.period}
        </span>
      </div>
      <div
        className="w-full h-px opacity-20"
        style={{ background: "var(--text-muted)" }}
      />
      <p className="hanakage-body-text text-sm leading-relaxed whitespace-pre-line">
        {item.description}
      </p>
    </div>
  )
}

export function ExperienceSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { experiences } = usePortfolioData()

  return (
    <section id="experience" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Experience</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">
          Where I&apos;ve Walked
        </h2>
        <BrushDivider />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {experiences.length === 0 ? (
          <div className="py-12 px-6 text-center border border-dashed rounded-xl border-stone-500/20 opacity-60 text-sm hanakage-body-text">
            Belum ada riwayat pengalaman yang ditambahkan.
          </div>
        ) : (
          experiences.map((item, index) => (
            <ExperienceCard key={item.id || index} item={item} index={index} />
          ))
        )}
      </div>
    </section>
  )
}

