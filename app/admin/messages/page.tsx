"use client"

import React, { useEffect, useState } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Message } from "@/lib/supabase/types"
import {
  Inbox,
  Mail,
  CheckCircle,
  Circle,
  Trash2,
  RefreshCw,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  const loadMessages = async () => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      if (data) {
        setMessages(data as Message[])
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrorMsg(e.message || "Gagal memuat pesan masuk.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [isConfigured])

  const toggleReadStatus = async (msg: Message) => {
    const updatedStatus = !msg.is_read

    if (!isConfigured) {
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: updatedStatus } : m)))
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("messages")
        .update({ is_read: updatedStatus })
        .eq("id", msg.id)

      if (error) throw error
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: updatedStatus } : m)))
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrorMsg(e.message || "Gagal mengubah status pesan.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini secara permanen?")) return

    if (!isConfigured) {
      setMessages(messages.filter((m) => m.id !== id))
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("messages").delete().eq("id", id)
      if (error) throw error
      setMessages(messages.filter((m) => m.id !== id))
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrorMsg(e.message || "Gagal menghapus pesan.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
            Kotak Masuk Pesan
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Pesan dan tanggapan yang dikirimkan oleh pengunjung melalui formulir kontak.
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors self-start sm:self-auto"
          title="Segarkan data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs py-10">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          <span>Memuat kotak masuk...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto text-zinc-500">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-zinc-300">Kotak Masuk Kosong</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Belum ada pesan yang diterima. Begitu ada pengunjung mengirim pesan di bagian &quot;Kontak&quot;, pesan akan otomatis masuk ke sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-all ${
                msg.is_read
                  ? "bg-zinc-950/60 border-zinc-800/60 opacity-80"
                  : "bg-zinc-900/80 border-amber-500/30 shadow-lg shadow-amber-500/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(msg)}
                    className="text-zinc-400 hover:text-amber-400 transition-colors"
                    title={msg.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  >
                    {msg.is_read ? (
                      <CheckCircle className="w-4 h-4 text-zinc-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    )}
                  </button>
                  <span className="font-serif font-bold text-base text-zinc-100">{msg.name}</span>
                  <span className="text-xs font-mono text-zinc-500">({msg.email})</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.created_at).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed pl-6 border-l border-zinc-800 my-4">
                {msg.message}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={`mailto:${msg.email}?subject=Re:%20Pesan%20dari%20Portofolio&body=Halo%20${encodeURIComponent(
                    msg.name
                  )},%0A%0ATerima%20kasih%20telah%20menghubungi%20saya...`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Balas Email</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Hapus pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
