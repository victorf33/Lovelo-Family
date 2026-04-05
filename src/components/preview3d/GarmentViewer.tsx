/**
 * GarmentViewer — Preview 3D simulado via CSS 3D Transforms
 *
 * Funciona sem Three.js. Aplica as cores das zonas em painéis
 * CSS que simulam um objeto 3D rotacionável.
 *
 * Para integrar Three.js / React Three Fiber em produção:
 * 1. npm install three @react-three/fiber @react-three/drei
 * 2. Substituir este componente pelo GarmentViewer3D (arquivo separado)
 */

import { useRef, useState, useEffect } from 'react'
import { useEditorStore, getZoneColor } from '@/stores/editorStore'
import type { GarmentTemplate } from '@/types'
import { RotateCcw } from 'lucide-react'

interface Props {
  template: GarmentTemplate
}

export default function GarmentViewer({ template }: Props) {
  const { config } = useEditorStore()
  const [rotateY, setRotateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startRotY, setStartRotY] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Auto-rotação suave
  useEffect(() => {
    if (!autoRotate || isDragging) return

    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current
        setRotateY((prev) => (prev + delta * 0.03) % 360)
      }
      lastTimeRef.current = time
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = 0
    }
  }, [autoRotate, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    setStartX(e.clientX)
    setStartRotY(rotateY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startX
    setRotateY(startRotY + delta * 0.7)
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleReset = () => {
    setRotateY(0)
    setAutoRotate(true)
  }

  // Cores das zonas
  const corpoFrontal  = getZoneColor(config, 'corpo_frontal')
  const corpoTraseiro = getZoneColor(config, 'corpo_traseiro')
  const mangaEsq      = getZoneColor(config, 'manga_esquerda')
  const mangaDir      = getZoneColor(config, 'manga_direita')
  const gola          = getZoneColor(config, 'gola')
  const lateral       = getZoneColor(config, 'laterais')

  // Detecta se é frente ou costas com base na rotação
  const norm = ((rotateY % 360) + 360) % 360
  const mostrandoFrente = norm < 90 || norm > 270

  return (
    <div className="h-full bg-[#080808] flex flex-col select-none">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#1A1A1A] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#555555] text-xs tracking-widest uppercase">Preview 3D</span>
          <span className="text-[#2B2B2B] text-[10px]">·</span>
          <span className="text-[#333333] text-[10px]">
            {mostrandoFrente ? 'Frente' : 'Costas'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#2B2B2B] text-[10px] hidden sm:block">← arraste →</span>
          <button
            onClick={handleReset}
            className="text-[#444444] hover:text-white transition-colors p-1"
            title="Resetar rotação"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Área de preview */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Cena 3D CSS */}
        <div
          style={{
            perspective: '800px',
            perspectiveOrigin: '50% 40%',
          }}
        >
          <div
            style={{
              transform: `rotateY(${rotateY}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : undefined,
              position: 'relative',
              width: '180px',
              height: '240px',
            }}
          >
            {/* ── FRENTE ───────────────────────────────────────────────── */}
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '240px',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(16px)',
              }}
            >
              {/* Corpo frontal */}
              <div style={{
                position: 'absolute',
                top: '40px', left: '30px',
                width: '120px', height: '200px',
                backgroundColor: corpoFrontal,
                borderRadius: '4px 4px 8px 8px',
                boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.3), inset 8px 0 16px rgba(255,255,255,0.04)',
              }} />

              {/* Laterais */}
              <div style={{ position: 'absolute', top: '40px', left: '22px', width: '10px', height: '200px', backgroundColor: lateral, borderRadius: '4px 0 0 8px' }} />
              <div style={{ position: 'absolute', top: '40px', right: '22px', width: '10px', height: '200px', backgroundColor: lateral, borderRadius: '0 4px 8px 0' }} />

              {/* Manga esquerda */}
              <div style={{
                position: 'absolute',
                top: '38px', left: '0px',
                width: '28px', height: '65px',
                backgroundColor: mangaEsq,
                borderRadius: '8px 0 8px 8px',
                transform: 'rotate(-8deg)',
                transformOrigin: 'top right',
                boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.2)',
              }} />

              {/* Manga direita */}
              <div style={{
                position: 'absolute',
                top: '38px', right: '0px',
                width: '28px', height: '65px',
                backgroundColor: mangaDir,
                borderRadius: '0 8px 8px 8px',
                transform: 'rotate(8deg)',
                transformOrigin: 'top left',
                boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.2)',
              }} />

              {/* Gola */}
              <div style={{
                position: 'absolute',
                top: '30px', left: '60px',
                width: '60px', height: '18px',
                backgroundColor: gola,
                borderRadius: '50%',
              }} />

              {/* Zíper */}
              <div style={{
                position: 'absolute',
                top: '45px', left: '87px',
                width: '6px', height: '120px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: '3px',
              }} />

              {/* Textos do design (se houver) */}
              {config.texts.slice(0, 1).map((text) => (
                <div
                  key={text.id}
                  style={{
                    position: 'absolute',
                    top: '120px', left: '50%',
                    transform: 'translateX(-50%)',
                    color: text.color,
                    fontSize: `${Math.min(text.fontSize * 0.3, 11)}px`,
                    fontFamily: text.fontFamily,
                    fontWeight: text.fontWeight,
                    whiteSpace: 'nowrap',
                    letterSpacing: '2px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                  }}
                >
                  {text.content}
                </div>
              ))}
            </div>

            {/* ── COSTAS ───────────────────────────────────────────────── */}
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '240px',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(16px)',
              }}
            >
              {/* Corpo traseiro */}
              <div style={{
                position: 'absolute',
                top: '40px', left: '30px',
                width: '120px', height: '200px',
                backgroundColor: corpoTraseiro,
                borderRadius: '4px 4px 8px 8px',
                boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.3), inset 8px 0 16px rgba(255,255,255,0.04)',
              }} />

              {/* Laterais costas */}
              <div style={{ position: 'absolute', top: '40px', left: '22px', width: '10px', height: '200px', backgroundColor: lateral, borderRadius: '4px 0 0 8px' }} />
              <div style={{ position: 'absolute', top: '40px', right: '22px', width: '10px', height: '200px', backgroundColor: lateral, borderRadius: '0 4px 8px 0' }} />

              {/* Mangas costas */}
              <div style={{ position: 'absolute', top: '38px', left: '0px', width: '28px', height: '65px', backgroundColor: mangaDir, borderRadius: '8px 0 8px 8px', transform: 'rotate(-8deg)', transformOrigin: 'top right' }} />
              <div style={{ position: 'absolute', top: '38px', right: '0px', width: '28px', height: '65px', backgroundColor: mangaEsq, borderRadius: '0 8px 8px 8px', transform: 'rotate(8deg)', transformOrigin: 'top left' }} />

              {/* Gola costas */}
              <div style={{ position: 'absolute', top: '30px', left: '60px', width: '60px', height: '14px', backgroundColor: gola, borderRadius: '0 0 50% 50%' }} />

              {/* Bolsos traseiros */}
              <div style={{
                position: 'absolute',
                bottom: '8px', left: '34px',
                width: '112px', height: '32px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '0 0 6px 6px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }} />

              {/* Textos no costas */}
              {config.texts.slice(0, 2).map((text) => (
                <div
                  key={text.id}
                  style={{
                    position: 'absolute',
                    top: '100px', left: '50%',
                    transform: 'translateX(-50%)',
                    color: text.color,
                    fontSize: `${Math.min(text.fontSize * 0.35, 13)}px`,
                    fontFamily: text.fontFamily,
                    fontWeight: text.fontWeight,
                    whiteSpace: 'nowrap',
                    letterSpacing: '3px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                  }}
                >
                  {text.content}
                </div>
              ))}
            </div>

            {/* ── LATERAL ESQUERDA (depth) ───────────────────────────── */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '22px',
                width: '32px',
                height: '200px',
                backgroundColor: lateral,
                transform: 'rotateY(-90deg) translateZ(0px)',
                transformOrigin: 'left center',
                backfaceVisibility: 'hidden',
                filter: 'brightness(0.7)',
              }}
            />

            {/* ── LATERAL DIREITA (depth) ────────────────────────────── */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '22px',
                width: '32px',
                height: '200px',
                backgroundColor: lateral,
                transform: 'rotateY(90deg) translateZ(0px)',
                transformOrigin: 'right center',
                backfaceVisibility: 'hidden',
                filter: 'brightness(0.7)',
              }}
            />
          </div>
        </div>

        {/* Sombra projetada */}
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '20px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Rodapé */}
      <div className="px-4 py-2 border-t border-[#111111] shrink-0 flex items-center justify-between">
        <span className="text-[#2B2B2B] text-[10px]">{template.name}</span>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-[10px] transition-colors ${autoRotate ? 'text-[#555555]' : 'text-[#333333]'}`}
        >
          {autoRotate ? '⏸ pausar' : '▶ girar'}
        </button>
      </div>
    </div>
  )
}
