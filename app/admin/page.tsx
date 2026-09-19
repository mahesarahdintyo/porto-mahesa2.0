"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  FolderGit2,
  Sparkles,
  Inbox,
  UserCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
} from "lucide-react"

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    projectsCount: 4,
    skillsCount: 10,
    messagesCount: 0,
    unreadMessages: 0,
  })
  const [recentMessages, setRecentMessages] = useState<
    Array<{ id: string; name: string; email: string; message: string; created_at: string; is_read: boolean }>
  >([])
  const [loading, setLoading] = useState(true)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    const loadStats = async () => {
      try {
        const supabase = createClient()
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
          supabase.from("projects").select("id", { count: "exact" }),
          supabase.from("skills").select("id", { count: "exact" }),
          supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false }),
        ])

        const messages = messagesRes.data || []
        const unread = messages.filter((m) => !m.is_read).length

        setStats({
          projectsCount: projectsRes.count || 0,
          skillsCount: skillsRes.count || 0,
          messagesCount: messages.length,
          unreadMessages: unread,
        })
        setRecentMessages(messages.slice(0, 3))
      } catch (err) {
        console.error("Failed to load dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isConfigured])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Ikhtisar Portofolio
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola identitas digital dan konten portofolio Anda
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono self-start sm:self-auto bg-zinc-900 border-zinc-800">
          {isConfigured ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300">Supabase Terhubung</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300">Mode Lokal / Fallback</span>
            </>
          )}
        </div>
      </div>

      {/* Supabase Notice if not configured */}
      {!isConfigured && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <span>Koneksi Supabase Belum Diaktifkan</span>
          </div>
          <p className="text-sm">
            Agar perubahan yang Anda simpan di halaman admin tersimpan permanen di cloud PostgreSQL, tambahkan URL dan Anon Key dari Supabase ke file <code className="text-amber-200 bg-amber-500/20 px-1 py-0.5 rounded">.env.local</code>.
          </p>
          <p className="text-xs text-zinc-400 font-mono">
            Skema SQL siap pakai tersedia di folder <code className="text-zinc-200">supabase/schema.sql</code>.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <Link
          href="/admin/profile"
          className="group p-5 bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <UserCircle className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="font-serif text-lg font-bold text-zinc-100">Profil & Hero</div>
          <p className="text-xs text-zinc-400 font-mono mt-1">Ubah nama & headline</p>
        </Link>

        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="group p-5 bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <FolderGit2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{stats.projectsCount}</div>
          <p className="text-xs text-zinc-400 font-mono mt-1">Karya / Proyek Aktif</p>
        </Link>

        {/* Skills Card */}
        <Link
          href="/admin/skills"
          className="group p-5 bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{stats.skillsCount}</div>
          <p className="text-xs text-zinc-400 font-mono mt-1">Keahlian Terdaftar</p>
        </Link>

        {/* Messages Card */}
        <Link
          href="/admin/messages"
          className="group p-5 bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all hover:bg-zinc-900 relative"
        >
          {stats.unreadMessages > 0 && (
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold">
              {stats.unreadMessages} baru
            </span>
          )}
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <Inbox className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            {stats.unreadMessages === 0 && (
              <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{stats.messagesCount}</div>
          <p className="text-xs text-zinc-400 font-mono mt-1">Pesan Form Kontak</p>
        </Link>
      </div>

      {/* Recent Messages Section */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-wide text-zinc-100 font-mono uppercase">
              Pesan Terbaru dari Pengunjung
            </h2>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-mono text-amber-400 hover:underline hover:text-amber-300"
          >
            Lihat Semua Pesan →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 font-mono text-xs">
            Belum ada pesan yang masuk. Kirim pesan percobaan melalui formulir kontak di website utama!
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200 truncate">{msg.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">({msg.email})</span>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">{msg.message}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(msg.created_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
