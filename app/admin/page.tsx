"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  FolderGit2,
  Sparkles,
  Inbox,
  UserCircle,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  Database,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
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
  const [showSqlGuide, setShowSqlGuide] = useState(false)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    // Read local cache count if available
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem("hanakage_skills")
        const pr = localStorage.getItem("hanakage_projects")
        if (s) setStats((prev) => ({ ...prev, skillsCount: JSON.parse(s).length }))
        if (pr) setStats((prev) => ({ ...prev, projectsCount: JSON.parse(pr).length }))
      } catch (e) {}
    }

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
          projectsCount: projectsRes.count !== null ? projectsRes.count : stats.projectsCount,
          skillsCount: skillsRes.count !== null ? skillsRes.count : stats.skillsCount,
          messagesCount: messages.length,
          unreadMessages: unread,
        })
        setRecentMessages(messages.slice(0, 4))
      } catch (err) {
        console.error("Failed to load dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isConfigured])

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Panel Pengelola Portofolio
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Pusat Kendali Hanakage
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Kelola dan perbarui seluruh konten dari 5 kuil sakral portofolio Anda
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-mono self-start sm:self-auto bg-zinc-900 border-zinc-800 shadow-sm">
          {isConfigured ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">Supabase Terhubung</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300">Mode Lokal / Fallback</span>
            </>
          )}
        </div>
      </div>

      {/* Grid Menu: 5 Sacred Shrines of the Portfolio */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wider text-zinc-400 font-mono uppercase">
            Pilih Bagian yang Ingin Diedit
          </h2>
          <span className="text-xs text-zinc-500 font-mono">5 Kuil / Bagian</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Profile & Hero */}
          <Link
            href="/admin/profile"
            className="group p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
                    始
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Gerbang Torii</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Profil & Hero
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Ubah nama, gelar, deskripsi musim terang (Hanami) & gelap (Yūrei), serta link sosial media.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-xs font-mono text-amber-400/80 group-hover:text-amber-300">
              <span>Buka Editor Profil →</span>
            </div>
          </Link>

          {/* 2. About */}
          <Link
            href="/admin/about"
            className="group p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
                    影
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Bejana Chōzubachi</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Tentang Saya
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Kelola narasi filosofi, heading utama, dan dua paragraf cerita tentang latar belakang Anda.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-xs font-mono text-amber-400/80 group-hover:text-amber-300">
              <span>Buka Editor Tentang →</span>
            </div>
          </Link>

          {/* 3. Projects */}
          <Link
            href="/admin/projects"
            className="group p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
                    卷
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Papan Ema</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {stats.projectsCount} Karya
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
              <div className="font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Karya & Proyek
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Tambah proyek baru, ubah deskripsi, tautan demo langsung, repositori GitHub, serta visibilitas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-xs font-mono text-amber-400/80 group-hover:text-amber-300">
              <span>Kelola Daftar Proyek →</span>
            </div>
          </Link>

          {/* 4. Skills */}
          <Link
            href="/admin/skills"
            className="group p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
                    印
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Kotak Omikuji</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {stats.skillsCount} Segel
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
              <div className="font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Keahlian (Skills)
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Tambah atau hapus lencana segel keahlian (React, Next.js, TypeScript, Tailwind, UI/UX, dsb).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-xs font-mono text-amber-400/80 group-hover:text-amber-300">
              <span>Kelola Daftar Keahlian →</span>
            </div>
          </Link>

          {/* 5. Contact Messages */}
          <Link
            href="/admin/messages"
            className="group p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400 font-serif">
                    結
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Lentera Tōrō</span>
                </div>
                <div className="flex items-center gap-2">
                  {stats.unreadMessages > 0 ? (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 animate-pulse">
                      {stats.unreadMessages} Baru
                    </span>
                  ) : (
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {stats.messagesCount} Pesan
                    </span>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
              <div className="font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Kotak Masuk Pesan
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Lihat surat dan pesan yang dikirimkan oleh pengunjung melalui formulir kontak kuil.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-xs font-mono text-amber-400/80 group-hover:text-amber-300">
              <span>Buka Kotak Masuk →</span>
            </div>
          </Link>

          {/* Quick Preview Card */}
          <Link
            href="/"
            target="_blank"
            className="group p-5 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-amber-400 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Live Portfolio
                </span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="font-serif text-lg font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                Lihat Website Kuil
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1.5 leading-relaxed">
                Pratinjau tampilan website portofolio utama Anda dengan animasi 5 kuil, Shoji, dan tata surya bintang.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center text-xs font-mono text-amber-300 group-hover:text-amber-200">
              <span>Buka Tab Baru ↗</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Supabase Integration & Setup Guide (Collapsible) */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSqlGuide(!showSqlGuide)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                Panduan Integrasi Database Supabase
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {isConfigured
                  ? "Database Supabase terdeteksi di .env.local — Klik untuk melihat skrip tabel & instruksi sinkronisasi."
                  : "Klik untuk melihat petunjuk menghubungkan Supabase ke portofolio Anda."}
              </p>
            </div>
          </div>
          <div className="text-zinc-400 p-1">
            {showSqlGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showSqlGuide && (
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4 text-xs font-mono text-zinc-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="text-amber-400 font-bold">1. Variabel Lingkungan (.env.local)</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Konfigurasi URL dan Anon Key sudah siap di file <code className="text-zinc-200">.env.local</code> proyek Anda.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="text-amber-400 font-bold">2. Eksekusi Skrip SQL</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Buka SQL Editor di Dashboard Supabase Anda, lalu salin dan jalankan skrip dari <code className="text-zinc-200">supabase/schema.sql</code>.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="text-amber-400 font-bold">3. Penyimpanan Instan</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Setiap kali Anda menekan Simpan di dashboard, perubahan disimpan langsung ke browser & disinkronkan ke Supabase.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Messages Section */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-wide text-zinc-100 font-mono uppercase">
              Pesan Terbaru dari Pengunjung Kuil
            </h2>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-mono text-amber-400 hover:underline hover:text-amber-300"
          >
            Buka Kotak Masuk Lengkap →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 font-mono text-xs">
            Belum ada pesan yang masuk. Pengunjung dapat mengirimkan pesan melalui formulir kontak di kuil &quot;Lentera Kasuga&quot;!
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
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Pesan Baru" />
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
