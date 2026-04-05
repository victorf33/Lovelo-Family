import { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Copy, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useEditorStore } from '@/stores/editorStore'
import { useAuthStore } from '@/stores/authStore'
import type { Design, DesignVersion } from '@/types'
import EditorCanvas from '@/components/editor/EditorCanvas'
import ToolPanel from '@/components/editor/ToolPanel'
import GarmentViewer from '@/components/preview3d/GarmentViewer'

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchDesignWithVersion(designId: string): Promise<Design & { versions: DesignVersion[] }> {
  const { data, error } = await supabase
    .from('designs')
    .select(`
      *,
      template:garment_templates(*, zones:garment_zones(*)),
      versions:design_versions(*)
    `)
    .eq('id', designId)
    .single()

  if (error) throw error
  return data as Design & { versions: DesignVersion[] }
}

async function saveDesignVersion(params: {
  designId: string
  versionNumber: number
  configJson: object
  previewUrl?: string
}) {
  const { error: verError } = await supabase.from('design_versions').insert({
    design_id: params.designId,
    version_number: params.versionNumber,
    config_json: params.configJson,
    preview_image_url: params.previewUrl ?? null,
  })
  if (verError) throw verError

  await supabase
    .from('designs')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', params.designId)
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Editor() {
  const { designId } = useParams<{ designId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const {
    designName,
    setDesignName,
    initEditor,
    config,
    isDirty,
    isSaving,
    setIsSaving,
    markSaved,
    viewMode,
    setViewMode,
    resetEditor,
  } = useEditorStore()

  // Carrega o design
  const { data: design, isLoading, error } = useQuery({
    queryKey: ['design', designId],
    queryFn: () => fetchDesignWithVersion(designId!),
    enabled: !!designId,
  })

  // Inicializa o editor quando o design é carregado
  useEffect(() => {
    if (design) {
      const versions = design.versions ?? []
      const latestVersion = versions.sort((a, b) => b.version_number - a.version_number)[0]
      initEditor(
        design.id,
        design.name,
        design.template_id,
        latestVersion?.config_json as any ?? undefined
      )
    }
    return () => resetEditor()
  }, [design?.id])

  // Salvar design
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!designId || !design) return
      setIsSaving(true)
      const versions = design.versions ?? []
      const nextVersion = (versions.length > 0
        ? Math.max(...versions.map((v) => v.version_number))
        : 0) + 1

      await saveDesignVersion({
        designId,
        versionNumber: nextVersion,
        configJson: config,
      })
    },
    onSuccess: () => {
      markSaved()
      queryClient.invalidateQueries({ queryKey: ['design', designId] })
    },
    onSettled: () => setIsSaving(false),
  })

  // Atalho de teclado Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty && !isSaving) saveMutation.mutate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirty, isSaving])

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
          <p className="text-[#555555] text-xs tracking-widest uppercase">Carregando design</p>
        </div>
      </div>
    )
  }

  if (error || !design) {
    return (
      <div className="h-screen w-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-sm mb-4">Design não encontrado.</p>
          <button onClick={() => navigate('/')} className="text-[#888888] text-xs underline">
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-[#0B0B0B] flex flex-col overflow-hidden">
      {/* ── Barra Superior ─────────────────────────────────────────────────── */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#1A1A1A] shrink-0 z-10">
        {/* Esquerda */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isDirty && !confirm('Há alterações não salvas. Deseja sair mesmo assim?')) return
              navigate('/')
            }}
            className="text-[#555555] hover:text-white transition-colors p-1"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-px h-4 bg-[#2B2B2B]" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-black text-[9px]">L</span>
            </div>
            <span className="text-[#555555] text-xs tracking-widest uppercase hidden sm:block">
              {design.template?.name}
            </span>
          </div>
        </div>

        {/* Centro — Nome do Design */}
        <div className="flex items-center">
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="bg-transparent text-white text-sm text-center font-medium focus:outline-none focus:bg-[#1A1A1A] rounded px-2 py-1 transition-colors max-w-[200px]"
          />
          {isDirty && (
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full ml-2" title="Alterações não salvas" />
          )}
        </div>

        {/* Direita */}
        <div className="flex items-center gap-2">
          {/* Modo de visualização */}
          <div className="hidden md:flex items-center bg-[#1A1A1A] rounded-md p-0.5">
            {(['2d', 'split', '3d'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-[#2B2B2B] text-white'
                    : 'text-[#555555] hover:text-white'
                }`}
              >
                {mode === '2d' ? '2D' : mode === '3d' ? '3D' : '2D + 3D'}
              </button>
            ))}
          </div>

          <button
            onClick={() => saveMutation.mutate()}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 bg-white hover:bg-[#EAEAEA] disabled:bg-[#1A1A1A] disabled:text-[#444444] text-black text-xs font-semibold tracking-wider uppercase px-3 py-2 rounded-md transition-colors"
          >
            {isSaving ? (
              <span className="w-3 h-3 border border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Save size={12} />
            )}
            <span className="hidden sm:block">{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </header>

      {/* ── Área Principal ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Painel de ferramentas (esquerda) */}
        <ToolPanel design={design} />

        {/* Canvas 2D */}
        {(viewMode === '2d' || viewMode === 'split') && (
          <div
            className={`flex flex-col ${
              viewMode === 'split' ? 'flex-1' : 'flex-1'
            } border-r border-[#1A1A1A] overflow-hidden`}
          >
            <EditorCanvas template={design.template!} />
          </div>
        )}

        {/* Preview 3D */}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-[360px]' : 'flex-1'} shrink-0`}>
            <GarmentViewer template={design.template!} />
          </div>
        )}
      </div>
    </div>
  )
}
