"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

export type HanakageTheme = "hanami" | "yurei"

interface ThemeContextValue {
  theme: HanakageTheme
  toggling: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "hanakage-theme"

export function useHanakageTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useHanakageTheme must be used within HanakageThemeProvider")
  return ctx
}

export function HanakageThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<HanakageTheme>("hanami")
  const [toggling, setToggling] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as HanakageTheme | null
    if (stored === "hanami" || stored === "yurei") {
      setTheme(stored)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "yurei" : "hanami")
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute("data-hanakage-theme", theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setTheme((prev) => (prev === "hanami" ? "yurei" : "hanami"))
      return
    }

    setToggling(true)
    document.documentElement.classList.add("hanakage-flicker")

    const t1 = setTimeout(() => {
      setTheme((prev) => (prev === "hanami" ? "yurei" : "hanami"))
    }, 220)

    const t2 = setTimeout(() => {
      document.documentElement.classList.remove("hanakage-flicker")
      setToggling(false)
    }, 700)

    timeoutsRef.current.push(t1, t2)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggling, toggleTheme }}>
      <div data-hanakage-theme={mounted ? theme : "hanami"} className="hanakage-root">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
