import { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { useEditorStore, getZoneColor } from '@/stores/editorStore'
import type { GarmentTemplate } from '@/types'

// Paleta de cores sugeridas para ciclismo
const PRESET_COLORS = [
  '#0B0B0B', '#1A1A1A', '#2B2B2B', '#FFFFFF', '#EAEAEA', '#CFCFCF',
  '#FF0000', '#CC0000', '#FF4400', '#FF8800', '#FFCC00', '#FFE500',
  '#00AA44', '#007733', '#00CCBB', '#0055CC', '#0033AA', '#3300CC',
  '#6600CC', '#AA00CC', '#CC0066', '#FF0066', '#FF6699', '#FFCCDD',
]

interface Props {
  template: GarmentTemplate
}

export default function ColorPanel({ template }: Props) {
  const { config, selectedZone, selectZone, setZoneColor } = useEditorStore()
  const [pickerColor, setPickerColor] = useState('#0B0B0B')

  const zones = template.zones ?? []

  const handleZoneSelect = (zoneName: string) => {
    selectZone(zoneName)
    setPickerColor(getZoneColor(config, zoneName))
  }

  const handleColorChange = (color: string) => {
    setPickerColor(color)
    if (selectedZone) {
      setZoneColor(selectedZone, color)
    }
  }

  const handlePresetClick = (color: string) => {
    setPickerColor(color)
    if (selectedZone) {
      setZoneColor(selectedZone, color)
    }
  }

  const handleApplyToAll = () => {
    if (!pickerColor) return
    zones.forEach((z) => setZoneColor(z.zone_name, pickerColor))
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Seleção de zona */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">Zonas da Peça</p>
        <div className="space-y-1">
          {zones.length === 0 ? (
            <p className="text-[#444444] text-xs">Nenhuma zona disponível.</p>
          ) : (
            zones.map((zone) => {
              const zoneColor = getZoneColor(config, zone.zone_name)
              const isSelected = selectedZone === zone.zone_name

              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone.zone_name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                    isSelected
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded border border-white/10 shrink-0"
                    style={{ backgroundColor: zoneColor }}
                  />
                  <span className="text-white text-xs">{zone.label}</span>
                </button>
              )
            })
          )}
        </div>

        {/* Aplicar a todas as zonas */}
        <button
          onClick={handleApplyToAll}
          disabled={!pickerColor}
          className="mt-3 w-full text-[#666666] hover:text-white text-xs py-1.5 border border-[#2B2B2B] hover:border-[#444444] rounded transition-colors disabled:opacity-30"
        >
          Aplicar cor a todas as zonas
        </button>
      </div>

      {/* Color Picker */}
      {selectedZone && (
        <div className="p-4 border-b border-[#1A1A1A]">
          <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">
            Cor — {selectedZone.replace(/_/g, ' ')}
          </p>

          {/* Picker customizado */}
          <div className="rounded-lg overflow-hidden">
            <HexColorPicker
              color={pickerColor}
              onChange={handleColorChange}
              style={{ width: '100%', height: '160px' }}
            />
          </div>

          {/* Input HEX */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#555555] text-xs">#</span>
            <HexColorInput
              color={pickerColor}
              onChange={handleColorChange}
              className="flex-1 bg-[#0B0B0B] border border-[#2B2B2B] rounded px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-[#555555]"
              prefixed={false}
            />
            <div
              className="w-8 h-8 rounded border border-white/10 shrink-0"
              style={{ backgroundColor: pickerColor }}
            />
          </div>
        </div>
      )}

      {/* Cores predefinidas */}
      <div className="p-4">
        <p className="text-[#666666] text-xs tracking-widest uppercase mb-3">Paleta Sugerida</p>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handlePresetClick(color)}
              title={color}
              className={`aspect-square rounded border transition-all ${
                pickerColor.toUpperCase() === color.toUpperCase()
                  ? 'border-white scale-110'
                  : 'border-white/10 hover:border-white/40 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
