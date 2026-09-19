"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { usePortfolioData } from "./portfolio-data-provider"
import { BrushDivider } from "./motifs"
import type { Project } from "@/lib/supabase/types"

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const revealRef = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={revealRef}
      className="hanakage-reveal hanakage-card hanakage-torn p-6 relative flex flex-col justify-between"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div>
        <span className="hanakage-tape" aria-hidden="true" />
        <p className="hanakage-eyebrow mb-3 text-xs">{project.tag}</p>
        <h3 className="hanakage-heading text-2xl mb-2">{project.title}</h3>
        <p className="hanakage-body-text text-sm">{project.description}</p>
      </div>

      {(project.link_url && project.link_url !== "#" || project.github_url) && (
        <div className="mt-4 pt-3 flex gap-4 text-xs font-mono border-t border-dashed border-current/10">
          {project.link_url && project.link_url !== "#" && (
            <a
              href={project.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline opacity-80 hover:opacity-100"
            >
              Demo ↗
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline opacity-80 hover:opacity-100"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function ProjectsSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { projects } = usePortfolioData()

  return (
    <section id="projects" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Karya</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Kertas yang Ditempel</h2>
        <BrushDivider />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 mt-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

