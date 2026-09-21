"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Skill } from "@/lib/supabase/types"
import { Plus, X, Sparkles, RefreshCw, Check, AlertCircle } from "lucide-react"

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])

  const [loading, setLoading] = useState(true)
  const [newSkillName, setNewSkillName] = useState("")
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  )
  const isConfigured = isSupabaseConfigured()

  const loadSkills = async () => {
    // Check localStorage cache first
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hanakage_skills")
        if (cached) setSkills(JSON.parse(cached))
      } catch (e) {}
    }

    if (!isConfigured) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setSkills(data as Skill[])
        if (typeof window !== "undefined") {
          localStorage.setItem("hanakage_skills", JSON.stringify(data))
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      console.warn("Notice: Loading skills from local storage:", e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [isConfigured])

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newSkillName.trim()
    if (!trimmed) return

    setSaving(true)
    setFeedback(null)

    const newSkill: Skill = {
      id: "skill-" + Date.now(),
      name: trimmed,
      category: "General",
      order_index: skills.length + 1,
    }

    const updated = [...skills, newSkill]
    setSkills(updated)
    setNewSkillName("")

    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_skills", JSON.stringify(updated))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("skills").insert([
          { name: trimmed, category: "General", order_index: skills.length + 1 }
        ])
        if (error) console.warn("Supabase skills insert notice:", error.message)
      } catch (err) {
        console.warn("Supabase skills sync error:", err)
      }
    }

    setFeedback({ type: "success", message: `Keahlian "${trimmed}" berhasil ditambahkan!` })
    setTimeout(() => setFeedback(null), 3000)
    setSaving(false)
  }

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Hapus keahlian "${name}"?`)) return

    const updated = skills.filter((s) => s.id !== id)
    setSkills(updated)

    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_skills", JSON.stringify(updated))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        await supabase.from("skills").delete().eq("id", id)
      } catch (err) {
        console.warn("Supabase skills delete error:", err)
      }
    }

    setFeedback({ type: "success", message: `Keahlian "${name}" telah dihapus.` })
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Keahlian (Skills)
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola segel / lencana keahlian yang ditampilkan di bagian &quot;Segel yang Saya Bawa&quot;.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Ketik keahlian baru (misal: Docker, GraphQL, PostgreSQL)..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
        />
        <button
          type="submit"
          disabled={saving || !newSkillName.trim()}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Tambah</span>
        </button>
      </form>

      {/* Skills Badges Container */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Daftar Keahlian Aktif ({skills.length})
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-6">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Memuat data...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-sm text-zinc-200 transition-all"
              >
                <span className="font-mono text-xs font-medium">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id, skill.name)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                  title="Hapus"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
