import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useEditorStore } from '@/stores/editorStore'
import { AVAILABLE_FONTS, type TextElement } from '@/types'

const ZONE_OPTIONS = [
  { value: 'corpo_frontal', label: 'Corpo Frontal' },
  { value: 'corpo_traseiro', label: 'Corpo Traseiro' },
  { value: 'manga_esquerda', label: 'Manga Esquerda' },
  { value: 'manga_direita', label: 'Manga Direita' },
]

export default function TextEditorPanel() {
  const { config, selectedZone, addText, updateText, removeText, selectedElementId, selectElement } = useEditorStore()
  const [targetZone, setTargetZone] = useState(selectedZone ?? 'corpo_frontal')

  return (
    <div className="flex flex-col">
      {/* Adicionar texto */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <label className="text-[#666666] text-xs tracking-widest uppercase block mb-2">
          Zona para o texto
        </label>
        <select
          value={targetZone}
          onChange={(e) => setTargetZone(e.target.value)}
          className="w-full bg-[#0B0B0B] border border-[#2B2B2B] text-white text-xs rounded-md px-3 py-2 focus:outline-none mb-3"
        >
          {ZONE_OPTIONS.map((z) => (
            <option key={z.value} value={z.value}>{z.label}</option>
          ))}
        </select>

        <button
          onClick={() => addText(targetZone)}
          className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#2B2B2B] border border-[#2B2B2B] text-white text-xs py-2 rounded-md transition-colors"
        >
          <Plus size={12} />
          Adicionar Texto
        </button>
      </div>

      {/* Textos adicionados */}
      {config.texts.length > 0 && (
        <div className="p-4">
          <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">
            Textos ({config.texts.length})
          </p>
          <div className="space-y-2">
            {config.texts.map((text) => (
              <TextItem
                key={text.id}
                text={text}
                isSelected={selectedElementId === text.id}
                onSelect={() => selectElement(selectedElementId === text.id ? null : text.id)}
                onUpdate={(changes) => updateText(text.id, changes)}
                onRemove={() => removeText(text.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface TextItemProps {
  text: TextElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (changes: Partial<TextElement>) => void
  onRemove: () => void
}

function TextItem({ text, isSelected, onSelect, onUpdate, onRemove }: TextItemProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <div className={`border rounded-md overflow-hidden transition-colors ${
      isSelected ? 'border-white/30 bg-white/5' : 'border-[#1E1E1E]'
    }`}>
      <button onClick={onSelect} className="w-full flex items-center gap-2 px-3 py-2 text-left">
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0 border border-white/10"
          style={{ backgroundColor: text.color }}
        >
          <span className="text-[8px] font-bold" style={{ color: text.color === '#FFFFFF' ? '#000' : '#fff' }}>
            T
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs truncate font-medium">{text.content || '—'}</p>
          <p className="text-[#444444] text-[10px]">{text.zone.replace(/_/g, ' ')} · {text.fontFamily}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="text-[#444444] hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </button>

      {isSelected && (
        <div className="px-3 pb-3 space-y-3 border-t border-[#1A1A1A] pt-3">
          {/* Conteúdo */}
          <div>
            <label className="text-[#666666] text-[10px] tracking-widest uppercase block mb-1">
              Texto
            </label>
            <input
              type="text"
              value={text.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full bg-[#0B0B0B] border border-[#2B2B2B] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#555555]"
            />
          </div>

          {/* Fonte */}
          <div>
            <label className="text-[#666666] text-[10px] tracking-widest uppercase block mb-1">
              Fonte
            </label>
            <select
              value={text.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full bg-[#0B0B0B] border border-[#2B2B2B] text-white text-xs rounded px-2 py-1.5 focus:outline-none"
            >
              {AVAILABLE_FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Tamanho */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#666666] text-[10px] tracking-widest uppercase">Tamanho</span>
              <span className="text-[#666666] text-[10px]">{text.fontSize}px</span>
            </div>
            <input
              type="range"
              min={8} max={120} step={1}
              value={text.fontSize}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-white h-1"
            />
          </div>

          {/* Cor */}
          <div>
            <label className="text-[#666666] text-[10px] tracking-widest uppercase block mb-1">Cor</label>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 bg-[#0B0B0B] border border-[#2B2B2B] rounded px-2 py-1.5 w-full"
            >
              <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: text.color }} />
              <span className="text-white text-xs font-mono">{text.color}</span>
            </button>
            {showColorPicker && (
              <div className="mt-1 rounded overflow-hidden">
                <HexColorPicker
                  color={text.color}
                  onChange={(c) => onUpdate({ color: c })}
                  style={{ width: '100%', height: '120px' }}
                />
              </div>
            )}
          </div>

          {/* Alinhamento + Peso */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[#666666] text-[10px] tracking-widest uppercase block mb-1">Alinhamento</label>
              <div className="flex bg-[#0B0B0B] border border-[#2B2B2B] rounded overflow-hidden">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => onUpdate({ align })}
                    className={`flex-1 py-1 text-[10px] transition-colors ${
                      text.align === align ? 'bg-white text-black' : 'text-[#555555]'
                    }`}
                  >
                    {align === 'left' ? '←' : align === 'center' ? '↔' : '→'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[#666666] text-[10px] tracking-widest uppercase block mb-1">Peso</label>
              <div className="flex bg-[#0B0B0B] border border-[#2B2B2B] rounded overflow-hidden">
                {(['normal', 'bold'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdate({ fontWeight: w })}
                    className={`flex-1 py-1 text-[10px] transition-colors ${
                      text.fontWeight === w ? 'bg-white text-black' : 'text-[#555555]'
                    }`}
                  >
                    {w === 'normal' ? 'N' : 'B'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
