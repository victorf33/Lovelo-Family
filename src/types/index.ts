// ─── Usuário ─────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
}

// ─── Peças (Garment) ─────────────────────────────────────────────────────────
export type GarmentType = 'jersey_short' | 'jersey_long' | 'bib_shorts'

export interface GarmentTemplate {
  id: string
  name: string
  type: GarmentType
  svg_template_url: string
  model_3d_url: string
  zones: GarmentZone[]
}

export interface GarmentZone {
  id: string
  template_id: string
  zone_name: string
  label: string
  metadata: ZoneMetadata
}

export interface ZoneMetadata {
  label: string
  color?: string
  // Região UV para mapeamento 3D (normalizado 0-1)
  uvRegion?: { u1: number; v1: number; u2: number; v2: number }
  // Path SVG do template
  svgPathId?: string
}

// ─── Design ──────────────────────────────────────────────────────────────────
export interface Design {
  id: string
  user_id: string
  template_id: string
  name: string
  created_at: string
  updated_at: string
  template?: GarmentTemplate
  latest_version?: DesignVersion
}

export interface DesignVersion {
  id: string
  design_id: string
  version_number: number
  config_json: DesignConfig
  preview_image_url?: string
  created_at: string
}

// ─── Configuração do Design ───────────────────────────────────────────────────
export interface DesignConfig {
  baseColors: Record<string, string>
  elements: DesignElement[]
  logos: LogoElement[]
  texts: TextElement[]
}

export function emptyDesignConfig(): DesignConfig {
  return {
    baseColors: {},
    elements: [],
    logos: [],
    texts: [],
  }
}

// ─── Elementos Gráficos ───────────────────────────────────────────────────────
export type ElementType =
  | 'faixa_horizontal'
  | 'faixa_diagonal'
  | 'faixa_vertical'
  | 'bloco_central'
  | 'bloco_lateral'
  | 'mangas_contrastantes'
  | 'gola_contrastante'
  | 'linhas_velocidade'
  | 'padrao_geometrico'
  | 'padrao_hexagonal'
  | 'degrade_simples'
  | 'area_patrocinador'
  | 'selo_icone'

export interface ElementDefinition {
  type: ElementType
  label: string
  icon: string
  description: string
}

export const ELEMENT_LIBRARY: ElementDefinition[] = [
  { type: 'faixa_horizontal', label: 'Faixa Horizontal', icon: '▬', description: 'Faixa contrastante horizontal' },
  { type: 'faixa_diagonal', label: 'Faixa Diagonal', icon: '╱', description: 'Faixa contrastante diagonal' },
  { type: 'faixa_vertical', label: 'Faixa Vertical', icon: '▌', description: 'Faixa contrastante vertical' },
  { type: 'bloco_central', label: 'Bloco Central', icon: '◼', description: 'Bloco de cor no centro da peça' },
  { type: 'bloco_lateral', label: 'Bloco Lateral', icon: '▐', description: 'Bloco de cor nas laterais' },
  { type: 'mangas_contrastantes', label: 'Mangas Contrastantes', icon: '◁▷', description: 'Cor diferenciada nas mangas' },
  { type: 'gola_contrastante', label: 'Gola Contrastante', icon: '⌒', description: 'Cor diferenciada na gola' },
  { type: 'linhas_velocidade', label: 'Linhas de Velocidade', icon: '⟹', description: 'Linhas aerodinâmicas' },
  { type: 'padrao_geometrico', label: 'Padrão Geométrico', icon: '◇', description: 'Padrão de formas geométricas' },
  { type: 'padrao_hexagonal', label: 'Padrão Hexagonal', icon: '⬡', description: 'Padrão de hexágonos' },
  { type: 'degrade_simples', label: 'Degradê', icon: '▒', description: 'Gradiente de cor suave' },
  { type: 'area_patrocinador', label: 'Área Patrocinador', icon: '☐', description: 'Espaço reservado para patrocinador' },
  { type: 'selo_icone', label: 'Selo / Ícone', icon: '★', description: 'Elemento decorativo ou ícone' },
]

export interface DesignElement {
  id: string
  type: ElementType
  zone: string
  color: string
  secondaryColor?: string
  scale: number
  x: number
  y: number
  rotation: number
  opacity: number
}

// ─── Logos ────────────────────────────────────────────────────────────────────
export interface LogoElement {
  id: string
  file: string
  file_url: string
  zone: string
  x: number
  y: number
  width: number
  height: number
  opacity: number
}

// ─── Textos ───────────────────────────────────────────────────────────────────
export type TextAlign = 'left' | 'center' | 'right'
export type FontWeight = 'normal' | 'bold'

export const AVAILABLE_FONTS = [
  'Inter',
  'Arial',
  'Bebas Neue',
  'Montserrat',
  'Oswald',
  'Rajdhani',
  'Barlow Condensed',
  'Impact',
]

export interface TextElement {
  id: string
  content: string
  zone: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  align: TextAlign
  fontWeight: FontWeight
  letterSpacing?: number
}

// ─── Assets da Marca ─────────────────────────────────────────────────────────
export interface BrandAsset {
  id: string
  user_id: string
  file_name: string
  file_type: string
  file_url: string
  created_at: string
}

// ─── Estado do Editor ─────────────────────────────────────────────────────────
export type EditorTool = 'select' | 'cor' | 'elementos' | 'logos' | 'texto' | 'exportar'

export interface EditorState {
  designId: string | null
  designName: string
  templateId: string | null
  selectedZone: string | null
  hoveredZone: string | null
  selectedTool: EditorTool
  selectedElementId: string | null
  config: DesignConfig
  isDirty: boolean
  isSaving: boolean
  viewMode: '2d' | '3d' | 'split'
}

// ─── Exportação ───────────────────────────────────────────────────────────────
export type ExportFormat = 'png' | 'pdf' | 'svg'

export interface ExportOptions {
  format: ExportFormat
  scale: number
  includeBackground: boolean
}
