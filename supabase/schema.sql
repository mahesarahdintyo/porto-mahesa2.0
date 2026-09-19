-- ==========================================
-- SKEMA DATABASE SUPABASE UNTUK PORTO-MAHESA
-- ==========================================
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.

-- 1. TABEL PROFILE
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT 'Mahesa Rahdintyo',
  title TEXT DEFAULT 'Perancang & Pengembang Antarmuka',
  intro_light TEXT DEFAULT 'Perancang & pengembang antarmuka yang hidup di antara dua musim — satu lembut seperti kelopak yang gugur, satu sunyi seperti bayangan yang berbisik.',
  intro_dark TEXT DEFAULT 'Bergerak dalam kesunyian kode, merajut estetika gelap dengan ketelitian struktural.',
  email TEXT DEFAULT 'mahesa.223040162@mail.unpas.ac.id',
  github_url TEXT DEFAULT 'https://github.com/mahesarahdintyo',
  linkedin_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABEL ABOUT
CREATE TABLE IF NOT EXISTS public.about (
  id TEXT PRIMARY KEY DEFAULT 'main',
  eyebrow TEXT DEFAULT 'Tentang',
  heading TEXT DEFAULT 'Dua Jiwa, Satu Karya',
  paragraph_1 TEXT DEFAULT 'Saya percaya setiap karya punya dua wajah: satu yang tampil tenang di siang hari, penuh harapan seperti bunga sakura yang baru mekar — dan satu yang bersembunyi saat gelap, menyimpan misteri seperti kisah hantu yang diturunkan dari generasi ke generasi.',
  paragraph_2 TEXT DEFAULT 'Dualitas ini bukan gimmick. Ia adalah cara saya bekerja: merancang dengan kelembutan, namun tak pernah takut pada kegelapan dan ketidaksempurnaan. Setiap tekstur robek, setiap noda kertas, setiap bayangan adalah bagian dari cerita — bukan cacat yang harus disembunyikan.',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABEL PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Web',
  link_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABEL MESSAGES (Kotak Masuk Form Kontak)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profile Policies: Publik hanya baca, Admin (Authenticated) bebas edit
CREATE POLICY "Public profiles are viewable by everyone" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admin can update profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- About Policies
CREATE POLICY "Public about is viewable by everyone" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admin can update about" ON public.about FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Skills Policies
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects Policies
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Messages Policies: Publik bisa mengirim pesan (INSERT), Admin bisa melihat & mengelola pesan
CREATE POLICY "Public can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- SEED DATA AWAL (Data Default)
-- ==========================================
INSERT INTO public.profile (id, name, title, intro_light, intro_dark, email, github_url)
VALUES (
  'main',
  'Mahesa Rahdintyo',
  'Perancang & Pengembang Antarmuka',
  'Perancang & pengembang antarmuka yang hidup di antara dua musim — satu lembut seperti kelopak yang gugur, satu sunyi seperti bayangan yang berbisik.',
  'Bergerak dalam kesunyian kode, merajut estetika gelap dengan ketelitian struktural.',
  'mahesa.223040162@mail.unpas.ac.id',
  'https://github.com/mahesarahdintyo'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about (id, eyebrow, heading, paragraph_1, paragraph_2)
VALUES (
  'main',
  'Tentang',
  'Dua Jiwa, Satu Karya',
  'Saya percaya setiap karya punya dua wajah: satu yang tampil tenang di siang hari, penuh harapan seperti bunga sakura yang baru mekar — dan satu yang bersembunyi saat gelap, menyimpan misteri seperti kisah hantu yang diturunkan dari generasi ke generasi.',
  'Dualitas ini bukan gimmick. Ia adalah cara saya bekerja: merancang dengan kelembutan, namun tak pernah takut pada kegelapan dan ketidaksempurnaan. Setiap tekstur robek, setiap noda kertas, setiap bayangan adalah bagian dari cerita — bukan cacat yang harus disembunyikan.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.skills (name, category, order_index)
VALUES 
  ('UI', 'Design', 1),
  ('UX', 'Design', 2),
  ('React', 'Frontend', 3),
  ('Next.js', 'Frontend', 4),
  ('TypeScript', 'Language', 5),
  ('Tailwind CSS', 'Styling', 6),
  ('Motion', 'Animation', 7),
  ('Canvas', 'Graphic', 8),
  ('Supabase', 'Backend', 9),
  ('Figma', 'Design', 10)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (title, description, tag, link_url, github_url, order_index, is_published)
VALUES
  ('Washi & Wire', 'Sistem desain untuk studio kerajinan tradisional dengan sentuhan digital modern.', 'Design System', '#', 'https://github.com/mahesarahdintyo', 1, true),
  ('Kage no Niwa', 'Pengalaman web interaktif yang menggabungkan partikel fisika dengan narasi visual.', 'Interactive', '#', 'https://github.com/mahesarahdintyo', 2, true),
  ('Tsuki Journal', 'Aplikasi jurnal minimalis dengan tema yang berubah sesuai waktu dan suasana.', 'Product', '#', 'https://github.com/mahesarahdintyo', 3, true),
  ('Yoru no Kaze', 'Instalasi audio-visual yang merespons gerakan pengunjung secara real-time.', 'Experiment', '#', 'https://github.com/mahesarahdintyo', 4, true)
ON CONFLICT DO NOTHING;
