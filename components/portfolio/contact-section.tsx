"use client"

import { useState } from "react"
import { useHanakageTheme } from "./theme-provider"
import { useScrollReveal } from "./use-scroll-reveal"
import { BrushDivider } from "./motifs"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export function ContactSection() {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"
  const revealRef = useScrollReveal<HTMLDivElement>()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg("")

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const message = String(formData.get("message") || "").trim()

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("messages").insert([
          { name, email, message },
        ])
        if (error) throw error
        setSubmitted(true)
      } catch (err: unknown) {
        console.error("Failed to send message to Supabase:", err)
        setErrorMsg("Failed to send message. Please try again shortly.")
      } finally {
        setSubmitting(false)
      }
    } else {
      // Fallback offline mode
      setTimeout(() => {
        setSubmitting(false)
        setSubmitted(true)
      }, 500)
    }
  }

  return (
    <section id="contact" className="hanakage-section pb-32">
      <div ref={revealRef} className="hanakage-reveal max-w-xl">
        <p className="hanakage-eyebrow mb-4">Contact</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">
          {isDark ? "Call from the Shadows" : "Send a Message"}
        </h2>
        <BrushDivider />
        <p className="hanakage-body-text mb-8">
          {isDark
            ? "If there is something you wish to whisper into the dark, leave a message — I will listen."
            : "Have an idea, project, or simply want to connect? Send a message, and I'll reply as swiftly as falling petals."}
        </p>

        {submitted ? (
          <div className="p-4 border border-current/20 hanakage-torn">
            <p className="hanakage-body-text font-medium" role="status">
              {isDark ? "Your whisper has been received in the dark." : "Your message has been sent. Thank you!"}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs underline opacity-70 hover:opacity-100"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <p className="text-sm text-red-500 bg-red-500/10 p-2 border border-red-500/20">
                {errorMsg}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm hanakage-body-text">
                Name
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
                Message
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
            <button
              type="submit"
              disabled={submitting}
              className="hanakage-btn self-start mt-2 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

