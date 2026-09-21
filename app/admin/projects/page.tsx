"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Project } from "@/lib/supabase/types"
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  RefreshCw,
  FolderGit2,
  Eye,
  EyeOff,
  X,
} from "lucide-react"

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  )
  const isConfigured = isSupabaseConfigured()

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("Web")
  const [linkUrl, setLinkUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [orderIndex, setOrderIndex] = useState(1)

  const loadProjects = async () => {
    // Check localStorage cache first
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hanakage_projects")
        if (cached) setProjects(JSON.parse(cached))
      } catch (e) {}
    }

    if (!isConfigured) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setProjects(data as Project[])
        if (typeof window !== "undefined") {
          localStorage.setItem("hanakage_projects", JSON.stringify(data))
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      console.warn("Notice: Loading projects from local storage:", e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [isConfigured])

  const openAddModal = () => {
    setEditingProject(null)
    setTitle("")
    setDescription("")
    setTag("Web App")
    setLinkUrl("")
    setGithubUrl("")
    setIsPublished(true)
    setOrderIndex(projects.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (proj: Project) => {
    setEditingProject(proj)
    setTitle(proj.title)
    setDescription(proj.description)
    setTag(proj.tag)
    setLinkUrl(proj.link_url || "")
    setGithubUrl(proj.github_url || "")
    setIsPublished(proj.is_published)
    setOrderIndex(proj.order_index)
    setIsModalOpen(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    const payload = {
      title,
      description,
      tag,
      link_url: linkUrl,
      github_url: githubUrl,
      is_published: isPublished,
      order_index: orderIndex,
    }

    let updatedProjects: Project[]
    if (editingProject) {
      updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...p, ...payload } : p
      )
    } else {
      updatedProjects = [...projects, { id: "proj-" + Date.now(), ...payload }]
    }

    setProjects(updatedProjects)
    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_projects", JSON.stringify(updatedProjects))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        if (editingProject) {
          await supabase.from("projects").update(payload).eq("id", editingProject.id)
        } else {
          await supabase.from("projects").insert([payload])
        }
      } catch (err) {
        console.warn("Supabase project sync notice:", err)
      }
    }

    setIsModalOpen(false)
    setFeedback({
      type: "success",
      message: editingProject ? "Proyek berhasil diperbarui!" : "Proyek baru berhasil ditambahkan!",
    })
    setTimeout(() => setFeedback(null), 3000)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return

    const updated = projects.filter((p) => p.id !== id)
    setProjects(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("hanakage_projects", JSON.stringify(updated))
    }

    if (isConfigured) {
      try {
        const supabase = createClient()
        await supabase.from("projects").delete().eq("id", id)
      } catch (err) {
        console.warn("Supabase project delete notice:", err)
      }
    }

    setFeedback({ type: "success", message: "Proyek berhasil dihapus." })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleTogglePublish = async (proj: Project) => {
    const updatedStatus = !proj.is_published

    if (!isConfigured) {
      setProjects(projects.map((p) => (p.id === proj.id ? { ...p, is_published: updatedStatus } : p)))
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("projects")
        .update({ is_published: updatedStatus })
        .eq("id", proj.id)
      if (error) throw error
      await loadProjects()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setFeedback({ type: "error", message: e.message || "Gagal mengubah status publish." })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Karya / Proyek
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola daftar portofolio karya yang ditampilkan di bagian &quot;Kertas yang Ditempel&quot;.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
        </button>
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

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs py-10">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          <span>Memuat data proyek...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                proj.is_published
                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  : "bg-zinc-950/40 border-zinc-800/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                    {proj.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Urutan #{proj.order_index}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-zinc-100 mb-1">{proj.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{proj.description}</p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.link_url && proj.link_url !== "#" && (
                    <a
                      href={proj.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Lihat Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Lihat GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                    title={proj.is_published ? "Sembunyikan dari web" : "Tampilkan di web"}
                  >
                    {proj.is_published ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 rounded transition-colors"
                    title="Edit Proyek"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-xl font-bold text-zinc-100 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-400" />
                <span>{editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Judul Proyek</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tsuki Journal"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Kategori / Tag</label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Design System / Interactive"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Nomor Urut</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat mengenai ide dan teknologi proyek..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Demo URL (Opsional)</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub URL (Opsional)</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishCheckbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="publishCheckbox" className="text-xs font-mono text-zinc-300">
                  Publikasikan langsung ke halaman website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2 text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Proyek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
