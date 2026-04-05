-- ═══════════════════════════════════════════════════════════════════════════
-- LOVELO DESIGN STUDIO — Schema do Banco de Dados (Supabase / PostgreSQL)
-- ═══════════════════════════════════════════════════════════════════════════
-- Execute este script no SQL Editor do seu projeto Supabase.
-- Menu: Database → SQL Editor → New Query → cole e execute.
-- ═══════════════════════════════════════════════════════════════════════════

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM: Tipos de peça ──────────────────────────────────────────────────────
CREATE TYPE garment_type AS ENUM ('jersey_short', 'jersey_long', 'bib_shorts');

-- ─── TABELA: users ────────────────────────────────────────────────────────────
-- Extensão do auth.users do Supabase com dados do perfil.
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Perfis de usuário — extensão de auth.users';

-- Trigger: cria perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── TABELA: garment_templates ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.garment_templates (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  type             garment_type NOT NULL,
  svg_template_url TEXT NOT NULL DEFAULT '',   -- URL do SVG no Supabase Storage
  model_3d_url     TEXT NOT NULL DEFAULT '',   -- URL do modelo .glb no Supabase Storage
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.garment_templates IS 'Templates base das peças de ciclismo';

-- ─── TABELA: garment_zones ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.garment_zones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES public.garment_templates(id) ON DELETE CASCADE,
  zone_name   TEXT NOT NULL,           -- ID técnico: 'corpo_frontal', 'manga_esquerda', etc.
  label       TEXT NOT NULL,           -- Label em português para UI
  metadata    JSONB NOT NULL DEFAULT '{}',  -- uvRegion, svgPathId, etc.
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(template_id, zone_name)
);

COMMENT ON TABLE public.garment_zones IS 'Zonas editáveis de cada template de peça';

-- ─── TABELA: designs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.designs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.garment_templates(id),
  name        TEXT NOT NULL DEFAULT 'Novo Design',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.designs IS 'Designs criados pelos usuários';

CREATE INDEX IF NOT EXISTS idx_designs_user_id ON public.designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_updated_at ON public.designs(updated_at DESC);

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_designs_updated_at ON public.designs;
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── TABELA: design_versions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.design_versions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id         UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  version_number    INTEGER NOT NULL DEFAULT 1,
  config_json       JSONB NOT NULL DEFAULT '{"baseColors":{},"elements":[],"logos":[],"texts":[]}',
  preview_image_url TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(design_id, version_number)
);

COMMENT ON TABLE public.design_versions IS 'Histórico de versões de cada design';
COMMENT ON COLUMN public.design_versions.config_json IS 'JSON completo do estado do design: cores, elementos, logos, textos';

CREATE INDEX IF NOT EXISTS idx_design_versions_design_id ON public.design_versions(design_id);
CREATE INDEX IF NOT EXISTS idx_design_versions_created_at ON public.design_versions(created_at DESC);

-- ─── TABELA: brand_assets ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.brand_assets (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name  TEXT NOT NULL,
  file_type  TEXT NOT NULL,   -- 'image/svg+xml' | 'image/png'
  file_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.brand_assets IS 'Logos e assets de marca enviados pelos usuários';

CREATE INDEX IF NOT EXISTS idx_brand_assets_user_id ON public.brand_assets(user_id);

-- ─── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────────
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garment_zones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_assets    ENABLE ROW LEVEL SECURITY;

-- users: ver e editar apenas seu próprio perfil
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- garment_templates: todos os usuários podem ver
CREATE POLICY "templates_select_all" ON public.garment_templates
  FOR SELECT TO authenticated USING (true);

-- garment_zones: todos podem ver
CREATE POLICY "zones_select_all" ON public.garment_zones
  FOR SELECT TO authenticated USING (true);

-- designs: usuário vê/gerencia apenas os seus
CREATE POLICY "designs_select_own" ON public.designs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "designs_insert_own" ON public.designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "designs_update_own" ON public.designs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "designs_delete_own" ON public.designs
  FOR DELETE USING (auth.uid() = user_id);

-- design_versions: acesso via design do usuário
CREATE POLICY "design_versions_select" ON public.design_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.designs d WHERE d.id = design_id AND d.user_id = auth.uid())
  );
CREATE POLICY "design_versions_insert" ON public.design_versions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.designs d WHERE d.id = design_id AND d.user_id = auth.uid())
  );

-- brand_assets: apenas o dono acessa
CREATE POLICY "brand_assets_select_own" ON public.brand_assets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "brand_assets_insert_own" ON public.brand_assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "brand_assets_delete_own" ON public.brand_assets
  FOR DELETE USING (auth.uid() = user_id);

-- ─── DADOS INICIAIS: Templates e zonas ───────────────────────────────────────

