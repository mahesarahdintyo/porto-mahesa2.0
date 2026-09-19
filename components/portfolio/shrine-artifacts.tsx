"use client"

import React from "react"
import { useHanakageTheme } from "./theme-provider"

interface ArtifactProps {
  isHovered?: boolean
  className?: string
}

/** 1. Gerbang Torii Suci (Beranda / 序章) */
export function ToriiGateArtifact({ isHovered = false, className = "" }: ArtifactProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className={`relative flex flex-col items-center group cursor-pointer transition-transform duration-500 ${isHovered ? "scale-105" : ""} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-40 sm:w-52 md:w-60 h-auto filter drop-shadow-lg transition-all duration-300"
      >
        <defs>
          <filter id="torii-glow-effect">
            <feGaussianBlur stdDeviation={isDark ? "6" : "3"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="torii-vermilion" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#2a151b" : "#c83a2d"} />
            <stop offset="100%" stopColor={isDark ? "#120a0d" : "#871f16"} />
          </linearGradient>
        </defs>

        {/* Aura behind gate */}
        <ellipse
          cx="100"
          cy="95"
          rx="65"
          ry="55"
          fill={isDark ? "rgba(122, 111, 163, 0.2)" : "rgba(232, 137, 159, 0.25)"}
          className={`transition-opacity duration-500 ${isHovered ? "opacity-100 animate-pulse" : "opacity-40"}`}
        />

        {/* Kasagi (Top curved beam) */}
        <path
          d="M 15 32 Q 100 18 185 32 L 180 44 Q 100 32 20 44 Z"
          fill="url(#torii-vermilion)"
          stroke={isDark ? "#7a6fa3" : "#3a1510"}
          strokeWidth="2"
        />
        {/* Shimaki (Second beam directly below kasagi) */}
        <path
          d="M 28 44 Q 100 36 172 44 L 170 52 Q 100 45 30 52 Z"
          fill={isDark ? "#1a0f12" : "#a82e22"}
        />

        {/* Nuki (Horizontal tie beam) */}
        <rect
          x="35"
          y="68"
          width="130"
          height="11"
          rx="2"
          fill="url(#torii-vermilion)"
          stroke={isDark ? "#7a6fa3" : "#3a1510"}
          strokeWidth="1.5"
        />

        {/* Gakuzuka (Center tablet) */}
        <rect
          x="94"
          y="50"
          width="12"
          height="20"
          fill={isDark ? "#151210" : "#2b2320"}
          stroke={isDark ? "#7a6fa3" : "#e8899f"}
          strokeWidth="1"
        />
        <text
          x="100"
          y="64"
          textAnchor="middle"
          fontSize="9"
          fill={isDark ? "#7a6fa3" : "#e8899f"}
          fontFamily="serif"
        >
          始
        </text>

        {/* Pillars (Hashira) */}
        <path
          d="M 46 44 L 41 168 L 57 168 L 54 44 Z"
          fill="url(#torii-vermilion)"
          stroke={isDark ? "#7a6fa3" : "#3a1510"}
          strokeWidth="1.5"
        />
        <path
          d="M 146 44 L 143 168 L 159 168 L 154 44 Z"
          fill="url(#torii-vermilion)"
          stroke={isDark ? "#7a6fa3" : "#3a1510"}
          strokeWidth="1.5"
        />

        {/* Stone bases (Nemaki) */}
        <rect x="38" y="152" width="22" height="18" rx="2" fill={isDark ? "#2d2a28" : "#4a423d"} />
        <rect x="140" y="152" width="22" height="18" rx="2" fill={isDark ? "#2d2a28" : "#4a423d"} />

        {/* Shimenawa (Sacred twisted rope hanging between pillars) */}
        <path
          d="M 48 76 Q 100 95 152 76"
          stroke={isDark ? "#615951" : "#d4a373"}
          strokeWidth="4"
          fill="none"
          strokeDasharray="4 2"
        />
        {/* Shide (White zigzag paper streamers) */}
        <path d="M 80 87 L 85 96 L 80 105" stroke="#f5efe6" strokeWidth="2.5" fill="none" />
        <path d="M 100 92 L 105 101 L 100 110" stroke="#f5efe6" strokeWidth="2.5" fill="none" />
        <path d="M 120 87 L 125 96 L 120 105" stroke="#f5efe6" strokeWidth="2.5" fill="none" />
      </svg>
    </div>
  )
}

/** 2. Papan Kayu Ema & Ranting Sakura (Karya / 卷) */
export function EmaWallArtifact({ isHovered = false, className = "" }: ArtifactProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className={`relative flex flex-col items-center group cursor-pointer transition-transform duration-500 ${isHovered ? "scale-105" : ""} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-36 sm:w-48 md:w-56 h-auto filter drop-shadow-md"
      >
        <defs>
          <linearGradient id="ema-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#2d251f" : "#d9ab7b"} />
            <stop offset="100%" stopColor={isDark ? "#1a1512" : "#b58352"} />
          </linearGradient>
        </defs>

        {/* Sakura Tree Branch */}
        <path
          d="M 10 30 Q 70 20 130 45 T 195 40"
          stroke={isDark ? "#2b2622" : "#59402f"}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 80 32 Q 100 60 115 70"
          stroke={isDark ? "#2b2622" : "#59402f"}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cherry blossom clusters on branch */}
        <circle cx="50" cy="22" r="5" fill={isDark ? "#6b4a52" : "#ffb7c5"} opacity="0.9" />
        <circle cx="58" cy="18" r="4" fill={isDark ? "#4f3a3f" : "#ffd1dc"} opacity="0.9" />
        <circle cx="140" cy="42" r="6" fill={isDark ? "#6b4a52" : "#ffb7c5"} opacity="0.9" />
        <circle cx="150" cy="38" r="4.5" fill={isDark ? "#4f3a3f" : "#ffd1dc"} opacity="0.9" />

        {/* Ema Plaque 1 (Back, slightly tilted) */}
        <g className="origin-top transition-transform duration-700" style={{ transform: isHovered ? "rotate(4deg)" : "rotate(-3deg)" }}>
          <line x1="130" y1="45" x2="140" y2="78" stroke="#b23a2e" strokeWidth="1.5" />
          <polygon
            points="140,82 120,95 120,135 160,135 160,95"
            fill="url(#ema-wood)"
            stroke={isDark ? "#3f332a" : "#7c5531"}
            strokeWidth="1.5"
            opacity="0.8"
          />
        </g>

        {/* Ema Plaque 2 (Front, hanging prominently, swaying with breeze) */}
        <g
          className="origin-top transition-transform duration-500"
          style={{
            transformOrigin: "75px 28px",
            transform: isHovered ? "rotate(-6deg) scale(1.05)" : "rotate(2deg)",
          }}
        >
          {/* Red hanging cord */}
          <line x1="75" y1="28" x2="80" y2="68" stroke={isDark ? "#7a6fa3" : "#b23a2e"} strokeWidth="2" />
          <circle cx="80" cy="74" r="3" fill="none" stroke={isDark ? "#7a6fa3" : "#b23a2e"} strokeWidth="1.5" />

          {/* Wooden Ema Board (House-shaped 5-sided polygon) */}
          <polygon
            points="80,78 45,98 45,152 115,152 115,98"
            fill="url(#ema-wood)"
            stroke={isDark ? "#7a6fa3" : "#634324"}
            strokeWidth="2"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
          />

          {/* Traditional motif drawn on the wooden board: Kanji "卷" & brush lines */}
          <circle cx="80" cy="115" r="16" fill={isDark ? "rgba(122,111,163,0.15)" : "rgba(178,58,46,0.12)"} />
          <text
            x="80"
            y="122"
            textAnchor="middle"
            fontSize="18"
            fontFamily="serif"
            fontWeight="bold"
            fill={isDark ? "#7a6fa3" : "#b23a2e"}
          >
            卷
          </text>
          <text
            x="80"
            y="142"
            textAnchor="middle"
            fontSize="8"
            letterSpacing="2"
            fill={isDark ? "#9a927f" : "#59402f"}
            fontFamily="serif"
          >
            絵馬・作品
          </text>
        </g>
      </svg>
    </div>
  )
}

