"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Profile, About, Skill, Project } from "@/lib/supabase/types"

interface PortfolioDataState {
  profile: Profile | null
  about: About | null
  skills: Skill[]
  projects: Project[]
  loading: boolean
  isConfigured: boolean
  refreshData: () => Promise<void>
}

const PortfolioDataContext = createContext<PortfolioDataState>({
  profile: null,
  about: null,
  skills: [],
  projects: [],
  loading: true,
  isConfigured: false,
  refreshData: async () => {},
})

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [about, setAbout] = useState<About | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  const fetchData = async () => {
    // Check localStorage for offline/immediate edits
    let localProfile: Profile | null = null
    let localAbout: About | null = null
    let localSkills: Skill[] | null = null
    let localProjects: Project[] | null = null

    if (typeof window !== "undefined") {
      try {
        const p = localStorage.getItem("hanakage_profile")
        if (p) localProfile = JSON.parse(p)
        const a = localStorage.getItem("hanakage_about")
        if (a) localAbout = JSON.parse(a)
        const s = localStorage.getItem("hanakage_skills")
        if (s) localSkills = JSON.parse(s)
        const pr = localStorage.getItem("hanakage_projects")
        if (pr) localProjects = JSON.parse(pr)
      } catch (e) {}
    }

    if (localProfile) setProfile(localProfile)
    if (localAbout) setAbout(localAbout)
    if (localSkills) setSkills(localSkills)
    if (localProjects) setProjects(localProjects)

    if (!configured) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const [profileRes, aboutRes, skillsRes, projectsRes] = await Promise.all([
        supabase.from("profile").select("*").eq("id", "main").maybeSingle(),
        supabase.from("about").select("*").eq("id", "main").maybeSingle(),
        supabase.from("skills").select("*").order("order_index", { ascending: true }),
        supabase
          .from("projects")
          .select("*")
          .eq("is_published", true)
          .order("order_index", { ascending: true }),
      ])

      if (profileRes.data && !localProfile) setProfile(profileRes.data as Profile)
      if (aboutRes.data && !localAbout) setAbout(aboutRes.data as About)
      if (skillsRes.data && skillsRes.data.length > 0 && !localSkills) setSkills(skillsRes.data as Skill[])
      if (projectsRes.data && projectsRes.data.length > 0 && !localProjects) setProjects(projectsRes.data as Project[])
    } catch (err) {
      console.warn("Could not fetch data from Supabase:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <PortfolioDataContext.Provider
      value={{
        profile,
        about,
        skills,
        projects,
        loading,
        isConfigured: configured,
        refreshData: fetchData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext)
}
