/**
 * Template SVG da Camisa de Ciclismo Manga Curta
 *
 * Coordenadas para um viewBox de 800 x 900.
 * Cada zona é um elemento SVG com id e data-zone.
 *
 * Atenção: Em produção, substitua este SVG por arte técnica
 * criada por um designer em Illustrator/Inkscape.
 */

export const JERSEY_SHORT_ZONES = [
  { zone_name: 'corpo_frontal',   label: 'Corpo Frontal' },
  { zone_name: 'corpo_traseiro',  label: 'Corpo Traseiro' },
  { zone_name: 'manga_esquerda',  label: 'Manga Esquerda' },
  { zone_name: 'manga_direita',   label: 'Manga Direita' },
  { zone_name: 'gola',            label: 'Gola' },
  { zone_name: 'faixa_ziper',     label: 'Faixa do Zíper' },
  { zone_name: 'laterais',        label: 'Laterais' },
  { zone_name: 'bolsos_traseiros', label: 'Bolsos Traseiros' },
]

/**
 * SVG inline da camisa manga curta — visão frontal achatada.
 *
 * Estrutura:
 * - corpo_frontal: painel principal da frente
 * - manga_esquerda / manga_direita: mangas
 * - gola: gola no topo
 * - faixa_ziper: faixa central do zíper
 * - laterais: painéis laterais
 */
export const JERSEY_SHORT_SVG_FRONT = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" id="jersey-short-front">
  <!-- Sombra geral -->
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
    <clipPath id="jersey-clip">
      <path d="M 200 80 C 200 80 280 60 400 60 C 520 60 600 80 600 80
               L 680 140 L 640 200 L 580 160
               L 580 820 L 220 820 L 220 160
               L 160 200 L 120 140 Z"/>
    </clipPath>
  </defs>

  <!-- Grupo principal com filtro de sombra -->
  <g filter="url(#shadow)">

    <!-- ── Corpo Frontal (painel central) ───────────────────────── -->
    <path
      id="zona_corpo_frontal"
      data-zone="corpo_frontal"
      d="M 260 160 L 540 160 L 540 820 L 260 820 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- ── Laterais ──────────────────────────────────────────────── -->
    <path
      id="zona_laterais"
      data-zone="laterais"
      d="M 220 160 L 260 160 L 260 820 L 220 820 Z
         M 540 160 L 580 160 L 580 820 L 540 820 Z"
      fill="#111111"
      class="zone-interactive"
    />

    <!-- ── Manga Esquerda ─────────────────────────────────────────── -->
    <path
      id="zona_manga_esquerda"
      data-zone="manga_esquerda"
      d="M 160 200 L 220 160 L 220 320 L 160 310 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- ── Manga Direita ──────────────────────────────────────────── -->
    <path
      id="zona_manga_direita"
      data-zone="manga_direita"
      d="M 640 200 L 580 160 L 580 320 L 640 310 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- ── Ombro / Conexão mangas ─────────────────────────────────── -->
    <path
      id="zona_ombros"
      data-zone="corpo_frontal"
      d="M 200 80 C 200 80 280 60 400 60 C 520 60 600 80 600 80
         L 640 200 L 580 160 L 540 160 L 260 160 L 220 160 L 160 200 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- ── Gola ──────────────────────────────────────────────────── -->
    <ellipse
      id="zona_gola"
      data-zone="gola"
      cx="400" cy="80" rx="80" ry="28"
      fill="#1A1A1A"
      class="zone-interactive"
    />

    <!-- ── Faixa do Zíper ──────────────────────────────────────────── -->
    <rect
      id="zona_faixa_ziper"
      data-zone="faixa_ziper"
      x="388" y="90" width="24" height="480"
      rx="4"
      fill="#222222"
      class="zone-interactive"
    />

    <!-- ── Bordas e costuras (decorativas, não editáveis) ──────────── -->
    <path
      d="M 200 80 C 200 80 280 60 400 60 C 520 60 600 80 600 80
         L 680 140 L 640 200 L 580 160
         L 580 820 L 220 820 L 220 160
         L 160 200 L 120 140 Z"
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      stroke-width="1.5"
    />

    <!-- Costura central vertical -->
    <line x1="400" y1="90" x2="400" y2="820" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,4"/>
  </g>
</svg>
`

export const JERSEY_SHORT_SVG_BACK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" id="jersey-short-back">
  <defs>
    <filter id="shadow-back" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>

  <g filter="url(#shadow-back)">
    <!-- ── Corpo Traseiro ─────────────────────────────────────────── -->
    <path
      id="zona_corpo_traseiro"
      data-zone="corpo_traseiro"
      d="M 260 160 L 540 160 L 540 780 L 260 780 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- ── Laterais ──────────────────────────────────────────────── -->
    <path
      id="zona_laterais_back"
      data-zone="laterais"
      d="M 220 160 L 260 160 L 260 780 L 220 780 Z
         M 540 160 L 580 160 L 580 780 L 540 780 Z"
      fill="#111111"
      class="zone-interactive"
    />

    <!-- ── Bolsos Traseiros ───────────────────────────────────────── -->
    <path
      id="zona_bolsos_traseiros"
      data-zone="bolsos_traseiros"
      d="M 270 700 L 530 700 L 530 780 L 270 780 Z"
      fill="#161616"
      class="zone-interactive"
    />
    <!-- Divisores dos bolsos -->
    <line x1="356" y1="700" x2="356" y2="780" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <line x1="444" y1="700" x2="444" y2="780" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

    <!-- ── Mangas Traseiras ────────────────────────────────────────── -->
    <path
      id="zona_manga_esquerda_back"
      data-zone="manga_esquerda"
      d="M 160 200 L 220 160 L 220 320 L 160 310 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />
    <path
      id="zona_manga_direita_back"
      data-zone="manga_direita"
      d="M 640 200 L 580 160 L 580 320 L 640 310 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- Ombros traseiros -->
    <path
      data-zone="corpo_traseiro"
      d="M 200 80 C 200 80 280 60 400 60 C 520 60 600 80 600 80
         L 640 200 L 580 160 L 540 160 L 260 160 L 220 160 L 160 200 Z"
      fill="#0B0B0B"
      class="zone-interactive"
    />

    <!-- Gola traseira -->
    <path
      id="zona_gola_back"
      data-zone="gola"
      d="M 340 75 C 340 55 460 55 460 75 C 460 95 340 95 340 75"
      fill="#1A1A1A"
      class="zone-interactive"
    />

    <!-- Contorno -->
    <path
      d="M 200 80 C 200 80 280 60 400 60 C 520 60 600 80 600 80
         L 680 140 L 640 200 L 580 160
         L 580 820 L 220 820 L 220 160
         L 160 200 L 120 140 Z"
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      stroke-width="1.5"
    />
  </g>
</svg>
`
