"use client"

import { useEffect, useRef } from "react"
import { useHanakageTheme } from "./theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  swayOffset: number
  swaySpeed: number
  layer: 0 | 1 | 2
  hue: string
  wilted: boolean
  ember: boolean
}

const SAKURA_COLORS = ["#FFD9E3", "#FFC2D1", "#FBB6C6", "#FFF5F7"]
const WILTED_COLORS = ["#6b4a52", "#4f3a3f", "#7a5a5f"]

function drawPetal(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.9, -size * 0.6, size * 0.9, size * 0.4, 0, size)
  ctx.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.9, -size * 0.6, 0, -size)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useHanakageTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lowPower = (navigator.hardwareConcurrency ?? 4) <= 4 || window.innerWidth < 640

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const count = reducedMotion ? 0 : lowPower ? 40 : 80
    let particles: Particle[] = []

    function spawn(): Particle {
      const layer = (Math.floor(Math.random() * 3) as 0 | 1 | 2)
      const isDark = themeRef.current === "yurei"
      const ember = isDark && Math.random() < 0.22
      const wilted = isDark && !ember && Math.random() < 0.5
      const baseSize = layer === 0 ? 4 + Math.random() * 3 : layer === 1 ? 6 + Math.random() * 4 : 9 + Math.random() * 5
      return {
        x: Math.random() * width,
        y: Math.random() * height - height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (0.25 + Math.random() * 0.4) * (layer + 1) * 0.6 * (ember ? -0.6 : 1),
        size: baseSize,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.4 + Math.random() * 0.5,
        layer,
        hue: ember
          ? "#D9772E"
          : wilted
            ? WILTED_COLORS[Math.floor(Math.random() * WILTED_COLORS.length)]
            : SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
        wilted,
        ember,
      }
    }

    particles = Array.from({ length: count }, spawn)

    const mouse = { x: -9999, y: -9999, active: false }

    function handlePointerMove(e: PointerEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    function handlePointerLeave() {
      mouse.active = false
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })

    let windGust = 0
    let windTimer = 0
    let nextGustAt = 8000 + Math.random() * 7000
    let last = performance.now()
    let rafId = 0

    function frame(now: number) {
      const dt = Math.min(now - last, 48)
      last = now
      windTimer += dt
      if (windTimer > nextGustAt) {
        windGust = (Math.random() - 0.5) * 1.4
        windTimer = 0
        nextGustAt = 8000 + Math.random() * 7000
        setTimeout(() => {
          windGust = 0
        }, 1200)
      }

      ctx.clearRect(0, 0, width, height)

      const isDark = themeRef.current === "yurei"
      const repulseRadius = isDark ? 130 : 145

      for (const p of particles) {
        const t = now / 1000

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repulseRadius && dist > 0.01) {
            const force = (1 - dist / repulseRadius) * (isDark ? 0.9 : 0.55)
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.vx *= 0.94
        p.vy = p.vy * 0.985 + (p.ember ? -0.002 : 0.0025) * (p.layer + 1)

        const sway = Math.sin(t * p.swaySpeed + p.swayOffset) * (isDark ? 0.25 : 0.55)
        p.x += p.vx + sway + windGust
        p.y += p.vy
        p.rotation += p.rotationSpeed + (isDark ? 0 : 0)

        if (p.y > height + 40) {
          p.y = -40
          p.x = Math.random() * width
        }
        if (p.y < -60) {
          p.y = height + 40
        }
        if (p.x > width + 40) p.x = -40
        if (p.x < -40) p.x = width + 40

        const depthAlpha = p.layer === 0 ? 0.55 : p.layer === 1 ? 0.8 : 1
        ctx.save()
        ctx.globalAlpha = depthAlpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        if (p.layer === 0 && !p.ember) {
          ctx.filter = "blur(1px)"
        }

        if (p.ember) {
          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.8)
          glow.addColorStop(0, "rgba(217, 119, 46, 0.9)")
          glow.addColorStop(1, "rgba(217, 119, 46, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawPetal(ctx, p.size, p.hue)
        }
        ctx.restore()
      }

      rafId = requestAnimationFrame(frame)
    }

    if (count > 0) {
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  )
}