-- Camisa Manga Curta
INSERT INTO public.garment_templates (id, name, type, svg_template_url, model_3d_url)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Camisa Manga Curta', 'jersey_short', '', ''),
  ('11111111-0000-0000-0000-000000000002', 'Camisa Manga Longa', 'jersey_long', '', ''),
  ('11111111-0000-0000-0000-000000000003', 'Culote / Bretelle', 'bib_shorts', '', '')
ON CONFLICT DO NOTHING;

-- Zonas da Camisa Manga Curta
INSERT INTO public.garment_zones (template_id, zone_name, label, metadata)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'corpo_frontal',   'Corpo Frontal',   '{"svgPathId": "zona_corpo_frontal"}'),
  ('11111111-0000-0000-0000-000000000001', 'corpo_traseiro',  'Corpo Traseiro',  '{"svgPathId": "zona_corpo_traseiro"}'),
  ('11111111-0000-0000-0000-000000000001', 'manga_esquerda',  'Manga Esquerda',  '{"svgPathId": "zona_manga_esquerda"}'),
  ('11111111-0000-0000-0000-000000000001', 'manga_direita',   'Manga Direita',   '{"svgPathId": "zona_manga_direita"}'),
  ('11111111-0000-0000-0000-000000000001', 'gola',            'Gola',            '{"svgPathId": "zona_gola"}'),
  ('11111111-0000-0000-0000-000000000001', 'faixa_ziper',     'Faixa do Zíper',  '{"svgPathId": "zona_faixa_ziper"}'),
  ('11111111-0000-0000-0000-000000000001', 'laterais',        'Laterais',        '{"svgPathId": "zona_laterais"}'),
  ('11111111-0000-0000-0000-000000000001', 'bolsos_traseiros','Bolsos Traseiros', '{"svgPathId": "zona_bolsos_traseiros"}')
ON CONFLICT DO NOTHING;

-- Zonas da Camisa Manga Longa
INSERT INTO public.garment_zones (template_id, zone_name, label, metadata)
VALUES
  ('11111111-0000-0000-0000-000000000002', 'corpo_frontal',   'Corpo Frontal',    '{}'),
  ('11111111-0000-0000-0000-000000000002', 'corpo_traseiro',  'Corpo Traseiro',   '{}'),
  ('11111111-0000-0000-0000-000000000002', 'manga_esquerda',  'Manga Esquerda',   '{}'),
  ('11111111-0000-0000-0000-000000000002', 'manga_direita',   'Manga Direita',    '{}'),
  ('11111111-0000-0000-0000-000000000002', 'punho_esquerdo',  'Punho Esquerdo',   '{}'),
  ('11111111-0000-0000-0000-000000000002', 'punho_direito',   'Punho Direito',    '{}'),
  ('11111111-0000-0000-0000-000000000002', 'gola',            'Gola',             '{}'),
  ('11111111-0000-0000-0000-000000000002', 'faixa_ziper',     'Faixa do Zíper',   '{}'),
  ('11111111-0000-0000-0000-000000000002', 'laterais',        'Laterais',         '{}'),
  ('11111111-0000-0000-0000-000000000002', 'bolsos_traseiros','Bolsos Traseiros',  '{}')
ON CONFLICT DO NOTHING;

-- Zonas do Culote / Bretelle
INSERT INTO public.garment_zones (template_id, zone_name, label, metadata)
VALUES
  ('11111111-0000-0000-0000-000000000003', 'painel_frontal',  'Painel Frontal',   '{}'),
  ('11111111-0000-0000-0000-000000000003', 'painel_traseiro', 'Painel Traseiro',  '{}'),
  ('11111111-0000-0000-0000-000000000003', 'laterais',        'Laterais',         '{}'),
  ('11111111-0000-0000-0000-000000000003', 'alcas',           'Alças',            '{}'),
  ('11111111-0000-0000-0000-000000000003', 'pernas',          'Pernas',           '{}'),
  ('11111111-0000-0000-0000-000000000003', 'area_almofada',   'Área Almofada',    '{"readonly": true}')
ON CONFLICT DO NOTHING;

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────────────
-- Execute no Supabase Dashboard → Storage → Create Bucket ou via API:

-- Bucket para assets de marca (logos, imagens)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', false);

-- Bucket para previews de designs
-- INSERT INTO storage.buckets (id, name, public) VALUES ('design-previews', 'design-previews', true);

-- Políticas de storage (brand-assets):
-- CREATE POLICY "Usuário acessa seus próprios assets" ON storage.objects
--   FOR ALL USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de storage (design-previews):
-- CREATE POLICY "Previews são públicos" ON storage.objects
--   FOR SELECT USING (bucket_id = 'design-previews');
-- CREATE POLICY "Usuário gerencia seus previews" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'design-previews' AND auth.uid()::text = (storage.foldername(name))[1]);
