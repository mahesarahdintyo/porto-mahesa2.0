"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider } from "./motifs"

interface ExperienceItem {
  role: string
  organization: string
  period: string
  description: string
}

// Static placeholder data — replace via admin panel / Supabase later
const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Fullstack Developer",
    organization: "Freelance / Personal Projects",
    period: "2023 — Present",
    description:
      "Designing and developing end-to-end web applications using Next.js, TypeScript, and Supabase. Crafting interactive UI experiences with a focus on performance, accessibility, and aesthetic detail.",
  },
  {
    role: "Frontend Developer Intern",
    organization: "Company / Organization Name",
    period: "Month Year — Month Year",
    description:
      "Collaborated with the design team to implement responsive interfaces. Contributed to codebase improvements, component library development, and UI consistency across the platform.",
  },
]

function ExperienceCard({
  item,
  index,
}: {
  item: ExperienceItem
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
      <p className="hanakage-body-text text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  )
}

export function ExperienceSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()

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
        {EXPERIENCES.map((item, index) => (
          <ExperienceCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
