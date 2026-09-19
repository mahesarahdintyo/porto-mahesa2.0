"use client"

const LINKS = [
  { href: "#about", label: "Tentang" },
  { href: "#skills", label: "Keahlian" },
  { href: "#projects", label: "Karya" },
  { href: "#contact", label: "Kontak" },
]

export function SiteNav() {
  return (
    <nav
      aria-label="Navigasi utama"
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
