import { useRef, useEffect, useCallback, useState } from 'react'
import { useEditorStore, getZoneColor } from '@/stores/editorStore'
import type { GarmentTemplate } from '@/types'
import { JERSEY_SHORT_SVG_FRONT, JERSEY_SHORT_SVG_BACK } from '@/templates/jerseyShort'

interface Props {
  template: GarmentTemplate
}

type ViewSide = 'frente' | 'costas'

export default function EditorCanvas({ template }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState<ViewSide>('frente')

  const { config, selectedZone, hoveredZone, selectedTool, selectZone, hoverZone } = useEditorStore()

  const getSVGContent = useCallback(() => {
    if (template.type === 'jersey_short') {
      return side === 'frente' ? JERSEY_SHORT_SVG_FRONT : JERSEY_SHORT_SVG_BACK
    }
    return JERSEY_SHORT_SVG_FRONT
  }, [template.type, side])

  // Injeta o SVG e configura os listeners de zona
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    container.innerHTML = getSVGContent()

    const svg = container.querySelector('svg')
    if (!svg) return

    const zoneElements = svg.querySelectorAll('[data-zone]')

    // Aplica cores das zonas
    zoneElements.forEach((el) => {
      const zoneName = el.getAttribute('data-zone')
      if (!zoneName) return
      const color = getZoneColor(config, zoneName)

      if (el.tagName === 'path' || el.tagName === 'rect' || el.tagName === 'ellipse') {
        ;(el as SVGElement).style.fill = color
      }
    })

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as SVGElement).closest('[data-zone]') as SVGElement | null
      if (target) hoverZone(target.getAttribute('data-zone'))
    }
    const handleMouseOut = () => hoverZone(null)
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as SVGElement).closest('[data-zone]') as SVGElement | null
      if (target) {
        const zoneName = target.getAttribute('data-zone')
        selectZone(zoneName === selectedZone ? null : zoneName)
      }
    }

    svg.addEventListener('mouseover', handleMouseOver)
    svg.addEventListener('mouseout', handleMouseOut)
    svg.addEventListener('click', handleClick)

    return () => {
      svg.removeEventListener('mouseover', handleMouseOver)
      svg.removeEventListener('mouseout', handleMouseOut)
      svg.removeEventListener('click', handleClick)
    }
  }, [getSVGContent, config, selectedZone, selectedTool])

  // Destaque da zona selecionada / hover
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return

    const zoneElements = svg.querySelectorAll('[data-zone]')

    zoneElements.forEach((el) => {
      const zoneName = el.getAttribute('data-zone')
      const svgEl = el as SVGElement

      svgEl.style.filter = ''
      svgEl.style.opacity = ''
      svgEl.style.strokeWidth = ''
      svgEl.style.stroke = ''

      if (zoneName === selectedZone) {
        svgEl.style.filter = 'brightness(0.88)'
        svgEl.style.stroke = 'rgba(0,0,0,0.35)'
        svgEl.style.strokeWidth = '2'
      } else if (zoneName === hoveredZone && !selectedZone) {
        svgEl.style.filter = 'brightness(0.93)'
      }
    })
  }, [selectedZone, hoveredZone])

  return (
    <div className="flex flex-col h-full bg-[#EDECEA]">
      {/* ── Barra de controle do canvas ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E3E0DB] bg-white shrink-0">
        <div className="flex items-center gap-1 bg-[#F0EDE8] rounded-lg p-0.5">
          {(['frente', 'costas'] as ViewSide[]).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`px-3 py-1 text-xs rounded-md transition-all capitalize font-medium ${
                side === s
                  ? 'bg-white text-[#1C1B1A] shadow-sm'
                  : 'text-[#8A8580] hover:text-[#1C1B1A]'
              }`}
            >
              {s === 'frente' ? 'Frente' : 'Costas'}
            </button>
          ))}
        </div>

        {selectedZone && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: getZoneColor(config, selectedZone) }}
            />
            <span className="text-[#8A8580] text-xs capitalize">
              {selectedZone.replace(/_/g, ' ')}
            </span>
            <button
              onClick={() => selectZone(null)}
              className="text-[#C8C5BF] hover:text-[#1C1B1A] text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="text-[#C8C5BF] text-xs">
          {template.name}
        </div>
      </div>

      {/* ── Área do Canvas ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative p-8"
      >
        {/* Grade de fundo sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG da peça */}
        <div
          ref={svgContainerRef}
          className="w-full h-full max-w-[480px] max-h-[680px] relative z-10"
          style={{ cursor: selectedTool === 'select' ? 'default' : 'crosshair' }}
        />

        {/* Dica de interação */}
        {!selectedZone && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[#C8C5BF] text-xs pointer-events-none tracking-wide">
            Clique em uma zona para editar
          </div>
        )}
      </div>
    </div>
  )
}
