"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    if (!isConfigured) {
      // Offline mock login
      setTimeout(() => {
        router.push("/admin")
      }, 400)
      return
    }

    try {
      const supabase = createClient()
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError

        if (data.session) {
          router.push("/admin")
        } else {
          setSuccessMsg(
            "Akun berhasil dibuat! Silakan cek email untuk verifikasi (atau langsung login jika konfirmasi email dinonaktifkan di Supabase)."
          )
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.push("/admin")
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || "Gagal melakukan autentikasi. Silakan periksa kredensial Anda.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 selection:bg-amber-500/20 selection:text-amber-200">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Subtle accent light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-zinc-100">
              Hanakage Admin
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              {isSignUp ? "Registrasi Pengelola Portofolio" : "Masuk ke Panel Pengelola"}
            </p>
          </div>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200">
            <p className="font-semibold mb-1">Mode Preview / Offline Aktif</p>
            <p className="text-zinc-400">
              Supabase belum dihubungkan ke <code className="text-amber-300">.env.local</code>. Anda tetap dapat masuk langsung dengan mengklik tombol di bawah.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required={isConfigured}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required={isConfigured}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isSignUp ? "Daftar Akun Admin" : "Masuk Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {isConfigured && (
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>{isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccessMsg(null)
              }}
              className="text-amber-400 hover:underline hover:text-amber-300"
            >
              {isSignUp ? "Masuk di sini" : "Buat akun admin"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
