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
  type: "chime" | "wood" | "water" | "gong" | "paper" | "slash" | "shoji" | "bamboo" | "flame" = "chime",
  isDark = false,
) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    if (type === "slash") {
      // Katana swift blade slash + air swoosh
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(isDark ? 1600 : 2400, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

      // Add high metallic sheen
      const metalOsc = ctx.createOscillator()
      const metalGain = ctx.createGain()
      metalOsc.type = "triangle"
      metalOsc.frequency.setValueAtTime(isDark ? 3200 : 4800, now)
      metalOsc.frequency.exponentialRampToValueAtTime(400, now + 0.1)

      metalGain.gain.setValueAtTime(0.1, now)
      metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

      metalOsc.connect(metalGain)
      metalGain.connect(ctx.destination)
      metalOsc.start(now)
      metalOsc.stop(now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.18)
      return
    }

    if (type === "shoji") {
      // Wooden sliding door sliding friction
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(isDark ? 90 : 120, now)
      osc.frequency.linearRampToValueAtTime(isDark ? 70 : 95, now + 0.4)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.4)
      return
    }

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

    if (type === "bamboo") {
      // Omikuji canister bamboo sticks shaking / hollow wood clack
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(isDark ? 520 : 780, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09)

      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)
      return
    }

    if (type === "flame") {
      // Toro stone lantern warm ember resonance & soft sacred hum
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(isDark ? 164.81 : 220, now) // E3 or A3
      osc.frequency.linearRampToValueAtTime(isDark ? 160 : 216, now + 0.5)

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.5)
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