/** 3. Bejana Air Batu Chōzubachi & Gayung Bambu (Tentang / 影) */
export function ChozubachiArtifact({ isHovered = false, className = "" }: ArtifactProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className={`relative flex flex-col items-center group cursor-pointer transition-transform duration-500 ${isHovered ? "scale-105" : ""} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-36 sm:w-48 md:w-56 h-auto filter drop-shadow-md"
      >
        <defs>
          <radialGradient id="water-ripple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDark ? "#28343f" : "#bfe3ed"} />
            <stop offset="70%" stopColor={isDark ? "#172029" : "#7aa6b5"} />
            <stop offset="100%" stopColor={isDark ? "#0d1318" : "#507584"} />
          </radialGradient>
          <linearGradient id="stone-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#38332e" : "#8c857b"} />
            <stop offset="60%" stopColor={isDark ? "#211d19" : "#615b53"} />
            <stop offset="100%" stopColor={isDark ? "#12100e" : "#423d37"} />
          </linearGradient>
        </defs>

        {/* Mossy stone base */}
        <ellipse cx="100" cy="155" rx="65" ry="18" fill={isDark ? "#191614" : "#4a443d"} />
        <ellipse cx="100" cy="152" rx="55" ry="14" fill={isDark ? "#24201c" : "#5c554c"} />

        {/* Carved stone basin body */}
        <path
          d="M 45 105 Q 40 142 65 148 Q 100 154 135 148 Q 160 142 155 105 Z"
          fill="url(#stone-gradient)"
          stroke={isDark ? "#4d453e" : "#2f2b27"}
          strokeWidth="2"
        />

        {/* Stone basin top rim */}
        <ellipse
          cx="100"
          cy="104"
          rx="56"
          ry="22"
          fill={isDark ? "#2d2824" : "#787167"}
          stroke={isDark ? "#4d453e" : "#38332e"}
          strokeWidth="2.5"
        />

        {/* Water surface inside basin */}
        <ellipse cx="100" cy="104" rx="46" ry="16" fill="url(#water-ripple)" />

        {/* Water concentric ripples */}
        <ellipse
          cx="96"
          cy="104"
          rx={isHovered ? "32" : "24"}
          ry={isHovered ? "11" : "8"}
          fill="none"
          stroke={isDark ? "#7a6fa3" : "#ffffff"}
          strokeWidth="1.2"
          opacity={isHovered ? "0.8" : "0.4"}
          className="transition-all duration-700"
        />
        <ellipse
          cx="96"
          cy="104"
          rx={isHovered ? "18" : "12"}
          ry={isHovered ? "6" : "4"}
          fill="none"
          stroke={isDark ? "#7a6fa3" : "#ffffff"}
          strokeWidth="1"
          opacity={isHovered ? "0.9" : "0.5"}
          className="transition-all duration-700"
        />

        {/* Floating Sakura Petal in water */}
        <ellipse
          cx="110"
          cy="106"
          rx="5"
          ry="3"
          fill={isDark ? "#7a6fa3" : "#ffb6c6"}
          transform="rotate(25 110 106)"
        />

        {/* Hishaku (Bamboo Ladle resting on stone rim) */}
        <g
          className="transition-transform duration-500 origin-center"
          style={{ transform: isHovered ? "rotate(-4deg) translateY(-2px)" : "rotate(0deg)" }}
        >
          {/* Bamboo handle */}
          <line x1="50" y1="125" x2="148" y2="78" stroke={isDark ? "#473b28" : "#caa058"} strokeWidth="3.5" strokeLinecap="round" />
          {/* Wooden cup */}
          <ellipse cx="146" cy="79" rx="10" ry="8" fill={isDark ? "#382e1e" : "#aa803c"} stroke={isDark ? "#594830" : "#7d5d28"} strokeWidth="1.5" />
          <ellipse cx="146" cy="78" rx="7" ry="5" fill={isDark ? "#221c13" : "#d9b675"} />
        </g>

        {/* Kanji label carved in stone */}
        <text
          x="100"
          y="134"
          textAnchor="middle"
          fontSize="11"
          fill={isDark ? "#7a6fa3" : "#e8e2d8"}
          opacity="0.75"
          fontFamily="serif"
          fontWeight="bold"
        >
          影・物語
        </text>
      </svg>
    </div>
  )
}

/** 4. Kotak Ramalan Omikuji & Segel Talisman (Keahlian / 印) */
export function OmikujiArtifact({ isHovered = false, className = "" }: ArtifactProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className={`relative flex flex-col items-center group cursor-pointer transition-transform duration-500 ${isHovered ? "scale-105" : ""} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-36 sm:w-48 md:w-56 h-auto filter drop-shadow-md"
      >
        <defs>
          <linearGradient id="omikuji-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#3a2d26" : "#c49767"} />
            <stop offset="100%" stopColor={isDark ? "#1d1511" : "#8c6239"} />
          </linearGradient>
        </defs>

        {/* Wooden fortune-drawing cylinder box (Rokkakudō) */}
        <polygon
          points="80,60 120,60 135,75 135,145 120,160 80,160 65,145 65,75"
          fill="url(#omikuji-wood)"
          stroke={isDark ? "#615045" : "#54371d"}
          strokeWidth="2"
        />

        {/* Gold metal bands / hoops */}
        <rect x="65" y="78" width="70" height="5" fill={isDark ? "#7a6fa3" : "#d4af37"} />
        <rect x="65" y="138" width="70" height="5" fill={isDark ? "#7a6fa3" : "#d4af37"} />

        {/* Central emblem / Seal mark */}
        <circle cx="100" cy="110" r="15" fill={isDark ? "#151210" : "#b23a2e"} />
        <text
          x="100"
          y="116"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#fdf6ec"
          fontFamily="serif"
        >
          印
        </text>

        {/* Fortune sticks popping out of the top slot */}
        <g className="transition-transform duration-500" style={{ transform: isHovered ? "translateY(-8px)" : "translateY(0)" }}>
          <rect x="92" y="32" width="4" height="32" fill="#e8cca4" stroke="#6d4c2b" strokeWidth="0.8" rx="1" transform="rotate(-6 94 48)" />
          <rect x="99" y="24" width="4.5" height="40" fill="#f2dcbc" stroke="#6d4c2b" strokeWidth="0.8" rx="1" />
          <rect x="106" y="30" width="4" height="34" fill="#e8cca4" stroke="#6d4c2b" strokeWidth="0.8" rx="1" transform="rotate(8 108 47)" />
          {/* Red tip on the active master stick */}
          <rect x="99" y="24" width="4.5" height="8" fill={isDark ? "#7a6fa3" : "#b23a2e"} rx="1" />
        </g>

        {/* Tied white prayer paper ribbons (Omikuji tied to wire) */}
        <line x1="30" y1="120" x2="65" y2="120" stroke="#776c5f" strokeWidth="1.5" />
        <line x1="135" y1="120" x2="170" y2="120" stroke="#776c5f" strokeWidth="1.5" />

        {/* Folded paper knots */}
        <path d="M 42 110 L 48 120 L 42 135" stroke="#f5efe6" strokeWidth="3" fill="none" />
        <path d="M 52 112 L 56 120 L 50 132" stroke="#f5efe6" strokeWidth="3" fill="none" />
        <path d="M 148 112 L 152 120 L 146 132" stroke="#f5efe6" strokeWidth="3" fill="none" />
        <path d="M 158 110 L 164 120 L 158 135" stroke="#f5efe6" strokeWidth="3" fill="none" />
      </svg>
    </div>
  )
}

