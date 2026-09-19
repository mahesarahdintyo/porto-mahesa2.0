"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Profile } from "@/lib/supabase/types"
import { Save, Check, AlertCircle, RefreshCw, UserCheck } from "lucide-react"

const EMPTY_PROFILE: Profile = {
  id: "main",
  name: "",
  title: "",
  intro_light: "",
  intro_dark: "",
  email: "",
  github_url: "",
  linkedin_url: "",
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    const loadProfile = async () => {
      if (!isConfigured) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .eq("id", "main")
          .maybeSingle()

        if (error) throw error
        if (data) setProfile(data as Profile)
      } catch (err: unknown) {
        const e = err as { message?: string }
        setErrorMsg(e.message || "Gagal memuat profil dari Supabase.")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
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
      const { error } = await supabase.from("profile").upsert({
        ...profile,
        id: "main",
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrorMsg(e.message || "Gagal menyimpan profil ke Supabase.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs py-10">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
        <span>Memuat data profil...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Profil & Bagian Hero
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Ubah nama utama, jabatan, dan narasi pembuka di bagian paling atas website.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profil berhasil disimpan! Perubahan akan langsung tercermin di halaman depan.</span>
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
            <UserCheck className="w-4 h-4 text-amber-400" />
            Identitas Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Jabatan / Role</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 font-mono uppercase">
            Narasi Hero (Berdasarkan Mode Tema)
          </h2>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              Intro Mode Hanami (Terang / Musim Semi)
            </label>
            <textarea
              rows={3}
              value={profile.intro_light}
              onChange={(e) => setProfile({ ...profile, intro_light: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Intro Mode Yūrei (Gelap / Hantu Bayangan)
            </label>
            <textarea
              rows={3}
              value={profile.intro_dark}
              onChange={(e) => setProfile({ ...profile, intro_dark: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 font-mono uppercase">
            Kontak & Sosial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email Kontak</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">GitHub URL</label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
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
