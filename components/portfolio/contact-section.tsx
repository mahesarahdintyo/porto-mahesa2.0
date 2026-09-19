"use client"

import { useState } from "react"
import { useHanakageTheme } from "./theme-provider"
import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider } from "./motifs"

export function ContactSection() {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const revealRef = useScrollReveal<HTMLDivElement>()
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="hanakage-section pb-32">
      <div ref={revealRef} className="hanakage-reveal max-w-xl">
        <p className="hanakage-eyebrow mb-4">Kontak</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">
          {isDark ? "Panggil dari Kegelapan" : "Tulis Sepucuk Surat"}
        </h2>
        <BrushDivider />
        <p className="hanakage-body-text mb-8">
          {isDark
            ? "Jika ada sesuatu yang ingin Anda bisikkan, kirimkan pesan — saya akan mendengarnya."
            : "Punya proyek atau sekadar ingin menyapa? Kirimkan pesan, saya akan membalas secepat kelopak jatuh."}
        </p>

        {submitted ? (
          <p className="hanakage-body-text" role="status">
            {isDark ? "Bisikan Anda telah diterima." : "Suratmu telah terkirim. Terima kasih."}
          </p>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm hanakage-body-text">
                Nama
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="bg-transparent border px-3 py-2 outline-none"
                style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm hanakage-body-text">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border px-3 py-2 outline-none"
                style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm hanakage-body-text">
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="bg-transparent border px-3 py-2 outline-none resize-none"
                style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>
            <button type="submit" className="hanakage-btn self-start mt-2">
              Kirim
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
