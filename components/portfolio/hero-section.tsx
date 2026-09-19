"use client"

import { useHanakageTheme } from "./theme-provider"
import { usePortfolioData } from "./portfolio-data-provider"
import { GhostKanji } from "./motifs"

export function HeroSection() {
  const { theme } = useHanakageTheme()
  const { profile, loading } = usePortfolioData()
  const isDark = theme === "yurei"

  return (
    <section id="hero" className="hanakage-section min-h-[90vh] flex flex-col justify-center relative">
      <GhostKanji char="影" top="18%" left="72%" delay={0} />
      <GhostKanji char="夢" top="65%" left="10%" delay={6} />

      <p className="hanakage-eyebrow mb-6">
        <span aria-hidden="true">{isDark ? "幽霊" : "花見"}</span>
        {isDark ? "Yūrei Mode" : "Hanami Mode"}
      </p>

      <h1
        className={`hanakage-heading text-balance ${isDark ? "hanakage-heading-glitch" : ""}`}
        style={{ fontSize: "clamp(2.75rem, 9vw, 6rem)", fontWeight: 500 }}
      >
        {loading ? (
          <span className="opacity-0">—</span>
        ) : (
          profile?.name ?? ""
        )}
      </h1>

      <p className="hanakage-body-text mt-6 max-w-xl text-lg">
        {!loading && (isDark ? profile?.intro_dark : profile?.intro_light)}
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a href="#projects" className="hanakage-btn">
          Lihat Karya
        </a>
        <a href="#contact" className="hanakage-btn">
          Hubungi Saya
        </a>
      </div>
    </section>
  )
}
