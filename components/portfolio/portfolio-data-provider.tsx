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

      if (profileRes.data) setProfile(profileRes.data as Profile)
      if (aboutRes.data) setAbout(aboutRes.data as About)
      if (skillsRes.data) setSkills(skillsRes.data as Skill[])
      if (projectsRes.data) setProjects(projectsRes.data as Project[])
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
