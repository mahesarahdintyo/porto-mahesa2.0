"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider } from "./motifs"

const PROJECTS = [
  {
    title: "Washi & Wire",
    description: "Sistem desain untuk studio kerajinan tradisional dengan sentuhan digital modern.",
    tag: "Design System",
  },
  {
    title: "Kage no Niwa",
    description: "Pengalaman web interaktif yang menggabungkan partikel fisika dengan narasi visual.",
    tag: "Interactive",
  },
  {
    title: "Tsuki Journal",
    description: "Aplikasi jurnal minimalis dengan tema yang berubah sesuai waktu dan suasana.",
    tag: "Product",
  },
  {
    title: "Yoru no Kaze",
    description: "Instalasi audio-visual yang merespons gerakan pengunjung secara real-time.",
    tag: "Experiment",
  },
]

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const revealRef = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={revealRef}
      className="hanakage-reveal hanakage-card hanakage-torn p-6 relative"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <span className="hanakage-tape" aria-hidden="true" />
      <p className="hanakage-eyebrow mb-3 text-xs">{project.tag}</p>
      <h3 className="hanakage-heading text-2xl mb-2">{project.title}</h3>
      <p className="hanakage-body-text text-sm">{project.description}</p>
    </div>
  )
}

export function ProjectsSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()

  return (
    <section id="projects" className="hanakage-section">
      <div ref={revealRef} className="hanakage-reveal">
        <p className="hanakage-eyebrow mb-4">Karya</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Kertas yang Ditempel</h2>
        <BrushDivider />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 mt-8">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
