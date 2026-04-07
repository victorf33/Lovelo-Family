import { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { useEditorStore, getZoneColor } from '@/stores/editorStore'
import type { GarmentTemplate } from '@/types'

// Paleta de cores sugeridas para ciclismo
const PRESET_COLORS = [
  '#FFFFFF', '#F5F4F1', '#E8E5E0', '#1C1B1A', '#3D3B39', '#6B6864',
  '#FF3B30', '#CC0000', '#FF6B35', '#FF9500', '#FFCC00', '#FFE55C',
  '#34C759', '#00A86B', '#00C7BE', '#007AFF', '#0040DD', '#5856D6',
  '#AF52DE', '#FF2D55', '#FF6B9D', '#FFB3C1', '#A8EDEA', '#D4E8FF',
]

interface Props {
  template: GarmentTemplate
}

export default function ColorPanel({ template }: Props) {
  const { config, selectedZone, selectZone, setZoneColor } = useEditorStore()
  const [pickerColor, setPickerColor] = useState('#E4E2DC')

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
      <div className="p-4 border-b border-[#F0EDE8]">
        <p className="text-[#A8A49E] text-xs tracking-widest uppercase mb-3">Zonas da Peça</p>
        <div className="space-y-1">
          {zones.length === 0 ? (
            <p className="text-[#C8C5BF] text-xs">Nenhuma zona disponível.</p>
          ) : (
            zones.map((zone) => {
              const zoneColor = getZoneColor(config, zone.zone_name)
              const isSelected = selectedZone === zone.zone_name

              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone.zone_name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                    isSelected
                      ? 'bg-[#F0EDE8] border border-[#D8D5CE]'
                      : 'hover:bg-[#F8F6F3] border border-transparent'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-md border border-black/10 shrink-0 shadow-sm"
                    style={{ backgroundColor: zoneColor }}
                  />
                  <span className="text-[#1C1B1A] text-xs font-medium">{zone.label}</span>
                </button>
              )
            })
          )}
        </div>

        {/* Aplicar a todas as zonas */}
        <button
          onClick={handleApplyToAll}
          disabled={!pickerColor}
          className="mt-3 w-full text-[#8A8580] hover:text-[#1C1B1A] text-xs py-1.5 border border-[#E8E5E0] hover:border-[#C8C5BF] rounded-lg transition-colors disabled:opacity-30"
        >
          Aplicar cor a todas as zonas
        </button>
      </div>

      {/* Color Picker */}
      {selectedZone && (
        <div className="p-4 border-b border-[#F0EDE8]">
          <p className="text-[#A8A49E] text-xs tracking-widest uppercase mb-3">
            Cor — {selectedZone.replace(/_/g, ' ')}
          </p>

          <div className="rounded-xl overflow-hidden shadow-sm">
            <HexColorPicker
              color={pickerColor}
              onChange={handleColorChange}
              style={{ width: '100%', height: '160px' }}
            />
          </div>

          {/* Input HEX */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#A8A49E] text-xs font-mono">#</span>
            <HexColorInput
              color={pickerColor}
              onChange={handleColorChange}
              className="flex-1 bg-[#F5F4F1] border border-[#E8E5E0] rounded-lg px-2 py-1.5 text-[#1C1B1A] text-xs font-mono focus:outline-none focus:border-[#A8A49E] transition-colors"
              prefixed={false}
            />
            <div
              className="w-8 h-8 rounded-lg border border-black/10 shrink-0 shadow-sm"
              style={{ backgroundColor: pickerColor }}
            />
          </div>
        </div>
      )}

      {/* Cores predefinidas */}
      <div className="p-4">
        <p className="text-[#A8A49E] text-xs tracking-widest uppercase mb-3">Paleta Sugerida</p>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handlePresetClick(color)}
              title={color}
              className={`aspect-square rounded-lg border transition-all shadow-sm ${
                pickerColor.toUpperCase() === color.toUpperCase()
                  ? 'border-[#1C1B1A] scale-110 shadow-md'
                  : 'border-black/8 hover:border-black/20 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
