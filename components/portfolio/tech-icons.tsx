"use client"

import React from "react"

interface TechIconProps {
  name: string
  className?: string
  size?: number
}

export function TechIcon({ name, className = "w-6 h-6", size = 24 }: TechIconProps) {
  const norm = name.toLowerCase().trim()

  // React
  if (norm.includes("react")) {
    return (
      <svg className={className} width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    )
  }

  // Next.js
  if (norm.includes("next")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="90" fill="currentColor" />
        <path
          d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="url(#next_grad)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#next_grad2)" />
        <defs>
          <linearGradient id="next_grad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="next_grad2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // TypeScript
  if (norm === "ts" || norm.includes("typescript")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path
          d="M74.3 70.9c0-9.8 14.8-10.4 14.8-19.4 0-4.3-3.4-6.8-8.7-6.8-6.1 0-10.4 3.7-11.4 9.4l-9.8-3.9C61.4 39.5 69.4 34 80.4 34c11.9 0 19.4 6.7 19.4 17.5 0 10.9-14.8 11.8-14.8 19.7 0 4.8 4.2 7.1 9.9 7.1 6.5 0 11.5-4.2 12.8-10.7l9.7 3.8C95.1 84 87.8 89 79.9 89c-12.7 0-20.3-6.9-20.3-18.1H74.3zM46.7 44.5h-15V35h41v9.5h-15V88h-11V44.5z"
          fill="#FFF"
        />
      </svg>
    )
  }

  // JavaScript
  if (norm === "js" || norm.includes("javascript")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#F7DF1E" />
        <path
          d="M38.5 91.8c3.9 6.3 9.4 10.8 18.5 10.8 14.7 0 23.4-7.4 23.4-25.9V36.9H66.8v39.8c0 9.8-4.4 13.9-11.7 13.9-5.3 0-9.2-2.8-12-7.5l-4.6 8.7zm57.2-2.1c3.8 6 8.9 9.8 16.5 9.8 7 0 11.6-3.4 11.6-8.2 0-5.8-4.7-7.9-12.7-11.4l-4.4-1.9c-12.4-5.3-20.5-12-20.5-25.8 0-12.9 9.9-22.7 25.3-22.7 11 0 18.9 4.3 24.3 13.7l-10.2 6.5c-2.8-4.8-5.9-6.9-14-6.9-6.1 0-10.1 3.5-10.1 7.8 0 5.4 3.9 7.4 11.8 10.7l4.4 1.9c14.6 6.3 21.6 12.8 21.6 26.8 0 15.3-11.8 23.6-27.4 23.6-15.3 0-24.9-7.4-30-18.1l10.1-6.6z"
          fill="#000"
        />
      </svg>
    )
  }

  // Tailwind CSS
  if (norm.includes("tailwind")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
          fill="#38BDF8"
        />
      </svg>
    )
  }

  // Figma
  if (norm.includes("figma")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
      </svg>
    )
  }

  // Supabase
  if (norm.includes("supabase")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 109 113" fill="none">
        <path
          d="M63.7076 110.284C60.5481 114.343 53.9735 112.527 53.3518 107.382L42.6668 18.917C42.1585 14.7107 46.8523 11.8398 50.4194 14.1951L104.996 50.2299C108.796 52.7389 108.134 58.4907 103.856 60.0829L63.7076 110.284Z"
          fill="#3ECF8E"
        />
        <path
          d="M45.2924 2.71616C48.4519 -1.34293 55.0265 0.473187 55.6482 5.61793L66.3332 94.083C66.8415 98.2893 62.1477 101.16 58.5806 98.8049L4.00445 62.7701C0.203642 60.2611 0.865916 54.5093 5.14371 52.9171L45.2924 2.71616Z"
          fill="#249361"
        />
      </svg>
    )
  }

  // Node.js
  if (norm.includes("node")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 32 32">
        <path
          d="M16 2.6L2.9 10.1v15.1L16 32.7l13.1-7.5V10.1L16 2.6zm9.8 20.9L16 29.1l-9.8-5.6V12l9.8-5.6 9.8 5.6v11.5z"
          fill="#539E43"
        />
      </svg>
    )
  }

  // Python
  if (norm.includes("python")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M11.91 2C6.98 2 7.29 4.14 7.29 4.14L7.3 6.35H12V7.07H4.37S2 6.8 2 11.75C2 16.7 4.1 16.48 4.1 16.48H5.64V14.28S5.56 11.66 8.28 11.66H12.92S15.44 11.66 15.44 9.17V4.54S15.82 2 11.91 2M9.1 3.29A.88.88 0 0 1 10 4.17A.88.88 0 0 1 9.1 5.06A.88.88 0 0 1 8.22 4.17A.88.88 0 0 1 9.1 3.29M12.09 22C17.02 22 16.71 19.86 16.71 19.86L16.7 17.65H12V16.93H19.63S22 17.2 22 12.25C22 7.3 19.9 7.52 19.9 7.52H18.36V9.72S18.44 12.34 15.72 12.34H11.08S8.56 12.34 8.56 14.83V19.46S8.18 22 12.09 22M14.9 20.71A.88.88 0 0 1 14 19.83A.88.88 0 0 1 14.9 18.94A.88.88 0 0 1 15.78 19.83A.88.88 0 0 1 14.9 20.71Z"
          fill="#3776AB"
        />
      </svg>
    )
  }

  // HTML5
  if (norm.includes("html")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 17.56l4.07-1.13.55-6.14H7.38l.22 2.53h6.41l-.23 2.57-1.78.48-1.78-.48-.12-1.32H7.66l.24 2.61L12 17.56M4.19 3l1.45 16.27L12 21.5l6.36-2.23L19.81 3H4.19z" fill="#E34F26" />
      </svg>
    )
  }

  // CSS3
  if (norm.includes("css")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24">
        <path d="M5.64 19.27L4.19 3h15.62l-1.45 16.27L12 21.5l-6.36-2.23zm10.98-9H8.22l.24 2.62h8.04l-.56 6.27-3.94 1.09-3.94-1.09-.26-2.88H5.77l.46 5.16L12 23.14l5.77-1.6 1.15-12.89-.3-1.38z" fill="#1572B6" />
      </svg>
    )
  }

  // Git / GitHub
  if (norm.includes("git")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M2.6 10.59L10.6 2.6a2.44 2.44 0 0 1 3.45 0l7.35 7.35a2.44 2.44 0 0 1 0 3.45l-8 8a2.44 2.44 0 0 1-3.45 0l-7.35-7.35a2.44 2.44 0 0 1 0-3.46zm8.85 2.12v-1.6a1.44 1.44 0 0 0-1.05-1.39V6.9a1.44 1.44 0 1 0-1.44 0v2.82a1.44 1.44 0 0 0 0 2.68v2.4a1.44 1.44 0 1 0 1.44 0v-2.09c.62-.2 1.05-.76 1.05-1.4z"
          fill="#F05032"
        />
      </svg>
    )
  }

  // Docker
  if (norm.includes("docker")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M13.98 11.08h-2.1v2.1h2.1v-2.1zm-2.8 0H9.08v2.1h2.1v-2.1zm-2.8 0H6.28v2.1h2.1v-2.1zm8.4-2.8h-2.1v2.1h2.1v-2.1zm-2.8 0h-2.1v2.1h2.1v-2.1zm-2.8 0H9.08v2.1h2.1v-2.1zm-2.8 0H6.28v2.1h2.1v-2.1zm8.4-2.8h-2.1v2.1h2.1V5.48zm-2.8 0h-2.1v2.1h2.1V5.48zm11.05 6.64c-.38-.28-1.5-.39-2.31-.05-.44-1.2-1.44-1.85-1.44-1.85s-.59 1.48.24 2.76c-.46.26-1.2.32-1.92.17-.67 1.83-2.16 2.37-3.8 2.44H2.4c-.26 1.14-.06 2.76.92 4.14C4.84 21.8 7.9 22 9.4 22c5.96 0 10.36-3.88 10.64-9.3.69-.16 1.76-.73 2.16-1.58-.28.16-.68.22-1-.24z"
          fill="#2496ED"
        />
      </svg>
    )
  }

  // MySQL / Postgres / Database / SQL
  if (norm.includes("mysql") || norm.includes("postgres") || norm.includes("sql") || norm.includes("data")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#00758F" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#00758F" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="#00758F" />
      </svg>
    )
  }

  // PHP
  if (norm.includes("php")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#777BB4" />
        <path d="M5 8h3a3 3 0 0 1 0 6H6v3H5V8zm2 2v2h1a1 1 0 0 0 0-2H7zm4-2h1v9h-1V8zm3 0h3a3 3 0 0 1 0 6h-2v3h-1V8zm2 2v2h1a1 1 0 0 0 0-2h-1z" fill="#FFF" />
      </svg>
    )
  }

  // Android
  if (norm.includes("android")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="#3DDC84">
        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71a.495.495 0 0 0-.7 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15a.495.495 0 0 0-.7 0c-.2.2-.2.51 0 .71l1.31 1.31C6.73 4.16 5.57 5.91 5.5 8h13c-.07-2.09-1.23-3.84-2.97-4.84zM9 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
    )
  }

  // UI / UX / Design
  if (norm.includes("ui") || norm.includes("ux") || norm.includes("design")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" stroke="#E11D48" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#E11D48" />
      </svg>
    )
  }

  // Animation / Motion
  if (norm.includes("motion") || norm.includes("animation")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" fill="#F43F5E" fillOpacity="0.2" />
      </svg>
    )
  }

  // Canvas / Graphic
  if (norm.includes("canvas") || norm.includes("graphic")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )
  }

  // Default / Sacred Seal Stamp Monogram
  const letter = (name.charAt(0) || "印").toUpperCase()
  return (
    <div
      className={`rounded-lg flex items-center justify-center font-bold text-xs select-none shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        background: "rgba(178, 58, 46, 0.12)",
        color: "var(--accent-seal, #b23a2e)",
        border: "1px solid rgba(178, 58, 46, 0.3)",
        fontFamily: "var(--font-heading)",
      }}
    >
      {letter}
    </div>
  )
}