/** 5. Lentera Batu Kuno Kasuga Tōrō (Kontak / 結) */
export function ToroLanternArtifact({ isHovered = false, className = "" }: ArtifactProps) {
  const { theme } = useHanakageTheme()
  const isDark = theme === "yurei"

  return (
    <div className={`relative flex flex-col items-center group cursor-pointer transition-transform duration-500 ${isHovered ? "scale-105" : ""} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-36 sm:w-48 md:w-56 h-auto filter drop-shadow-md"
      >
        <defs>
          <filter id="flame-glow">
            <feGaussianBlur stdDeviation={isDark ? "6" : "4"} result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
          <radialGradient id="lantern-light" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDark ? "#b4a7d6" : "#ffe8a3"} />
            <stop offset="60%" stopColor={isDark ? "#7a6fa3" : "#f59e0b"} />
            <stop offset="100%" stopColor={isDark ? "rgba(122,111,163,0)" : "rgba(245,158,11,0)"} />
          </radialGradient>
        </defs>

        {/* Glowing light emission from window */}
        <circle
          cx="100"
          cy="78"
          r={isHovered ? "42" : "32"}
          fill="url(#lantern-light)"
          className="transition-all duration-500"
        />

        {/* Hōju (Jewel / lotus finial at the very top) */}
        <ellipse cx="100" cy="22" rx="6" ry="8" fill={isDark ? "#38332f" : "#69635b"} />
        <ellipse cx="100" cy="28" rx="9" ry="3" fill={isDark ? "#282421" : "#524d46"} />

        {/* Kasa (Umbrella hexagonal roof with upturned corners) */}
        <path
          d="M 50 48 Q 100 32 150 48 L 140 56 Q 100 45 60 56 Z"
          fill={isDark ? "#302b27" : "#615b53"}
          stroke={isDark ? "#47403a" : "#38342e"}
          strokeWidth="1.5"
        />

        {/* Hibukuro (Firebox chamber with carved windows) */}
        <rect
          x="76"
          y="56"
          width="48"
          height="40"
          rx="2"
          fill={isDark ? "#1f1b18" : "#453f38"}
          stroke={isDark ? "#47403a" : "#2d2924"}
          strokeWidth="2"
        />

        {/* Candlelight inside window */}
        <rect
          x="84"
          y="62"
          width="32"
          height="28"
          rx="1"
          fill={isDark ? "#120e17" : "#21160a"}
        />

        {/* Flame flicker */}
        <ellipse
          cx="100"
          cy="76"
          rx={isHovered ? "7" : "5"}
          ry={isHovered ? "11" : "8"}
          fill={isDark ? "#b4a7d6" : "#fbbf24"}
          filter="url(#flame-glow)"
          className="animate-pulse"
        />

        {/* Chūdai (Middle stone platform) */}
        <polygon
          points="68,96 132,96 124,106 76,106"
          fill={isDark ? "#302b27" : "#615b53"}
          stroke={isDark ? "#47403a" : "#38342e"}
          strokeWidth="1.5"
        />

        {/* Sao (Central round stone post / pillar) */}
        <rect
          x="88"
          y="106"
          width="24"
          height="40"
          fill={isDark ? "#28231f" : "#544e47"}
          stroke={isDark ? "#3b342e" : "#302c27"}
          strokeWidth="1.5"
        />

        {/* Kiso (Hexagonal stone base foundation) */}
        <polygon
          points="62,146 138,146 148,162 52,162"
          fill={isDark ? "#211c19" : "#453f38"}
          stroke={isDark ? "#38312a" : "#282521"}
          strokeWidth="1.5"
        />

        {/* Kanji label */}
        <text
          x="100"
          y="157"
          textAnchor="middle"
          fontSize="9"
          fill={isDark ? "#7a6fa3" : "#fef3c7"}
          opacity="0.85"
          fontFamily="serif"
          fontWeight="bold"
        >
          結・便り
        </text>
      </svg>
    </div>
  )
}
