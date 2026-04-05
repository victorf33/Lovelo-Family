import { useState } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useEditorStore } from '@/stores/editorStore'
import { ELEMENT_LIBRARY, type ElementType, type DesignElement } from '@/types'

const ZONE_OPTIONS = [
  { value: 'corpo_frontal',   label: 'Corpo Frontal' },
  { value: 'corpo_traseiro',  label: 'Corpo Traseiro' },
  { value: 'manga_esquerda',  label: 'Manga Esquerda' },
  { value: 'manga_direita',   label: 'Manga Direita' },
  { value: 'gola',            label: 'Gola' },
  { value: 'faixa_ziper',     label: 'Faixa do Zíper' },
  { value: 'laterais',        label: 'Laterais' },
]

export default function ElementLibrary() {
  const { config, selectedZone, addElement, updateElement, removeElement, selectedElementId, selectElement } = useEditorStore()
  const [targetZone, setTargetZone] = useState(selectedZone ?? 'corpo_frontal')
  const [elementColor, setElementColor] = useState('#FFFFFF')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const selectedEl = config.elements.find((e) => e.id === selectedElementId)

  const handleAddElement = (type: ElementType) => {
    addElement(type, targetZone, elementColor)
  }

  return (
    <div className="flex flex-col">
      {/* Zona alvo */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <label className="text-[#666666] text-xs tracking-widest uppercase block mb-2">
          Adicionar à zona
        </label>
        <div className="relative">
          <select
            value={targetZone}
            onChange={(e) => setTargetZone(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-[#2B2B2B] text-white text-xs rounded-md px-3 py-2 appearance-none focus:outline-none focus:border-[#555555]"
          >
            {ZONE_OPTIONS.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
        </div>

        {/* Cor do elemento */}
        <div className="mt-3">
          <label className="text-[#666666] text-xs tracking-widest uppercase block mb-2">
            Cor do elemento
          </label>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 bg-[#0B0B0B] border border-[#2B2B2B] rounded-md px-3 py-2 w-full"
          >
            <div
              className="w-4 h-4 rounded border border-white/10"
              style={{ backgroundColor: elementColor }}
            />
            <span className="text-white text-xs font-mono">{elementColor}</span>
          </button>
          {showColorPicker && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <HexColorPicker
                color={elementColor}
                onChange={setElementColor}
                style={{ width: '100%', height: '140px' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Biblioteca de elementos */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">Elementos</p>
        <div className="space-y-1">
          {ELEMENT_LIBRARY.map((el) => (
            <button
              key={el.type}
              onClick={() => handleAddElement(el.type)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md transition-colors text-left group"
            >
              <span className="text-[#555555] text-base w-6 text-center">{el.icon}</span>
              <div className="flex-1">
                <p className="text-white text-xs">{el.label}</p>
                <p className="text-[#444444] text-[10px] leading-tight">{el.description}</p>
              </div>
              <span className="text-[#333333] group-hover:text-white text-xs transition-colors">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Elementos adicionados */}
      {config.elements.length > 0 && (
        <div className="p-4">
          <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">
            Aplicados ({config.elements.length})
          </p>
          <div className="space-y-2">
            {config.elements.map((el) => (
              <ElementItem
                key={el.id}
                element={el}
                isSelected={selectedElementId === el.id}
                onSelect={() => selectElement(selectedElementId === el.id ? null : el.id)}
                onUpdate={(changes) => updateElement(el.id, changes)}
                onRemove={() => removeElement(el.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Item de elemento adicionado ─────────────────────────────────────────────

interface ElementItemProps {
  element: DesignElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (changes: Partial<DesignElement>) => void
  onRemove: () => void
}

function ElementItem({ element, isSelected, onSelect, onUpdate, onRemove }: ElementItemProps) {
  const def = ELEMENT_LIBRARY.find((e) => e.type === element.type)

  return (
    <div className={`border rounded-md overflow-hidden transition-colors ${
      isSelected ? 'border-white/30 bg-white/5' : 'border-[#1E1E1E]'
    }`}>
      <button
        onClick={onSelect}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        <div
          className="w-4 h-4 rounded shrink-0 border border-white/10"
          style={{ backgroundColor: element.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs truncate">{def?.label ?? element.type}</p>
          <p className="text-[#444444] text-[10px]">{element.zone.replace(/_/g, ' ')}</p>
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
          {/* Opacidade */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#666666] text-[10px] tracking-widest uppercase">Opacidade</span>
              <span className="text-[#666666] text-[10px]">{Math.round(element.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={element.opacity}
              onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-white h-1"
            />
          </div>

          {/* Escala */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#666666] text-[10px] tracking-widest uppercase">Escala</span>
              <span className="text-[#666666] text-[10px]">{element.scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.1} max={3} step={0.1}
              value={element.scale}
              onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
              className="w-full accent-white h-1"
            />
          </div>

          {/* Rotação */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#666666] text-[10px] tracking-widest uppercase">Rotação</span>
              <span className="text-[#666666] text-[10px]">{element.rotation}°</span>
            </div>
            <input
              type="range"
              min={-180} max={180} step={1}
              value={element.rotation}
              onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
              className="w-full accent-white h-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}
