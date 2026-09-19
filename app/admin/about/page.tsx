"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { About } from "@/lib/supabase/types"
import { Save, Check, AlertCircle, RefreshCw, FileText } from "lucide-react"

const EMPTY_ABOUT: About = {
  id: "main",
  eyebrow: "",
  heading: "",
  paragraph_1: "",
  paragraph_2: "",
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<About>(EMPTY_ABOUT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    const loadAbout = async () => {
      if (!isConfigured) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("about")
          .select("*")
          .eq("id", "main")
          .maybeSingle()

        if (error) throw error
        if (data) setAbout(data as About)
      } catch (err: unknown) {
        const e = err as { message?: string }
        setErrorMsg(e.message || "Gagal memuat konten tentang dari Supabase.")
      } finally {
        setLoading(false)
      }
    }

    loadAbout()
  }, [isConfigured])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)
    setSavedSuccess(false)

    if (!isConfigured) {
      setTimeout(() => { setSaving(false); setSavedSuccess(true) }, 400)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("about").upsert({
        ...about,
        id: "main",
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrorMsg(e.message || "Gagal menyimpan konten ke Supabase.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs py-10">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
        <span>Memuat data tentang...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Bagian Tentang (About)
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola judul dan narasi filosofi di bagian &quot;Tentang&quot;.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Konten Tentang berhasil disimpan!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 font-mono uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Judul & Header
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Sub-judul / Eyebrow</label>
              <input
                type="text"
                required
                value={about.eyebrow}
                onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Judul Utama</label>
              <input
                type="text"
                required
                value={about.heading}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 font-mono uppercase">
            Paragraf Filosofi & Narasi
          </h2>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">Paragraf Pertama</label>
            <textarea
              rows={4}
              required
              value={about.paragraph_1}
              onChange={(e) => setAbout({ ...about, paragraph_1: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">Paragraf Kedua</label>
            <textarea
              rows={4}
              required
              value={about.paragraph_2}
              onChange={(e) => setAbout({ ...about, paragraph_2: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
