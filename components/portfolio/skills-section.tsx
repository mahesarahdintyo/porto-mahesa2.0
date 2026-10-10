"use client"

import { useState, useMemo } from "react"
import { useScrollReveal } from "./use-scroll-reveal"
import { usePortfolioData } from "./portfolio-data-provider"
import { BrushDivider } from "./motifs"
import { TechIcon } from "./tech-icons"
import { useHanakageTheme } from "./theme-provider"
import { LayoutGrid, Code2, Layers, Puzzle, Wrench, Network } from "lucide-react"

const CATEGORY_FILTERS = [
  { id: "ALL",          label: "Semua",        icon: LayoutGrid },
  { id: "Programming",  label: "Programming",  icon: Code2      },
  { id: "Frontend",     label: "Frontend",     icon: Layers     },
  { id: "Backend",      label: "Backend",      icon: Network    },
  { id: "Tools",        label: "Tools",        icon: Wrench     },
  { id: "Design",       label: "Design",       icon: Puzzle     },
] as const

type FilterId = typeof CATEGORY_FILTERS[number]["id"]

function SkillCard({
  name,
  category,
  index,
  isDark,
}: {
  name: string
  category: string
  index: number
  isDark: boolean
}) {
  return (
    <div
      className="group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 cursor-default select-none"
      style={{
        animationDelay: `${index * 0.05}s`,
        borderColor: isDark ? "rgba(122, 111, 163, 0.18)" : "rgba(178, 58, 46, 0.15)",
        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 0%, rgba(122,111,163,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 0%, rgba(178,58,46,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="w-10 h-10 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
        style={{ background: isDark ? "rgba(122,111,163,0.1)" : "rgba(178,58,46,0.07)" }}
      >
        <TechIcon name={name} size={24} className="w-6 h-6" />
      </div>
      <span className="text-xs font-mono text-center leading-tight font-medium" style={{ color: "var(--text-primary)" }}>
        {name}
      </span>
      <span
        className="text-[9px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity duration-200"
        style={{ color: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)" }}
      >
        {category}
      </span>
    </div>
  )
}

export function SkillsSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { skills } = usePortfolioData()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const [activeFilter, setActiveFilter] = useState<FilterId>("ALL")

  const availableFilters = useMemo(() => {
    const usedCategories = new Set(skills.map((s) => s.category))
    return CATEGORY_FILTERS.filter((f) => f.id === "ALL" || usedCategories.has(f.id))
  }, [skills])

  const filteredSkills = useMemo(() => {
    if (activeFilter === "ALL") return skills
    return skills.filter((s) => s.category === activeFilter)
  }, [skills, activeFilter])

  return (
    <section id="skills" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Skills</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Skills &amp; Technologies</h2>
        <BrushDivider />
      </div>

      {availableFilters.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-8 mb-6" role="tablist" aria-label="Filter skills">
          {availableFilters.map((filter) => {
            const isActive = activeFilter === filter.id
            const IconComp = filter.icon
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: isActive ? (isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)") : (isDark ? "rgba(122,111,163,0.2)" : "rgba(178,58,46,0.2)"),
                  background: isActive ? (isDark ? "rgba(122,111,163,0.2)" : "rgba(178,58,46,0.1)") : "transparent",
                  color: isActive ? (isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)") : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <IconComp size={13} />
                {filter.label}
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{
                    background: isActive ? (isDark ? "rgba(122,111,163,0.3)" : "rgba(178,58,46,0.15)") : "rgba(128,128,128,0.1)",
                    color: isActive ? (isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)") : "var(--text-muted)",
                  }}
                >
                  {filter.id === "ALL" ? skills.length : skills.filter((s) => s.category === filter.id).length}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {filteredSkills.length === 0 ? (
        <div className="py-12 px-6 text-center border border-dashed rounded-xl border-stone-500/20 opacity-60 text-sm hanakage-body-text">
          Belum ada keahlian yang ditambahkan.
        </div>
      ) : (
        <div
          key={activeFilter}
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", animation: "hanakage-fade-up 0.35s ease both" }}
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id || skill.name} name={skill.name} category={skill.category} index={index} isDark={isDark} />
          ))}
        </div>
      )}
    </section>
  )
}
