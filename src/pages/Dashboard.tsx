import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, LogOut, Copy, Trash2, Edit2, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Design, GarmentTemplate, GarmentType } from '@/types'
import NewDesignModal from '@/components/dashboard/NewDesignModal'

const GARMENT_LABELS: Record<GarmentType, string> = {
  jersey_short: 'Camisa Manga Curta',
  jersey_long: 'Camisa Manga Longa',
  bib_shorts: 'Culote / Bretelle',
}

// ─── Queries ─────────────────────────────────────────────────────────────────

async function fetchDesigns(userId: string): Promise<Design[]> {
  const { data, error } = await supabase
    .from('designs')
    .select(`
      *,
      template:garment_templates(*),
      latest_version:design_versions(*)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((d) => ({
    ...d,
    latest_version: Array.isArray(d.latest_version)
      ? d.latest_version[d.latest_version.length - 1]
      : d.latest_version,
  })) as Design[]
}

async function fetchTemplates(): Promise<GarmentTemplate[]> {
  const { data, error } = await supabase
    .from('garment_templates')
    .select('*')
    .order('name')
  if (error) throw error
  return (data ?? []) as GarmentTemplate[]
}

async function createDesign(params: {
  userId: string
  templateId: string
  name: string
}): Promise<Design> {
  const { data, error } = await supabase
    .from('designs')
    .insert({ user_id: params.userId, template_id: params.templateId, name: params.name })
    .select()
    .single()
  if (error) throw error

  // Cria versão inicial vazia
  await supabase.from('design_versions').insert({
    design_id: data.id,
    version_number: 1,
    config_json: { baseColors: {}, elements: [], logos: [], texts: [] },
  })

  return data as Design
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, signOut } = useAuthStore()
  const [showNewModal, setShowNewModal] = useState(false)

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['designs', user?.id],
    queryFn: () => fetchDesigns(user!.id),
    enabled: !!user,
  })

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  const createMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: (newDesign) => {
      queryClient.invalidateQueries({ queryKey: ['designs'] })
      navigate(`/editor/${newDesign.id}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (designId: string) => {
      const { error } = await supabase.from('designs').delete().eq('id', designId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['designs'] }),
  })

  const duplicateMutation = useMutation({
    mutationFn: async (design: Design) => {
      const { data, error } = await supabase
        .from('designs')
        .insert({
          user_id: user!.id,
          template_id: design.template_id,
          name: `${design.name} (cópia)`,
        })
        .select()
        .single()
      if (error) throw error

      if (design.latest_version) {
        await supabase.from('design_versions').insert({
          design_id: data.id,
          version_number: 1,
          config_json: design.latest_version.config_json,
        })
      }
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['designs'] }),
  })

  const handleNewDesign = (templateId: string, name: string) => {
    createMutation.mutate({ userId: user!.id, templateId, name })
    setShowNewModal(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="h-screen w-screen bg-[#0B0B0B] flex flex-col overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-black text-xs">L</span>
          </div>
          <div>
            <span className="text-white text-sm font-medium tracking-wider">LOVELO</span>
            <span className="text-[#555555] text-xs ml-2 tracking-widest uppercase">Design Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#555555] text-xs hidden sm:block">{user?.email}</span>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-[#EAEAEA] text-black text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={14} />
            Novo Design
          </button>
          <button
            onClick={signOut}
            className="text-[#555555] hover:text-white transition-colors p-2"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Conteúdo ──────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-white text-xl font-light tracking-[0.15em] uppercase">
            Meus Designs
          </h1>
          <p className="text-[#444444] text-xs mt-1 tracking-wide">
            {designs.length} {designs.length === 1 ? 'design criado' : 'designs criados'}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        )}

        {/* Estado vazio */}
        {!isLoading && designs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 border border-[#2B2B2B] rounded-lg flex items-center justify-center mb-6">
              <Plus size={24} className="text-[#444444]" />
            </div>
            <h2 className="text-white text-sm font-medium tracking-wider mb-2">
              Nenhum design ainda
            </h2>
            <p className="text-[#444444] text-xs mb-6 max-w-xs">
              Crie seu primeiro design de peça esportiva e comece a dar vida à sua marca.
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-white hover:bg-[#EAEAEA] text-black text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-md transition-colors"
            >
              Criar Primeiro Design
            </button>
          </div>
        )}

        {/* Grid de designs */}
        {!isLoading && designs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onEdit={() => navigate(`/editor/${design.id}`)}
                onDuplicate={() => duplicateMutation.mutate(design)}
                onDelete={() => {
                  if (confirm(`Excluir "${design.name}"? Esta ação não pode ser desfeita.`)) {
                    deleteMutation.mutate(design.id)
                  }
                }}
                formatDate={formatDate}
                garmentLabel={GARMENT_LABELS[design.template?.type ?? 'jersey_short']}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal novo design */}
      {showNewModal && (
        <NewDesignModal
          templates={templates}
          onConfirm={handleNewDesign}
          onClose={() => setShowNewModal(false)}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  )
}

// ─── Card de Design ───────────────────────────────────────────────────────────

interface DesignCardProps {
  design: Design
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  formatDate: (d: string) => string
  garmentLabel: string
}

function DesignCard({
  design,
  onEdit,
  onDuplicate,
  onDelete,
  formatDate,
  garmentLabel,
}: DesignCardProps) {
  const hasPreview = !!design.latest_version?.preview_image_url

  return (
    <div className="group bg-[#111111] border border-[#1E1E1E] hover:border-[#2B2B2B] rounded-lg overflow-hidden transition-all duration-200">
      {/* Preview */}
      <div
        className="aspect-square bg-[#0E0E0E] flex items-center justify-center relative cursor-pointer"
        onClick={onEdit}
      >
        {hasPreview ? (
          <img
            src={design.latest_version!.preview_image_url!}
            alt={design.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border border-[#2B2B2B] rounded-md flex items-center justify-center">
              <span className="text-[#333333] text-xl">◈</span>
            </div>
            <span className="text-[#333333] text-xs">Sem prévia</span>
          </div>
        )}

        {/* Overlay de edição */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold tracking-widest uppercase">
            Editar
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <h3 className="text-white text-sm font-medium truncate">{design.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[#555555] text-xs">{garmentLabel}</span>
          <span className="text-[#444444] text-xs">{formatDate(design.updated_at)}</span>
        </div>
      </div>

      {/* Ações */}
      <div className="px-4 py-3 border-t border-[#1A1A1A] flex items-center gap-1">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-[#666666] hover:text-white text-xs px-2 py-1 rounded transition-colors"
          title="Editar"
        >
          <Edit2 size={12} />
          Editar
        </button>
        <button
          onClick={onDuplicate}
          className="flex items-center gap-1.5 text-[#666666] hover:text-white text-xs px-2 py-1 rounded transition-colors"
          title="Duplicar"
        >
          <Copy size={12} />
          Duplicar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-[#666666] hover:text-red-400 text-xs px-2 py-1 rounded transition-colors ml-auto"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
