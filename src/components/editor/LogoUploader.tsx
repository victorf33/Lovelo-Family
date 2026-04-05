import { useRef, useState } from 'react'
import { Upload, Trash2, Image } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { useAuthStore } from '@/stores/authStore'
import { uploadAsset } from '@/lib/supabase'
import type { LogoElement } from '@/types'

const ZONE_OPTIONS = [
  { value: 'corpo_frontal', label: 'Corpo Frontal' },
  { value: 'corpo_traseiro', label: 'Corpo Traseiro' },
  { value: 'manga_esquerda', label: 'Manga Esquerda' },
  { value: 'manga_direita', label: 'Manga Direita' },
  { value: 'gola', label: 'Gola' },
]

export default function LogoUploader() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()
  const { config, selectedZone, addLogo, updateLogo, removeLogo, selectedElementId, selectElement } = useEditorStore()

  const [isUploading, setIsUploading] = useState(false)
  const [targetZone, setTargetZone] = useState(selectedZone ?? 'corpo_frontal')
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const allowed = ['image/svg+xml', 'image/png']
    if (!allowed.includes(file.type)) {
      setError('Formato não suportado. Use SVG ou PNG.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5 MB.')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const url = await uploadAsset(user.id, file)
      addLogo({
        file: file.name,
        file_url: url,
        zone: targetZone,
        x: 50,
        y: 50,
        width: 100,
        height: 60,
        opacity: 1,
      })
    } catch (err) {
      setError('Erro ao fazer upload. Tente novamente.')
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col">
      {/* Zona alvo */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <label className="text-[#666666] text-xs tracking-widest uppercase block mb-2">
          Posicionar na zona
        </label>
        <select
          value={targetZone}
          onChange={(e) => setTargetZone(e.target.value)}
          className="w-full bg-[#0B0B0B] border border-[#2B2B2B] text-white text-xs rounded-md px-3 py-2 focus:outline-none"
        >
          {ZONE_OPTIONS.map((z) => (
            <option key={z.value} value={z.value}>{z.label}</option>
          ))}
        </select>
      </div>

      {/* Upload */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">Upload de Logo</p>

        <input
          ref={fileRef}
          type="file"
          accept=".svg,.png,image/svg+xml,image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full border border-dashed border-[#333333] hover:border-[#555555] rounded-lg py-6 flex flex-col items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-[#666666] text-xs">Enviando...</span>
            </>
          ) : (
            <>
              <Upload size={20} className="text-[#444444]" />
              <span className="text-[#666666] text-xs">Clique para enviar</span>
              <span className="text-[#333333] text-[10px]">SVG ou PNG · Máx 5 MB</span>
            </>
          )}
        </button>

        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}
      </div>

      {/* Logos adicionados */}
      {config.logos.length > 0 && (
        <div className="p-4">
          <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">
            Logos ({config.logos.length})
          </p>
          <div className="space-y-2">
            {config.logos.map((logo) => (
              <LogoItem
                key={logo.id}
                logo={logo}
                isSelected={selectedElementId === logo.id}
                onSelect={() => selectElement(selectedElementId === logo.id ? null : logo.id)}
                onUpdate={(changes) => updateLogo(logo.id, changes)}
                onRemove={() => removeLogo(logo.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface LogoItemProps {
  logo: LogoElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (changes: Partial<LogoElement>) => void
  onRemove: () => void
}

function LogoItem({ logo, isSelected, onSelect, onUpdate, onRemove }: LogoItemProps) {
  return (
    <div className={`border rounded-md overflow-hidden transition-colors ${
      isSelected ? 'border-white/30 bg-white/5' : 'border-[#1E1E1E]'
    }`}>
      <button onClick={onSelect} className="w-full flex items-center gap-2 px-3 py-2 text-left">
        <div className="w-8 h-8 bg-[#0E0E0E] rounded border border-[#1E1E1E] flex items-center justify-center shrink-0">
          {logo.file_url ? (
            <img src={logo.file_url} alt={logo.file} className="w-6 h-6 object-contain" />
          ) : (
            <Image size={12} className="text-[#444444]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs truncate">{logo.file}</p>
          <p className="text-[#444444] text-[10px]">{logo.zone.replace(/_/g, ' ')}</p>
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
          <SliderControl
            label="Largura"
            value={logo.width}
            min={20} max={300} step={1}
            unit="px"
            onChange={(v) => onUpdate({ width: v })}
          />
          <SliderControl
            label="Opacidade"
            value={logo.opacity}
            min={0} max={1} step={0.01}
            unit="%"
            displayValue={Math.round(logo.opacity * 100)}
            onChange={(v) => onUpdate({ opacity: v })}
          />
        </div>
      )}
    </div>
  )
}

function SliderControl({
  label, value, min, max, step, unit, displayValue, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  unit: string; displayValue?: number; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[#666666] text-[10px] tracking-widest uppercase">{label}</span>
        <span className="text-[#666666] text-[10px]">{displayValue ?? value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-white h-1"
      />
    </div>
  )
}
