"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { usePortfolioData } from "./portfolio-data-provider"
import { BrushDivider, SkillMark } from "./motifs"

export function SkillsSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { skills } = usePortfolioData()

  return (
    <section id="skills" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Skills</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Skills &amp; Technologies</h2>
        <BrushDivider />
        <div className="flex flex-wrap gap-5 mt-8">
          {skills.map((skill) => (
            <SkillMark key={skill.id || skill.name} label={skill.name} />
          ))}
        </div>
      </div>
    </section>
  )
}

