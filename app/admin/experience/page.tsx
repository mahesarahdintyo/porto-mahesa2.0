"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Experience } from "@/lib/supabase/types"
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  RefreshCw,
  Briefcase,
  Calendar,
  Building2,
  X,
  FileText,
} from "lucide-react"

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  )
  const isConfigured = isSupabaseConfigured()

  // Form State
  const [role, setRole] = useState("")
  const [organization, setOrganization] = useState("")
  const [period, setPeriod] = useState("")
  const [description, setDescription] = useState("")
  const [orderIndex, setOrderIndex] = useState(1)

  const loadExperiences = async () => {
    // Check localStorage cache first
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hanakage_experiences")
        if (cached) setExperiences(JSON.parse(cached))
      } catch (e) {}
    }

    if (!isConfigured) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setExperiences(data as Experience[])
        if (typeof window !== "undefined") {
          localStorage.setItem("hanakage_experiences", JSON.stringify(data))
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      console.warn("Notice: Loading experiences from local storage:", e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExperiences()
  }, [isConfigured])

  const openAddModal = () => {
    setEditingExperience(null)
    setRole("")
    setOrganization("")
    setPeriod("")
    setDescription("")
    setOrderIndex(experiences.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp)
    setRole(exp.role)
    setOrganization(exp.organization)
    setPeriod(exp.period)
    setDescription(exp.description)
    setOrderIndex(exp.order_index)
    setIsModalOpen(true)
  }

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role.trim() || !organization.trim() || !period.trim()) {
      setFeedback({ type: "error", message: "Mohon isi peran, organisasi, dan periode." })
      return
    }

    setSaving(true)
    setFeedback(null)

    const payload = {
      role: role.trim(),
      organization: organization.trim(),
      period: period.trim(),
      description: description.trim(),
      order_index: orderIndex,
    }

    let updatedExperiences: Experience[]
    if (editingExperience) {
      updatedExperiences = experiences.map((item) =>
        item.id === editingExperience.id ? { ...item, ...payload } : item
      )
    } else {
      updatedExperiences = [...experiences, { id: "exp-" + Date.now(), ...payload }]
    }

    // Sort by order_index
    updatedExperiences.sort((a, b) => a.order_index - b.order_index)

    setExperiences(updatedExperiences)
    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_experiences", JSON.stringify(updatedExperiences))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        if (editingExperience) {
          const { error } = await supabase
            .from("experiences")
            .update(payload)
            .eq("id", editingExperience.id)
          if (error) console.warn("Supabase experience update notice:", error.message)
        } else {
          const { error } = await supabase.from("experiences").insert([payload])
          if (error) console.warn("Supabase experience insert notice:", error.message)
        }
      } catch (err) {
        console.warn("Supabase experience sync notice:", err)
      }
    }

    setIsModalOpen(false)
    setFeedback({
      type: "success",
      message: editingExperience
        ? "Pengalaman berhasil diperbarui!"
        : "Pengalaman baru berhasil ditambahkan!",
    })
    setTimeout(() => setFeedback(null), 3500)
    setSaving(false)
  }

  const handleDelete = async (id: string, roleName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengalaman "${roleName}"?`)) return

    const updated = experiences.filter((item) => item.id !== id)
    setExperiences(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_experiences", JSON.stringify(updated))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("experiences").delete().eq("id", id)
        if (error) console.warn("Supabase experience delete notice:", error.message)
      } catch (err) {
        console.warn("Supabase experience delete error:", err)
      }
    }

    setFeedback({ type: "success", message: `Pengalaman "${roleName}" berhasil dihapus.` })
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
              歩
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Kuil Batu Pijakan (Ayumi)
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Pengalaman (Experience)
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola jejak langkah karir, peran profesional, magang, dan riwayat pengalaman Anda.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {/* Notification Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
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

      {/* Content List */}
      {loading ? (
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs py-10">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          <span>Memuat data pengalaman...</span>
        </div>
      ) : experiences.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 space-y-3">
          <Briefcase className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-zinc-300 font-medium">Belum Ada Pengalaman</h3>
          <p className="text-xs text-zinc-500 font-mono max-w-sm mx-auto">
            Klik tombol &quot;Tambah Pengalaman&quot; di atas untuk menambahkan riwayat pekerjaan atau magang pertama Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-500">Urutan #{exp.order_index}</span>
                    <h3 className="font-serif text-xl font-bold text-zinc-100">{exp.role}</h3>
                  </div>
                  <span className="shrink-0 text-xs font-mono px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                    {exp.period}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-3">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{exp.organization}</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line border-t border-zinc-800/80 pt-3">
                  {exp.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(exp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.role)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Pengalaman */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-serif text-lg font-bold text-zinc-100">
                  {editingExperience ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveExperience} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  Peran / Posisi Pekerjaan <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Contoh: Fullstack Developer / UI/UX Designer"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    Organisasi / Perusahaan <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Contoh: Freelance / PT. Studio Seni"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    Periode Waktu <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Contoh: 2023 — Sekarang / Jan - Des 2024"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/60"
                />
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Nomor urut terkecil akan ditampilkan lebih dulu di daftar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  Deskripsi Tanggung Jawab &amp; Pencapaian
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan apa yang Anda kerjakan, teknologi yang dipakai, atau dampak yang dihasilkan..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500/60 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingExperience ? "Simpan Perubahan" : "Tambah Sekarang"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
