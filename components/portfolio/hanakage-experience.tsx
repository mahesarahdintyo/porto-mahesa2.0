"use client"

import { PortfolioDataProvider } from "./portfolio-data-provider"
import { HanakageThemeProvider } from "./theme-provider"
import { ParticleCanvas } from "./particle-canvas"
import { Atmosphere } from "./atmosphere"
import { ShrineCourtyard } from "./shrine-courtyard"

export function HanakageExperience() {
  return (
    <PortfolioDataProvider>
      <HanakageThemeProvider>
        {/* Fixed background layers: atmosphere gradients + falling petals/embers */}
        <Atmosphere />
        <ParticleCanvas />
        {/* Main interactive shrine courtyard navigation */}
        <ShrineCourtyard />
      </HanakageThemeProvider>
    </PortfolioDataProvider>
  )
}
