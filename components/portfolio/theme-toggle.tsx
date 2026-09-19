"use client"

import { useHanakageTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useHanakageTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="hanakage-andon fixed top-5 right-5 z-50"
      aria-label={theme === "hanami" ? "Beralih ke Yūrei Mode (gelap)" : "Beralih ke Hanami Mode (terang)"}
      aria-pressed={theme === "yurei"}
    >
      <span className="hanakage-andon-light" />
      <span className="sr-only">{theme === "hanami" ? "Mode saat ini: Hanami" : "Mode saat ini: Yūrei"}</span>
    </button>
  )
}
