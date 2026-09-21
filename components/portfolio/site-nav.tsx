"use client"

const LINKS = [
  { href: "#about", label: "About Me" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
]

export function SiteNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-5 left-5 z-50 flex items-center gap-5 text-sm"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="hanakage-body-text hidden sm:inline hover:opacity-100 opacity-80 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
