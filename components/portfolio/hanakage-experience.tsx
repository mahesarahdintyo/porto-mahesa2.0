"use client"

import { PortfolioDataProvider } from "./portfolio-data-provider"
import { HanakageThemeProvider } from "./theme-provider"
import { ParticleCanvas } from "./particle-canvas"
import { Atmosphere } from "./atmosphere"
import { ThemeToggle } from "./theme-toggle"
import { SiteNav } from "./site-nav"
import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { SkillsSection } from "./skills-section"
import { ProjectsSection } from "./projects-section"
import { ContactSection } from "./contact-section"

export function HanakageExperience() {
  return (
    <PortfolioDataProvider>
      <HanakageThemeProvider>
        <Atmosphere />
        <ParticleCanvas />
        <SiteNav />
        <ThemeToggle />
        <main className="relative">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </HanakageThemeProvider>
    </PortfolioDataProvider>
  )
}

