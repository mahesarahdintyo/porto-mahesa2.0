"use client"

import { useEffect, useRef, useState } from "react"
import { useScrollReveal } from "./use-scroll-reveal"
import { usePortfolioData } from "./portfolio-data-provider"
import { ToriiSilhouette, BrushDivider } from "./motifs"
import { useHanakageTheme } from "./theme-provider"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface GitHubData {
  total: { lastYear: number }
  contributions: Contribution[]
}

// ─────────────────────────────────────────────
// Animated Counter Hook
// ─────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start || target === 0) return
    let raf: number
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return value
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
interface StatCardProps {
  icon: string
  label: string
  value: number
  suffix?: string
  color: string
  started: boolean
}

function StatCard({ icon, label, value, suffix = "", color, started }: StatCardProps) {
  const count = useCountUp(value, 1600, started)
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-5 text-center overflow-hidden group transition-transform duration-200 hover:-translate-y-1"
      style={{
        borderColor: "var(--border-color)",
        background: "var(--bg-card, rgba(255,255,255,0.04))",
      }}
    >
      {/* Glow blob */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}22 0%, transparent 70%)` }}
      />
      <span className="text-2xl select-none">{icon}</span>
      <span className="text-3xl font-black font-mono tabular-nums leading-none" style={{ color }}>
        {count}
        {suffix}
      </span>
      <span className="text-[11px] font-mono uppercase tracking-widest opacity-60" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// GitHub Heatmap
// ─────────────────────────────────────────────
function GitHubHeatmap({ contributions, isDark }: { contributions: Contribution[]; isDark: boolean }) {
  // Level → color (Hanami warm / Yūrei cool)
  const levelColors = isDark
    ? ["rgba(122,111,163,0.10)", "rgba(180,160,255,0.35)", "rgba(180,160,255,0.55)", "rgba(180,160,255,0.78)", "#c8b8ff"]
    : ["rgba(142,43,32,0.08)", "rgba(198,80,60,0.30)", "rgba(198,80,60,0.55)", "rgba(178,58,46,0.80)", "#8e2b20"]

  // Organise into columns (weeks) × 7 rows (days)
  const weeks: (Contribution | null)[][] = []
  if (contributions.length) {
    // Pad start so first day falls on correct weekday column
    const firstDow = new Date(contributions[0].date).getDay()
    let week: (Contribution | null)[] = Array(firstDow).fill(null)
    contributions.forEach((c) => {
      week.push(c)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    })
    if (week.length) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-1 min-w-max">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[3px] pt-5 mr-1">
          {dayLabels.map((d, i) => (
            <span
              key={i}
              className="text-[9px] font-mono w-[11px] leading-[11px] text-center"
              style={{ color: "var(--text-muted)", opacity: i % 2 === 0 ? 0.5 : 0.25 }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Columns of weeks */}
        {weeks.map((week, wi) => {
          // Determine if we should show a month label
          const firstReal = week.find((d) => d !== null)
          const showMonthLabel =
            firstReal &&
            (wi === 0 ||
              new Date(firstReal.date).getMonth() !==
                new Date(weeks[wi - 1].find((d) => d !== null)?.date ?? firstReal.date).getMonth())

          const monthLabel = firstReal
            ? new Date(firstReal.date).toLocaleString("en", { month: "short" })
            : ""

          return (
            <div key={wi} className="flex flex-col gap-[3px]">
              {/* Month label row */}
              <span
                className="text-[9px] font-mono h-[11px] leading-[11px] text-center"
                style={{ color: "var(--text-muted)", opacity: showMonthLabel ? 0.6 : 0 }}
              >
                {monthLabel}
              </span>
              {/* Day cells */}
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day ? `${day.date}: ${day.count} contributions` : ""}
                  className="w-[11px] h-[11px] rounded-[2px] transition-transform duration-150 hover:scale-125"
                  style={{
                    background: day ? levelColors[day.level] : "transparent",
                    cursor: day && day.count > 0 ? "pointer" : "default",
                  }}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main AboutSection
// ─────────────────────────────────────────────
export function AboutSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const { about, loading, skills, projects } = usePortfolioData()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  // Stats visibility trigger (IntersectionObserver on the stats row)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // GitHub contributions
  const [ghData, setGhData] = useState<GitHubData | null>(null)
  const [ghLoading, setGhLoading] = useState(true)
  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/mahesarahdintyo?y=last")
      .then((r) => r.json())
      .then((d) => { setGhData(d); setGhLoading(false) })
      .catch(() => setGhLoading(false))
  }, [])

  // Derived stats
  const totalContributions = ghData?.total?.lastYear ?? 0
  // Estimate hours: roughly 1.5h per contribution on average
  const hoursEstimate = Math.round(totalContributions * 1.5)
  const projectCount = projects.length || 5
  const toolsCount = skills.length || 12

  const accentColor = isDark ? "#c8b8ff" : "#8e2b20"
  const accentSoft = isDark ? "#9d8fcc" : "#b23a2e"

  return (
    <section id="about" className="hanakage-section relative overflow-visible">
      <ToriiSilhouette className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-72 pointer-events-none" />

      {/* ── Bio text ── */}
      <div ref={revealRef} className="hanakage-reveal relative max-w-2xl">
        <p className="hanakage-eyebrow mb-4">{about?.eyebrow ?? "About Me"}</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">{about?.heading ?? ""}</h2>
        <BrushDivider />
        {!loading && (
          <>
            <p className="hanakage-body-text text-base md:text-lg">{about?.paragraph_1}</p>
            <p className="hanakage-body-text text-base md:text-lg mt-4">{about?.paragraph_2}</p>
          </>
        )}
      </div>

      {/* ── Education Card ── */}
      <div className="mt-10 max-w-2xl">
        <p
          className="text-[11px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <span className="font-serif text-base">学</span> Education
        </p>
        <div
          className="relative rounded-2xl border overflow-hidden group"
          style={{ borderColor: "var(--border-color)" }}
        >
          {/* Side accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentSoft}88)` }}
          />
          <div className="flex items-start gap-4 px-6 py-5 pl-7">
            <div
              className="w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center font-serif text-xl font-bold"
              style={{ borderColor: "var(--border-color)", color: accentColor }}
            >
              大
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                    Universitas Pasundan
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                    Informatic Engineering
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 mt-0.5"
                  style={{
                    borderColor: isDark ? "rgba(122,111,163,0.4)" : "rgba(142,43,32,0.3)",
                    color: accentColor,
                    background: isDark ? "rgba(122,111,163,0.1)" : "rgba(142,43,32,0.06)",
                  }}
                >
                  2022 – Present
                </span>
              </div>
              <p className="text-xs mt-2 opacity-60 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Currently pursuing my degree — turning theoretical foundations into production-grade software,
                one commit at a time. The degree is in progress; the momentum is not.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div ref={statsRef} className="mt-10 max-w-2xl">
        <p
          className="text-[11px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <span className="font-serif text-base">数</span> By the Numbers
        </p>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon="⏱️"
            label="Hours Coded"
            value={hoursEstimate}
            suffix="+"
            color={isDark ? "#c8b8ff" : "#8e2b20"}
            started={statsVisible}
          />
          <StatCard
            icon="🗂️"
            label="Projects"
            value={projectCount}
            suffix="+"
            color={isDark ? "#a78bfa" : "#b23a2e"}
            started={statsVisible}
          />
          <StatCard
            icon="🛠️"
            label="Tools"
            value={toolsCount}
            suffix="+"
            color={isDark ? "#818cf8" : "#c0472e"}
            started={statsVisible}
          />
        </div>
      </div>

      {/* ── GitHub Activity Heatmap ── */}
      <div className="mt-10 max-w-2xl">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p
            className="text-[11px] font-mono uppercase tracking-widest flex items-center gap-2"
            style={{ color: accentColor }}
          >
            <span className="font-serif text-base">印</span> GitHub Activity
          </p>
          {ghData && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                borderColor: isDark ? "rgba(122,111,163,0.4)" : "rgba(142,43,32,0.3)",
                color: accentColor,
                background: isDark ? "rgba(122,111,163,0.1)" : "rgba(142,43,32,0.06)",
              }}
            >
              {totalContributions} contributions · last 12 months
            </span>
          )}
        </div>

        <div
          className="rounded-2xl border p-4 overflow-hidden"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-card, rgba(255,255,255,0.03))" }}
        >
          {ghLoading ? (
            <div className="flex items-center justify-center h-20 opacity-40">
              <span className="text-xs font-mono animate-pulse">Loading activity...</span>
            </div>
          ) : ghData ? (
            <>
              <GitHubHeatmap contributions={ghData.contributions} isDark={isDark} />
              {/* Legend */}
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[9px] font-mono opacity-40" style={{ color: "var(--text-muted)" }}>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => {
                  const colors = isDark
                    ? ["rgba(122,111,163,0.10)", "rgba(180,160,255,0.35)", "rgba(180,160,255,0.55)", "rgba(180,160,255,0.78)", "#c8b8ff"]
                    : ["rgba(142,43,32,0.08)", "rgba(198,80,60,0.30)", "rgba(198,80,60,0.55)", "rgba(178,58,46,0.80)", "#8e2b20"]
                  return (
                    <div
                      key={lvl}
                      className="w-[11px] h-[11px] rounded-[2px]"
                      style={{ background: colors[lvl] }}
                    />
                  )
                })}
                <span className="text-[9px] font-mono opacity-40" style={{ color: "var(--text-muted)" }}>More</span>
              </div>

              {/* GitHub handle link */}
              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
                <span className="text-[10px] font-mono opacity-50">@mahesarahdintyo</span>
                <a
                  href="https://github.com/mahesarahdintyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono flex items-center gap-1 hover:underline transition-opacity opacity-60 hover:opacity-100"
                  style={{ color: accentColor }}
                >
                  View on GitHub →
                </a>
              </div>
            </>
          ) : (
            <p className="text-xs opacity-40 text-center py-4 font-mono">Could not load activity data.</p>
          )}
        </div>
      </div>
    </section>
  )
}
