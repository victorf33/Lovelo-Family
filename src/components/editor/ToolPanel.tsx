import { Palette, Layers, Image, Type, Download, MousePointer } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import type { Design, EditorTool } from '@/types'
import ColorPanel from './ColorPanel'
import ElementLibrary from './ElementLibrary'
import LogoUploader from './LogoUploader'
import TextEditorPanel from './TextEditorPanel'
import ExportPanel from './ExportPanel'

const TOOLS: { id: EditorTool; icon: React.FC<{ size?: number }>; label: string }[] = [
  { id: 'select',    icon: MousePointer, label: 'Selecionar' },
  { id: 'cor',       icon: Palette,      label: 'Cores' },
  { id: 'elementos', icon: Layers,       label: 'Elementos' },
  { id: 'logos',     icon: Image,        label: 'Logos' },
  { id: 'texto',     icon: Type,         label: 'Texto' },
  { id: 'exportar',  icon: Download,     label: 'Exportar' },
]

interface Props {
  design: Design
}

export default function ToolPanel({ design }: Props) {
  const { selectedTool, selectTool } = useEditorStore()

  const renderPanelContent = () => {
    switch (selectedTool) {
      case 'cor':       return <ColorPanel template={design.template!} />
      case 'elementos': return <ElementLibrary />
      case 'logos':     return <LogoUploader />
      case 'texto':     return <TextEditorPanel />
      case 'exportar':  return <ExportPanel design={design} />
      default:          return <SelectionHint />
    }
  }

  return (
    <div className="flex h-full shrink-0">
      {/* ── Barra de ícones ─────────────────────────────────────────────── */}
      <div className="w-14 flex flex-col items-center py-3 gap-1 border-r border-[#E8E5E0] bg-white">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => selectTool(id)}
            title={label}
            className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all group relative ${
              selectedTool === id
                ? 'bg-[#1C1B1A] text-white shadow-sm'
                : 'text-[#A8A49E] hover:text-[#1C1B1A] hover:bg-[#F0EDE8]'
            }`}
          >
            <Icon size={16} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 bg-[#1C1B1A] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Painel de conteúdo ──────────────────────────────────────────── */}
      {selectedTool !== 'select' && (
        <div className="w-64 border-r border-[#E8E5E0] bg-white flex flex-col overflow-hidden shadow-sm">
          {/* Cabeçalho do painel */}
          <div className="px-4 py-3 border-b border-[#F0EDE8] shrink-0">
            <h3 className="text-[#1C1B1A] text-xs font-semibold tracking-widest uppercase">
              {TOOLS.find((t) => t.id === selectedTool)?.label}
            </h3>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 overflow-y-auto">
            {renderPanelContent()}
          </div>
        </div>
      )}
    </div>
  )
}

function SelectionHint() {
  return (
    <div className="p-4 text-center">
      <p className="text-[#C8C5BF] text-xs leading-relaxed">
        Selecione uma ferramenta para editar a peça.
      </p>
    </div>
  )
}
