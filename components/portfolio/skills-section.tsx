"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider, SkillMark } from "./motifs"

const SKILLS = ["UI", "UX", "React", "Next.js", "TS", "Motion", "Canvas", "Figma"]

export function SkillsSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()

  return (
    <section id="skills" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Keahlian</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Segel yang Saya Bawa</h2>
        <BrushDivider />
        <div className="flex flex-wrap gap-5 mt-8">
          {SKILLS.map((skill) => (
            <SkillMark key={skill} label={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}
