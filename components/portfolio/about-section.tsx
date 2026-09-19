"use client"

import { useScrollReveal } from "./use-scroll-reveal"
import { ToriiSilhouette, BrushDivider } from "./motifs"

export function AboutSection() {
  const revealRef = useScrollReveal<HTMLDivElement>()

  return (
    <section id="about" className="hanakage-section relative overflow-hidden">
      <ToriiSilhouette className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-72 pointer-events-none" />

      <div ref={revealRef} className="hanakage-reveal relative max-w-2xl">
        <p className="hanakage-eyebrow mb-4">Tentang</p>
        <h2 className="hanakage-heading text-4xl md:text-5xl mb-6">Dua Jiwa, Satu Karya</h2>
        <BrushDivider />
        <p className="hanakage-body-text text-base md:text-lg">
          Saya percaya setiap karya punya dua wajah: satu yang tampil tenang di siang hari, penuh
          harapan seperti bunga sakura yang baru mekar — dan satu yang bersembunyi saat gelap,
          menyimpan misteri seperti kisah hantu yang diturunkan dari generasi ke generasi.
        </p>
        <p className="hanakage-body-text text-base md:text-lg mt-4">
          Dualitas ini bukan gimmick. Ia adalah cara saya bekerja: merancang dengan kelembutan,
          namun tak pernah takut pada kegelapan dan ketidaksempurnaan. Setiap tekstur robek,
          setiap noda kertas, setiap bayangan adalah bagian dari cerita — bukan cacat yang harus
          disembunyikan.
        </p>
      </div>
    </section>
  )
}
