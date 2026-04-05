import { useState } from 'react'
import { Download, FileImage, FileText, Code } from 'lucide-react'
import { toPng, toSvg } from 'html-to-image'
import { jsPDF } from 'jspdf'
import type { Design } from '@/types'

interface Props {
  design: Design
}

type ExportStatus = 'idle' | 'exporting' | 'done' | 'error'

export default function ExportPanel({ design }: Props) {
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [activeFormat, setActiveFormat] = useState<string | null>(null)

  const getCanvasElement = () => {
    return document.querySelector('#jersey-short-front')?.closest('div') as HTMLElement | null
  }

  const handleExportPNG = async () => {
    setStatus('exporting')
    setActiveFormat('png')
    try {
      const el = getCanvasElement()
      if (!el) throw new Error('Canvas não encontrado')

      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 3 })
      const link = document.createElement('a')
      link.download = `${design.name.replace(/\s+/g, '-')}-preview.png`
      link.href = dataUrl
      link.click()
      setStatus('done')
    } catch {
      setStatus('error')
    } finally {
      setTimeout(() => { setStatus('idle'); setActiveFormat(null) }, 2000)
    }
  }

  const handleExportPDF = async () => {
    setStatus('exporting')
    setActiveFormat('pdf')
    try {
      const el = getCanvasElement()
      if (!el) throw new Error('Canvas não encontrado')

      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      // Cabeçalho
      pdf.setFillColor(11, 11, 11)
      pdf.rect(0, 0, 210, 297, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.text('LOVELO DESIGN STUDIO', 20, 20)
      pdf.setFontSize(10)
      pdf.setTextColor(136, 136, 136)
      pdf.text(`Design: ${design.name}`, 20, 30)
      pdf.text(`Template: ${design.template?.name ?? '—'}`, 20, 37)
      pdf.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 44)

      // Imagem da peça
      pdf.addImage(dataUrl, 'PNG', 40, 60, 130, 160)

      // Rodapé
      pdf.setFontSize(8)
      pdf.setTextColor(68, 68, 68)
      pdf.text('Lovelo Design Studio — Documento Técnico', 20, 285)

      pdf.save(`${design.name.replace(/\s+/g, '-')}-tecnico.pdf`)
      setStatus('done')
    } catch {
      setStatus('error')
    } finally {
      setTimeout(() => { setStatus('idle'); setActiveFormat(null) }, 2000)
    }
  }

  const handleExportSVG = async () => {
    setStatus('exporting')
    setActiveFormat('svg')
    try {
      const svgEl = document.querySelector('#jersey-short-front') as SVGElement | null
      if (!svgEl) throw new Error('SVG não encontrado')

      const serializer = new XMLSerializer()
      const svgStr = serializer.serializeToString(svgEl)
      const blob = new Blob([svgStr], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${design.name.replace(/\s+/g, '-')}-producao.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      setStatus('done')
    } catch {
      setStatus('error')
    } finally {
      setTimeout(() => { setStatus('idle'); setActiveFormat(null) }, 2000)
    }
  }

  const EXPORTS = [
    {
      id: 'png',
      icon: FileImage,
      label: 'PNG Preview',
      description: 'Imagem de alta resolução para aprovação visual',
      action: handleExportPNG,
    },
    {
      id: 'pdf',
      icon: FileText,
      label: 'PDF Técnico',
      description: 'Documento técnico com especificações da peça',
      action: handleExportPDF,
    },
    {
      id: 'svg',
      icon: Code,
      label: 'SVG Produção',
      description: 'Arquivo vetorial para envio à fábrica',
      action: handleExportSVG,
    },
  ]

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded-lg p-3">
        <p className="text-[#888888] text-xs leading-relaxed">
          Exporte o design atual em diferentes formatos.
          Salve antes de exportar para garantir a versão mais recente.
        </p>
      </div>

      <div className="space-y-2">
        {EXPORTS.map(({ id, icon: Icon, label, description, action }) => {
          const isExporting = status === 'exporting' && activeFormat === id
          const isDone = status === 'done' && activeFormat === id
          const isError = status === 'error' && activeFormat === id

          return (
            <button
              key={id}
              onClick={action}
              disabled={status === 'exporting'}
              className="w-full flex items-center gap-3 bg-[#0E0E0E] hover:bg-[#161616] border border-[#1E1E1E] hover:border-[#2B2B2B] rounded-lg p-3 text-left transition-all disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded border border-[#2B2B2B] flex items-center justify-center shrink-0">
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon size={14} className="text-[#666666]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-medium">{label}</p>
                <p className="text-[#444444] text-[10px] leading-tight">{description}</p>
              </div>
              <div className="shrink-0">
                {isDone && <span className="text-green-400 text-xs">✓</span>}
                {isError && <span className="text-red-400 text-xs">✗</span>}
                {!isDone && !isError && !isExporting && (
                  <Download size={12} className="text-[#444444]" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-2 p-3 border border-[#1E1E1E] rounded-lg">
        <p className="text-[#444444] text-[10px] leading-relaxed">
          ⚠️ O arquivo .AI nativo não está disponível nesta versão.
          Para produção, envie o SVG à fábrica e converta no Illustrator.
        </p>
      </div>
    </div>
  )
}
