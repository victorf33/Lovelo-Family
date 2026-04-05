import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// UUID v4 simples sem dependência externa
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
import type {
  EditorState,
  EditorTool,
  DesignConfig,
  DesignElement,
  LogoElement,
  TextElement,
  ElementType,
} from '@/types'
import { emptyDesignConfig } from '@/types'

interface EditorActions {
  // Inicialização
  initEditor: (designId: string, name: string, templateId: string, config?: DesignConfig) => void
  setDesignName: (name: string) => void

  // Seleção
  selectZone: (zoneName: string | null) => void
  hoverZone: (zoneName: string | null) => void
  selectTool: (tool: EditorTool) => void
  selectElement: (elementId: string | null) => void

  // Cores base das zonas
  setZoneColor: (zoneName: string, color: string) => void

  // Elementos gráficos
  addElement: (type: ElementType, zone: string, color: string) => void
  updateElement: (id: string, changes: Partial<DesignElement>) => void
  removeElement: (id: string) => void

  // Logos
  addLogo: (logo: Omit<LogoElement, 'id'>) => void
  updateLogo: (id: string, changes: Partial<LogoElement>) => void
  removeLogo: (id: string) => void

  // Textos
  addText: (zone: string) => void
  updateText: (id: string, changes: Partial<TextElement>) => void
  removeText: (id: string) => void

  // Modo de visualização
  setViewMode: (mode: EditorState['viewMode']) => void

  // Estado de salvamento
  markSaved: () => void
  setIsSaving: (isSaving: boolean) => void

  // Reset
  resetEditor: () => void
}

type EditorStore = EditorState & EditorActions

const DEFAULT_ZONE_COLOR = '#0B0B0B'

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    // ─── Estado inicial ──────────────────────────────────────────────────────
    designId: null,
    designName: 'Novo Design',
    templateId: null,
    selectedZone: null,
    hoveredZone: null,
    selectedTool: 'select',
    selectedElementId: null,
    config: emptyDesignConfig(),
    isDirty: false,
    isSaving: false,
    viewMode: 'split',

    // ─── Inicialização ───────────────────────────────────────────────────────
    initEditor: (designId, name, templateId, config) => {
      set({
        designId,
        designName: name,
        templateId,
        config: config ?? emptyDesignConfig(),
        isDirty: false,
        selectedZone: null,
        selectedTool: 'select',
      })
    },

    setDesignName: (name) => set({ designName: name, isDirty: true }),

    // ─── Seleção ─────────────────────────────────────────────────────────────
    selectZone: (zoneName) => set({ selectedZone: zoneName }),
    hoverZone: (zoneName) => set({ hoveredZone: zoneName }),
    selectTool: (tool) => set({ selectedTool: tool, selectedZone: null }),
    selectElement: (elementId) => set({ selectedElementId: elementId }),

    // ─── Cores ───────────────────────────────────────────────────────────────
    setZoneColor: (zoneName, color) => {
      const config = { ...get().config }
      config.baseColors = { ...config.baseColors, [zoneName]: color }
      set({ config, isDirty: true })
    },

    // ─── Elementos ───────────────────────────────────────────────────────────
    addElement: (type, zone, color) => {
      const newElement: DesignElement = {
        id: uuidv4(),
        type,
        zone,
        color,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
      }
      const config = { ...get().config }
      config.elements = [...config.elements, newElement]
      set({ config, isDirty: true, selectedElementId: newElement.id })
    },

    updateElement: (id, changes) => {
      const config = { ...get().config }
      config.elements = config.elements.map((el) =>
        el.id === id ? { ...el, ...changes } : el
      )
      set({ config, isDirty: true })
    },

    removeElement: (id) => {
      const config = { ...get().config }
      config.elements = config.elements.filter((el) => el.id !== id)
      set({ config, isDirty: true, selectedElementId: null })
    },

    // ─── Logos ───────────────────────────────────────────────────────────────
    addLogo: (logo) => {
      const newLogo: LogoElement = { ...logo, id: uuidv4() }
      const config = { ...get().config }
      config.logos = [...config.logos, newLogo]
      set({ config, isDirty: true })
    },

    updateLogo: (id, changes) => {
      const config = { ...get().config }
      config.logos = config.logos.map((l) => (l.id === id ? { ...l, ...changes } : l))
      set({ config, isDirty: true })
    },

    removeLogo: (id) => {
      const config = { ...get().config }
      config.logos = config.logos.filter((l) => l.id !== id)
      set({ config, isDirty: true })
    },

    // ─── Textos ───────────────────────────────────────────────────────────────
    addText: (zone) => {
      const newText: TextElement = {
        id: uuidv4(),
        content: 'LOVELO',
        zone,
        x: 50,
        y: 50,
        fontSize: 24,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        align: 'center',
        fontWeight: 'bold',
        letterSpacing: 4,
      }
      const config = { ...get().config }
      config.texts = [...config.texts, newText]
      set({ config, isDirty: true, selectedElementId: newText.id })
    },

    updateText: (id, changes) => {
      const config = { ...get().config }
      config.texts = config.texts.map((t) => (t.id === id ? { ...t, ...changes } : t))
      set({ config, isDirty: true })
    },

    removeText: (id) => {
      const config = { ...get().config }
      config.texts = config.texts.filter((t) => t.id !== id)
      set({ config, isDirty: true, selectedElementId: null })
    },

    // ─── View Mode ────────────────────────────────────────────────────────────
    setViewMode: (viewMode) => set({ viewMode }),

    // ─── Salvamento ──────────────────────────────────────────────────────────
    markSaved: () => set({ isDirty: false }),
    setIsSaving: (isSaving) => set({ isSaving }),

    // ─── Reset ────────────────────────────────────────────────────────────────
    resetEditor: () =>
      set({
        designId: null,
        designName: 'Novo Design',
        templateId: null,
        selectedZone: null,
        hoveredZone: null,
        selectedTool: 'select',
        selectedElementId: null,
        config: emptyDesignConfig(),
        isDirty: false,
        isSaving: false,
        viewMode: 'split',
      }),
  }))
)

// ─── Seletor de cor da zona ────────────────────────────────────────────────────
export const getZoneColor = (config: DesignConfig, zoneName: string): string =>
  config.baseColors[zoneName] ?? DEFAULT_ZONE_COLOR
