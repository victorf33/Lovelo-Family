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

  // Resolve o SVG correto
  const getSVGContent = useCallback(() => {
    // Em produção, buscar o SVG do template via URL
    // Por ora, usa os templates inline
    if (template.type === 'jersey_short') {
      return side === 'frente' ? JERSEY_SHORT_SVG_FRONT : JERSEY_SHORT_SVG_BACK
    }
    return JERSEY_SHORT_SVG_FRONT // fallback
  }, [template.type, side])

  // Injeta o SVG e configura os listeners de zona
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    container.innerHTML = getSVGContent()

    const svg = container.querySelector('svg')
    if (!svg) return

    // Coleta todos os elementos com data-zone
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

    // Listeners de interação
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

      // Remove estados anteriores
      svgEl.style.filter = ''
      svgEl.style.opacity = ''
      svgEl.style.strokeWidth = ''
      svgEl.style.stroke = ''

      if (zoneName === selectedZone) {
        svgEl.style.filter = 'brightness(1.3)'
        svgEl.style.stroke = 'rgba(255,255,255,0.5)'
        svgEl.style.strokeWidth = '2'
      } else if (zoneName === hoveredZone && !selectedZone) {
        svgEl.style.filter = 'brightness(1.15)'
        svgEl.style.opacity = '0.9'
      }
    })
  }, [selectedZone, hoveredZone])

  // Renderiza elementos gráficos sobrepostos ao SVG
  const renderOverlayElements = () => {
    // Elementos de texto e logos são renderizados como HTML sobreposto
    // Em uma implementação completa, seriam renderizados dentro do próprio SVG
    return null
  }

  return (
    <div className="flex flex-col h-full bg-[#0E0E0E]">
      {/* ── Barra de controle do canvas ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-md p-0.5">
          {(['frente', 'costas'] as ViewSide[]).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`px-3 py-1 text-xs rounded transition-colors capitalize ${
                side === s ? 'bg-[#2B2B2B] text-white' : 'text-[#555555] hover:text-white'
              }`}
            >
              {s === 'frente' ? 'Frente' : 'Costas'}
            </button>
          ))}
        </div>

        {selectedZone && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: getZoneColor(config, selectedZone) }}
            />
            <span className="text-[#888888] text-xs capitalize">
              {selectedZone.replace(/_/g, ' ')}
            </span>
            <button
              onClick={() => selectZone(null)}
              className="text-[#444444] hover:text-white text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="text-[#333333] text-xs">
          {template.name}
        </div>
      </div>

      {/* ── Área do Canvas ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative p-8"
      >
        {/* SVG da peça */}
        <div
          ref={svgContainerRef}
          className="w-full h-full max-w-[500px] max-h-[680px] relative"
          style={{ cursor: selectedTool === 'select' ? 'default' : 'crosshair' }}
        />

        {/* Overlay de elementos, logos, textos */}
        {renderOverlayElements()}

        {/* Dica de interação */}
        {!selectedZone && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#333333] text-xs pointer-events-none">
            Clique em uma zona para editar
          </div>
        )}
      </div>
    </div>
  )
}
