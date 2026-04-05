import { useState } from 'react'
import { X } from 'lucide-react'
import type { GarmentTemplate, GarmentType } from '@/types'

const GARMENT_ICONS: Record<GarmentType, string> = {
  jersey_short: '🚴',
  jersey_long: '🧥',
  bib_shorts: '🩱',
}

const GARMENT_LABELS: Record<GarmentType, string> = {
  jersey_short: 'Camisa Manga Curta',
  jersey_long: 'Camisa Manga Longa',
  bib_shorts: 'Culote / Bretelle',
}

interface Props {
  templates: GarmentTemplate[]
  onConfirm: (templateId: string, name: string) => void
  onClose: () => void
  isLoading: boolean
}

export default function NewDesignModal({ templates, onConfirm, onClose, isLoading }: Props) {
  const [step, setStep] = useState<'select' | 'name'>('select')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [name, setName] = useState('')

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const tmpl = templates.find((t) => t.id === templateId)
    if (tmpl) {
      setName(`${GARMENT_LABELS[tmpl.type]} — ${new Date().toLocaleDateString('pt-BR')}`)
    }
    setStep('name')
  }

  const handleConfirm = () => {
    if (selectedTemplateId && name.trim()) {
      onConfirm(selectedTemplateId, name.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-lg w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-white text-sm font-medium tracking-wider uppercase">
              {step === 'select' ? 'Selecionar Peça' : 'Nome do Design'}
            </h2>
            <p className="text-[#555555] text-xs mt-0.5">
              {step === 'select'
                ? 'Escolha o tipo de peça para este design'
                : 'Dê um nome para identificar este design'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555555] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' ? (
            <div className="space-y-3">
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#555555] text-sm">
                    Nenhum template disponível. Configure os templates no Supabase.
                  </p>
                </div>
              ) : (
                templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="w-full flex items-center gap-4 bg-[#0E0E0E] hover:bg-[#161616] border border-[#1E1E1E] hover:border-[#333333] rounded-lg p-4 text-left transition-all"
                  >
                    <span className="text-2xl">{GARMENT_ICONS[template.type]}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{template.name}</p>
                      <p className="text-[#555555] text-xs mt-0.5">{GARMENT_LABELS[template.type]}</p>
                    </div>
                    <span className="ml-auto text-[#444444]">→</span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Peça selecionada */}
              {selectedTemplate && (
                <div className="flex items-center gap-3 bg-[#0E0E0E] border border-[#1E1E1E] rounded-lg p-3">
                  <span className="text-xl">{GARMENT_ICONS[selectedTemplate.type]}</span>
                  <div>
                    <p className="text-white text-xs font-medium">{selectedTemplate.name}</p>
                    <p className="text-[#555555] text-xs">{GARMENT_LABELS[selectedTemplate.type]}</p>
                  </div>
                  <button
                    onClick={() => setStep('select')}
                    className="ml-auto text-[#555555] hover:text-white text-xs transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              )}

              {/* Campo nome */}
              <div>
                <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">
                  Nome do Design
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full bg-[#0B0B0B] border border-[#2B2B2B] focus:border-[#555555] rounded-md px-4 py-3 text-white text-sm placeholder:text-[#333333] focus:outline-none transition-colors"
                  placeholder="Ex: Coleção Verão 2025"
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                />
              </div>

              <button
                onClick={handleConfirm}
                disabled={!name.trim() || isLoading}
                className="w-full bg-white hover:bg-[#EAEAEA] disabled:bg-[#222222] disabled:text-[#444444] text-black text-xs font-semibold tracking-widest uppercase py-3 rounded-md transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Criando...
                  </span>
                ) : (
                  'Criar e Abrir Editor'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
