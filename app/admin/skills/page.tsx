"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Skill } from "@/lib/supabase/types"
import { Plus, X, Sparkles, RefreshCw, Check, AlertCircle, Edit2, Save } from "lucide-react"

const CATEGORIES = ["General", "Programming", "Frontend", "Backend", "Tools", "Design"]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("General")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState("General")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const isConfigured = isSupabaseConfigured()

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadSkills = async () => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hanakage_skills")
        if (cached) setSkills(JSON.parse(cached))
      } catch (e) {}
    }

    if (!isConfigured) { setLoading(false); return }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("skills").select("*").order("order_index", { ascending: true })
      if (error) throw error
      if (data && data.length > 0) {
        setSkills(data as Skill[])
        if (typeof window !== "undefined") localStorage.setItem("hanakage_skills", JSON.stringify(data))
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      console.warn("Notice: Loading skills from local storage:", e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { loadSkills() }, [isConfigured])

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newSkillName.trim()
    if (!trimmed) return
    setSaving(true)

    const newSkill: Skill = {
      id: "skill-" + Date.now(),
      name: trimmed,
      category: newSkillCategory,
      order_index: skills.length + 1,
    }

    const updated = [...skills, newSkill]
    setSkills(updated)
    setNewSkillName("")
    if (typeof window !== "undefined") localStorage.setItem("hanakage_skills", JSON.stringify(updated))

    if (isConfigured) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("skills").insert([{ name: trimmed, category: newSkillCategory, order_index: skills.length + 1 }])
        if (error) console.warn("Supabase skills insert notice:", error.message)
      } catch (err) { console.warn("Supabase skills sync error:", err) }
    }

    showFeedback("success", `Keahlian "${trimmed}" (${newSkillCategory}) berhasil ditambahkan!`)
    setSaving(false)
  }

  const handleUpdateCategory = async (id: string, newCategory: string, name: string) => {
    const updated = skills.map((s) => s.id === id ? { ...s, category: newCategory } : s)
    setSkills(updated)
    setEditingId(null)
    if (typeof window !== "undefined") localStorage.setItem("hanakage_skills", JSON.stringify(updated))

    if (isConfigured) {
      try {
        const supabase = createClient()
        await supabase.from("skills").update({ category: newCategory }).eq("id", id)
      } catch (err) { console.warn("Supabase skills update error:", err) }
    }
    showFeedback("success", `Kategori "${name}" diperbarui ke ${newCategory}.`)
  }

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Hapus keahlian "${name}"?`)) return
    const updated = skills.filter((s) => s.id !== id)
    setSkills(updated)
    if (typeof window !== "undefined") localStorage.setItem("hanakage_skills", JSON.stringify(updated))

    if (isConfigured) {
      try {
        const supabase = createClient()
        await supabase.from("skills").delete().eq("id", id)
      } catch (err) { console.warn("Supabase skills delete error:", err) }
    }
    showFeedback("success", `Keahlian "${name}" telah dihapus.`)
  }

  // Group skills by category for display
  const grouped = CATEGORIES.reduce<Record<string, Skill[]>>((acc, cat) => {
    const inCat = skills.filter((s) => s.category === cat)
    if (inCat.length > 0) acc[cat] = inCat
    return acc
  }, {})
  const uncategorized = skills.filter((s) => !CATEGORIES.includes(s.category))
  if (uncategorized.length > 0) grouped["Lainnya"] = uncategorized

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">Keahlian (Skills)</h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola keahlian dengan kategori — ditampilkan dengan filter tab di halaman utama.
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
          {feedback.type === "success" ? <Check className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Nama keahlian baru (misal: Docker, GraphQL, Figma)..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
        />
        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 min-w-[140px]"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="submit"
          disabled={saving || !newSkillName.trim()}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Tambah</span>
        </button>
      </form>

      {/* Skills grouped by category */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-6">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Memuat data...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-8 text-center text-sm text-zinc-500 font-mono">
          Belum ada keahlian. Tambahkan menggunakan form di atas.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {cat}
                <span className="text-zinc-600">({catSkills.length})</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-sm text-zinc-200 transition-all">
                    <span className="font-mono text-xs font-medium">{skill.name}</span>
                    {/* Edit category inline */}
                    {editingId === skill.id ? (
                      <>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="bg-zinc-800 text-zinc-200 text-xs rounded px-1 py-0.5 border border-zinc-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleUpdateCategory(skill.id, editCategory, skill.name)}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                          title="Simpan"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-zinc-600 hover:text-zinc-400 transition-colors"
                          title="Batal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setEditingId(skill.id); setEditCategory(skill.category) }}
                        className="text-zinc-600 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Ubah kategori"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
