# Lovelo Design Studio

Software de criação visual de peças esportivas de ciclismo (camisetas, culotes) com editor 2D, preview 3D e versionamento.

## Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Routing**: React Router v6
- **Estado**: Zustand (`authStore`, `editorStore`)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Queries**: TanStack React Query
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Color picker**: react-colorful

## Comandos

```bash
npm run dev       # Dev server em http://localhost:5173
npm run build     # Build de produção → dist/
npm run preview   # Preview do build
```

## Estrutura

```
src/
├── pages/         # Login, Dashboard, Editor
├── components/
│   ├── editor/    # EditorCanvas, ToolPanel, ColorPanel, ElementLibrary, TextEditorPanel, LogoUploader, ExportPanel
│   ├── preview3d/ # GarmentViewer (CSS 3D)
│   └── dashboard/ # NewDesignModal
├── stores/        # authStore.ts, editorStore.ts (Zustand)
├── lib/           # supabase.ts, database.types.ts
├── templates/     # jerseyShort.ts (SVG templates)
├── types/         # index.ts
└── App.tsx        # Router: /login, /, /editor/:designId
```

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://qjfacqacrmhpclpywqpu.supabase.co
VITE_SUPABASE_ANON_KEY=<jwt_anon_key>
VITE_APP_NAME=Lovelo Design Studio
```

Em produção, as variáveis estão configuradas no painel da Netlify.

## Deploy (Netlify)

- **Site**: `lovelo-design-studio.netlify.app`
- **Site ID**: `e021e8f4-45c4-4bcc-990e-7ebc9c8dade7`
- **Team**: Lovelo (`victorftdoesp13`)
- Build: `npm run build` → publica `dist/`
- SPA redirect configurado em `netlify.toml`

Para novo deploy manual:
```bash
npx @netlify/mcp@latest --site-id e021e8f4-45c4-4bcc-990e-7ebc9c8dade7
```

## Banco de Dados (Supabase)

Schema em `supabase/schema.sql`. Tabelas principais:
- `users` — perfil do usuário (extensão de auth.users)
- `garment_templates` — templates das peças (jersey_short, jersey_long, bib_shorts)
- `garment_zones` — zonas editáveis por template (corpo_frontal, manga_esquerda, etc.)
- `designs` — designs criados pelo usuário
- `design_versions` — histórico de versões (config_json JSONB)
- `brand_assets` — logos e assets do usuário

RLS ativado em todas as tabelas.

## Fluxo do Editor

1. Dashboard lista designs do usuário
2. Criar/duplicar design → abre `/editor/:designId`
3. Editor carrega config da última versão
4. Usuário edita zonas (cores, elementos, logos, textos)
5. Salva → cria nova `design_version` com `version_number` incrementado
6. Atalho: `Ctrl+S` para salvar

## Tipos de Peça

- `jersey_short` — camisa manga curta
- `jersey_long` — camisa manga longa
- `bib_shorts` — culote

## Observações

- O arquivo `.env` não está no git (está no `.gitignore`)
- `node_modules/` e `dist/` também ignorados
- Dependências que não estavam no `package.json` original e foram adicionadas: `@tanstack/react-query`, `@supabase/supabase-js`, `html-to-image`, `jspdf`
