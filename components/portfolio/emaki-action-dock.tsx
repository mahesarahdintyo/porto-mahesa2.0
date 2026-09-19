"use client"

import React from "react"
import Link from "next/link"
import { useEmaki } from "./emaki-context"
import { useHanakageTheme } from "./theme-provider"
import { Volume2, VolumeX, Shield, Mail } from "lucide-react"

export function EmakiActionDock() {
  const { soundEnabled, toggleSound, goToSection } = useEmaki()
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <aside
      aria-label="Tautan & Pengaturan"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 select-none"
    >
      {/* Decorative vertical thread */}
      <div
        className="w-[1.5px] h-8 sm:h-12 opacity-30 transition-colors"
        style={{ background: isDark ? "var(--accent-ink)" : "var(--accent-seal)" }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-2.5 p-1.5 rounded-2xl backdrop-blur-md bg-black/5 dark:bg-white/5 border border-current/10 shadow-lg">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-300 hover:scale-110 opacity-75 hover:opacity-100"
          style={{
            border: "1px solid var(--border-color)",
            background: soundEnabled
              ? isDark
                ? "rgba(122, 111, 163, 0.15)"
                : "rgba(178, 58, 46, 0.08)"
              : "transparent",
            color: "var(--text-primary)",
          }}
          aria-label={soundEnabled ? "Nonaktifkan Suara Zen" : "Aktifkan Suara Zen"}
          title={soundEnabled ? "Suara Zen: Aktif" : "Suara Zen: Hening"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 opacity-50" />
          )}

          {/* Tooltip to the left */}
          <div
            className="pointer-events-none absolute right-full mr-3 px-3 py-1 rounded-md whitespace-nowrap text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-md backdrop-blur-md"
            style={{
              background: isDark ? "rgba(21, 18, 16, 0.95)" : "rgba(251, 245, 234, 0.95)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {soundEnabled ? "Suara Zen Aktif 🔔" : "Suara Hening 🔕"}
          </div>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-300 hover:scale-110 opacity-75 hover:opacity-100"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          aria-label="Kunjungi GitHub"
        >
          <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <div
            className="pointer-events-none absolute right-full mr-3 px-3 py-1 rounded-md whitespace-nowrap text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-md backdrop-blur-md"
            style={{
              background: isDark ? "rgba(21, 18, 16, 0.95)" : "rgba(251, 245, 234, 0.95)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            GitHub Profil ↗
          </div>
        </a>

        {/* Quick Contact Button */}
        <button
          onClick={() => goToSection(4)}
          className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-300 hover:scale-110 opacity-75 hover:opacity-100"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          aria-label="Langsung ke Form Kontak"
        >
          <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <div
            className="pointer-events-none absolute right-full mr-3 px-3 py-1 rounded-md whitespace-nowrap text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-md backdrop-blur-md"
            style={{
              background: isDark ? "rgba(21, 18, 16, 0.95)" : "rgba(251, 245, 234, 0.95)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Tulis Pesan (Kontak)
          </div>
        </button>

        {/* Admin Dashboard Quick Link */}
        <Link
          href="/admin"
          className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-300 hover:scale-110 opacity-75 hover:opacity-100"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          aria-label="Buka Panel Admin CMS"
        >
          <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <div
            className="pointer-events-none absolute right-full mr-3 px-3 py-1 rounded-md whitespace-nowrap text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-md backdrop-blur-md"
            style={{
              background: isDark ? "rgba(21, 18, 16, 0.95)" : "rgba(251, 245, 234, 0.95)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Panel Admin CMS ⚙️
          </div>
        </Link>
      </div>

      {/* Decorative vertical thread */}
      <div
        className="w-[1.5px] h-8 sm:h-12 opacity-30 transition-colors"
        style={{ background: isDark ? "var(--accent-ink)" : "var(--accent-seal)" }}
        aria-hidden="true"
      />
    </aside>
  )
}
