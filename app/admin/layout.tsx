"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  FolderGit2,
  Sparkles,
  Inbox,
  LogOut,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil & Hero", icon: UserCircle },
  { href: "/admin/about", label: "Tentang", icon: FileText },
  { href: "/admin/projects", label: "Karya / Proyek", icon: FolderGit2 },
  { href: "/admin/skills", label: "Keahlian", icon: Sparkles },
  { href: "/admin/messages", label: "Kotak Masuk", icon: Inbox },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    // If on login page, skip protection
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    if (!isConfigured) {
      // Supabase env not set yet; allow offline preview
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/admin/login")
        } else {
          setUserEmail(user.email || null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, isConfigured, router])

  const handleLogout = async () => {
    if (isConfigured) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/admin/login")
  }

  // Login page has its own layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-amber-500/80 border-t-transparent animate-spin" />
          <span>Memuat Admin Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="mb-8">
            <Link href="/admin" className="flex items-center gap-2 group">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
              <span className="font-serif font-bold text-lg tracking-wider text-zinc-100">
                HANAKAGE
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded ml-1">
                Admin
              </span>
            </Link>
            <p className="text-xs text-zinc-500 mt-1 font-mono">Panel Manajemen Konten</p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <p className="font-semibold">Supabase Belum Aktif</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Isi <code className="text-amber-200">.env.local</code> untuk menyinkronkan data langsung ke database.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 font-medium border border-amber-500/30"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-zinc-400"}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-amber-300 transition-colors p-2 rounded hover:bg-zinc-800/40"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Website Publik
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Buka ↗</span>
          </Link>

          {userEmail && (
            <div className="px-2 text-[11px] font-mono text-zinc-400 truncate">
              {userEmail}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
