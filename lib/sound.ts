"use client"

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      audioCtx = new AudioCtx()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Synthesizes Japanese shrine sounds (chime, hyoshigi wood clapper, water drip, temple bell)
 * using Web Audio API without external audio files.
 */
export function playZenSound(
  type: "chime" | "wood" | "water" | "gong" | "paper" = "chime",
  isDark = false,
) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    if (type === "wood") {
      // Hyōshigi wooden clappers
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(isDark ? 320 : 640, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08)

      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.08)
      return
    }

    if (type === "water") {
      // Chōzubachi water drip / droplet
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(isDark ? 440 : 880, now)
      osc.frequency.exponentialRampToValueAtTime(isDark ? 660 : 1320, now + 0.06)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.25)
      return
    }

    if (type === "paper" || type === "gong") {
      // Deep temple bell gong
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(isDark ? 110 : 220, now) // A2 or A3
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 2.0)
      return
    }

    // Default: Rin bell / wind chime
    const baseFreq = isDark ? 293.66 : 587.33
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.02]

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(f, now)

      const initialVolume = (0.05 / (i + 1)) * (isDark ? 0.8 : 1)
      gain.gain.setValueAtTime(initialVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isDark ? 1.6 : 1.2) + i * 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 2.0)
    })
  } catch {
    // Audio context may be restricted by user agent until interaction
  }
}
