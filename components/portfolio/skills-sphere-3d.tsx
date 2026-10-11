"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { TechIcon } from "./tech-icons"
import { RotateCcw, Play, Pause, Sparkles, Orbit } from "lucide-react"

interface SkillItem {
  id: string
  name: string
  category: string
}

interface SkillsSphere3DProps {
  skills: SkillItem[]
  isDark: boolean
}

interface SpherePoint {
  skill: SkillItem
  x: number
  y: number
  z: number
}

export function SkillsSphere3D({ skills, isDark }: SkillsSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [radius, setRadius] = useState(175)
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  // Rotation angles (radians)
  const rotRef = useRef({ x: 0.15, y: 0.3 })
  const velRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)
  const isHoveringCardRef = useRef(false)

  // Force re-render on animation frames
  const [, setTick] = useState(0)

  // Adjust radius based on container size
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== "undefined") {
        const w = window.innerWidth
        if (w < 480) setRadius(120)
        else if (w < 768) setRadius(145)
        else setRadius(175)
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Calculate Fibonacci sphere distribution
  const points = useMemo<SpherePoint[]>(() => {
    const n = skills.length
    if (n === 0) return []

    if (n === 1) {
      return [{ skill: skills[0], x: 0, y: 0, z: radius }]
    }

    // Single horizontal ring if very few items
    if (n <= 4) {
      return skills.map((skill, i) => {
        const angle = (i / n) * Math.PI * 2
        return {
          skill,
          x: radius * Math.cos(angle),
          y: (i % 2 === 0 ? 1 : -1) * 20,
          z: radius * Math.sin(angle),
        }
      })
    }

    // Golden ratio spherical distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    return skills.map((skill, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = (2 * Math.PI * i) / goldenRatio
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      return { skill, x, y, z }
    })
  }, [skills, radius])

  // Animation loop with requestAnimationFrame
  useEffect(() => {
    let animId: number
    let lastTimestamp = performance.now()

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1)
      lastTimestamp = timestamp

      if (!isDraggingRef.current) {
        // Inertia decay
        velRef.current.x *= 0.92
        velRef.current.y *= 0.92

        // Apply velocity
        rotRef.current.y += velRef.current.x
        rotRef.current.x += velRef.current.y

        // Idle auto-rotation when no user interaction & not hovering
        if (
          isAutoRotating &&
          !isHoveringCardRef.current &&
          Math.abs(velRef.current.x) < 0.001 &&
          Math.abs(velRef.current.y) < 0.001
        ) {
          rotRef.current.y += 0.28 * dt
        }
      }

      setTick((t) => (t + 1) % 100000)
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [isAutoRotating])

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    lastTimeRef.current = performance.now()
    velRef.current = { x: 0, y: 0 }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    const now = performance.now()
    const dt = Math.max((now - lastTimeRef.current) / 1000, 0.016)
    lastTimeRef.current = now

    const dx = e.clientX - lastPointerRef.current.x
    const dy = e.clientY - lastPointerRef.current.y

    lastPointerRef.current = { x: e.clientX, y: e.clientY }

    const sensitivity = 0.006
    rotRef.current.y += dx * sensitivity
    rotRef.current.x -= dy * sensitivity

    // Track velocity for inertia
    velRef.current.x = (dx * sensitivity * 0.016) / dt
    velRef.current.y = (-dy * sensitivity * 0.016) / dt
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {}
  }

  const resetRotation = useCallback(() => {
    rotRef.current = { x: 0.15, y: 0.3 }
    velRef.current = { x: 0, y: 0 }
  }, [])

  // Projected 3D items calculation
  const projectedItems = useMemo(() => {
    const { x: rotX, y: rotY } = rotRef.current
    const cosY = Math.cos(rotY)
    const sinY = Math.sin(rotY)
    const cosX = Math.cos(rotX)
    const sinX = Math.sin(rotX)

    const fov = 420

    return points.map((p) => {
      // Rotate around Y axis
      const x1 = p.x * cosY + p.z * sinY
      const z1 = -p.x * sinY + p.z * cosY
      const y1 = p.y

      // Rotate around X axis
      const y2 = y1 * cosX - z1 * sinX
      const z2 = y1 * sinX + z1 * cosX
      const x2 = x1

      // Perspective projection
      const scale = fov / (fov - z2)
      const screenX = x2 * scale
      const screenY = y2 * scale

      // Normalized depth [0 = back, 1 = front]
      const depth = (z2 + radius) / (2 * radius)
      const opacity = Math.max(0.25, Math.min(1, 0.35 + 0.65 * depth))
      const zIndex = Math.round(depth * 1000)

      return {
        skill: p.skill,
        screenX,
        screenY,
        scale,
        depth,
        opacity,
        zIndex,
      }
    })
  }, [points, radius, rotRef.current.x, rotRef.current.y])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[480px] rounded-2xl border overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing transition-colors duration-300 flex items-center justify-center"
      style={{
        borderColor: isDark ? "rgba(122, 111, 163, 0.2)" : "rgba(178, 58, 46, 0.18)",
        background: isDark
          ? "radial-gradient(circle at center, rgba(122,111,163,0.08) 0%, rgba(10,10,12,0.4) 70%)"
          : "radial-gradient(circle at center, rgba(178,58,46,0.06) 0%, rgba(255,255,255,0.7) 70%)",
        backdropFilter: "blur(12px)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Ambient Celestial Glow behind the Sphere */}
      <div
        className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full pointer-events-none blur-3xl opacity-40 transition-colors"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(122,111,163,0.35) 0%, rgba(45,35,70,0.1) 70%, transparent 100%)"
            : "radial-gradient(circle, rgba(178,58,46,0.25) 0%, rgba(240,160,140,0.1) 70%, transparent 100%)",
        }}
      />

      {/* Orbit Rings (Ethereal 3D celestial rings) */}
      <div
        className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed pointer-events-none opacity-20"
        style={{
          borderColor: isDark ? "var(--accent-ghost, #7a6fa3)" : "var(--accent-seal)",
          transform: "rotateX(72deg) rotateZ(25deg)",
        }}
      />

      {/* 3D Floating Skill Badges */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {projectedItems.map((item) => {
          const isHovered = hoveredSkill?.id === item.skill.id
          const isFront = item.depth > 0.55

          return (
            <div
              key={item.skill.id}
              className="absolute pointer-events-auto transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${item.screenX}px, ${item.screenY}px, 0) scale(${
                  isHovered ? item.scale * 1.35 : item.scale
                })`,
                zIndex: isHovered ? 2000 : item.zIndex,
                opacity: isHovered ? 1 : item.opacity,
                cursor: isFront ? "pointer" : "grab",
              }}
              onMouseEnter={() => {
                isHoveringCardRef.current = true
                setHoveredSkill(item.skill)
              }}
              onMouseLeave={() => {
                isHoveringCardRef.current = false
                setHoveredSkill(null)
              }}
              title={`${item.skill.name} (${item.skill.category})`}
            >
              <div
                className="relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border shadow-lg transition-all duration-200"
                style={{
                  borderColor: isHovered
                    ? isDark
                      ? "var(--accent-ghost, #7a6fa3)"
                      : "var(--accent-seal)"
                    : isDark
                    ? "rgba(122, 111, 163, 0.28)"
                    : "rgba(178, 58, 46, 0.22)",
                  background: isDark
                    ? isHovered
                      ? "rgba(30, 24, 46, 0.95)"
                      : "rgba(18, 16, 24, 0.85)"
                    : isHovered
                    ? "rgba(255, 255, 255, 0.98)"
                    : "rgba(255, 255, 255, 0.88)",
                  boxShadow: isHovered
                    ? isDark
                      ? "0 10px 25px -5px rgba(122, 111, 163, 0.5), 0 0 15px rgba(122, 111, 163, 0.3)"
                      : "0 10px 25px -5px rgba(178, 58, 46, 0.4), 0 0 15px rgba(178, 58, 46, 0.2)"
                    : isDark
                    ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                    : "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                {/* Tech Icon */}
                <div className="w-8 h-8 flex items-center justify-center transition-transform duration-200">
                  <TechIcon name={item.skill.name} size={28} className="w-7 h-7" />
                </div>

                {/* Subtle Name Label under Icon for front/hovered items */}
                {(isHovered || isFront) && (
                  <span
                    className="text-[9px] font-mono font-medium truncate max-w-[50px] leading-none mt-0.5"
                    style={{
                      color: isHovered
                        ? isDark
                          ? "var(--accent-ghost, #7a6fa3)"
                          : "var(--accent-seal)"
                        : "var(--text-primary)",
                    }}
                  >
                    {item.skill.name}
                  </span>
                )}
              </div>

              {/* Tooltip on Hover */}
              {isHovered && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap border shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    background: isDark ? "rgba(10, 10, 14, 0.95)" : "rgba(255, 255, 255, 0.98)",
                    borderColor: isDark ? "rgba(122, 111, 163, 0.4)" : "rgba(178, 58, 46, 0.3)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="font-semibold">{item.skill.name}</span>
                  <span
                    className="ml-1.5 opacity-60 text-[9px] uppercase tracking-wider"
                    style={{ color: isDark ? "var(--accent-ghost)" : "var(--accent-seal)" }}
                  >
                    • {item.skill.category}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Control Buttons (Top-Right of 3D Canvas) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer backdrop-blur-md"
          style={{
            borderColor: isDark ? "rgba(122,111,163,0.25)" : "rgba(178,58,46,0.2)",
            background: isDark ? "rgba(20,18,28,0.7)" : "rgba(255,255,255,0.7)",
            color: isAutoRotating
              ? isDark
                ? "var(--accent-ghost, #7a6fa3)"
                : "var(--accent-seal)"
              : "var(--text-muted)",
          }}
          title={isAutoRotating ? "Jeda putaran otomatis" : "Lanjutkan putaran"}
        >
          {isAutoRotating ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          type="button"
          onClick={resetRotation}
          className="p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer backdrop-blur-md"
          style={{
            borderColor: isDark ? "rgba(122,111,163,0.25)" : "rgba(178,58,46,0.2)",
            background: isDark ? "rgba(20,18,28,0.7)" : "rgba(255,255,255,0.7)",
            color: "var(--text-muted)",
          }}
          title="Reset sudut rotasi"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Interaction Hint Badge (Bottom-Center) */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono pointer-events-none backdrop-blur-md opacity-80"
        style={{
          borderColor: isDark ? "rgba(122,111,163,0.2)" : "rgba(178,58,46,0.18)",
          background: isDark ? "rgba(15,14,20,0.7)" : "rgba(255,255,255,0.7)",
          color: "var(--text-muted)",
        }}
      >
        <Orbit size={12} className={isAutoRotating ? "animate-spin" : ""} style={{ animationDuration: "8s" }} />
        <span>Tarik untuk memutar • Arahkan untuk detail</span>
      </div>
    </div>
  )
}
