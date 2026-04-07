export const JERSEY_SHORT_ZONES = [
  { zone_name: 'corpo_frontal',    label: 'Corpo Frontal' },
  { zone_name: 'corpo_traseiro',   label: 'Corpo Traseiro' },
  { zone_name: 'manga_esquerda',   label: 'Manga Esquerda' },
  { zone_name: 'manga_direita',    label: 'Manga Direita' },
  { zone_name: 'gola',             label: 'Gola' },
  { zone_name: 'faixa_ziper',      label: 'Faixa do Zíper' },
  { zone_name: 'laterais',         label: 'Laterais' },
  { zone_name: 'bolsos_traseiros', label: 'Bolsos Traseiros' },
]

/**
 * Jersey manga curta — visão frontal
 * viewBox 0 0 460 560
 * Centro: x=230
 *
 * Zonas:
 *  - corpo_frontal : painel central (inclui yoke/ombros) com V-neck
 *  - laterais      : painéis laterais finos
 *  - manga_esquerda / manga_direita : mangas curtas com cuff arredondado
 *  - gola          : faixa da gola (preenchendo o V)
 *  - faixa_ziper   : strip central do zíper
 */
export const JERSEY_SHORT_SVG_FRONT = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 560" id="jersey-short-front">
  <defs>
    <filter id="jersey-drop-shadow" x="-10%" y="-6%" width="120%" height="118%">
      <feDropShadow dx="0" dy="5" stdDeviation="14" flood-color="rgba(0,0,0,0.09)"/>
    </filter>
    <linearGradient id="body-shine" x1="0.25" y1="0" x2="0.75" y2="1">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.20)"/>
      <stop offset="60%"  stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.04)"/>
    </linearGradient>
    <linearGradient id="sleeve-shine-l" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.16)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.04)"/>
    </linearGradient>
    <linearGradient id="sleeve-shine-r" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.16)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.04)"/>
    </linearGradient>
  </defs>

  <g filter="url(#jersey-drop-shadow)">

    <!-- ── Manga Esquerda ─────────────────────────────────────────── -->
    <path
      id="zona_manga_esquerda"
      data-zone="manga_esquerda"
      d="M 145 98
         C 118 93 78 107 50 138
         C 31 157 26 182 32 204
         C 35 217 46 227 59 230
         C 74 233 97 228 108 218
         C 112 208 111 170 108 130
         C 120 110 134 100 145 98 Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />
    <!-- Brilho manga esquerda -->
    <path
      d="M 145 98
         C 118 93 78 107 50 138
         C 31 157 26 182 32 204
         C 35 217 46 227 59 230
         C 74 233 97 228 108 218
         C 112 208 111 170 108 130
         C 120 110 134 100 145 98 Z"
      fill="url(#sleeve-shine-l)"
      pointer-events="none"
    />

    <!-- ── Manga Direita ───────────────────────────────────────────── -->
    <path
      id="zona_manga_direita"
      data-zone="manga_direita"
      d="M 315 98
         C 342 93 382 107 410 138
         C 429 157 434 182 428 204
         C 425 217 414 227 401 230
         C 386 233 363 228 352 218
         C 348 208 349 170 352 130
         C 340 110 326 100 315 98 Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />
    <!-- Brilho manga direita -->
    <path
      d="M 315 98
         C 342 93 382 107 410 138
         C 429 157 434 182 428 204
         C 425 217 414 227 401 230
         C 386 233 363 228 352 218
         C 348 208 349 170 352 130
         C 340 110 326 100 315 98 Z"
      fill="url(#sleeve-shine-r)"
      pointer-events="none"
    />

    <!-- ── Lateral Esquerda ────────────────────────────────────────── -->
    <path
      id="zona_laterais"
      data-zone="laterais"
      d="M 108 130
         L 145 98
         L 145 522
         Q 130 540 112 534
         L 108 510 Z"
      fill="#D8D5CE"
      class="zone-interactive"
    />

    <!-- ── Lateral Direita ─────────────────────────────────────────── -->
    <path
      id="zona_laterais_direita"
      data-zone="laterais"
      d="M 352 130
         L 315 98
         L 315 522
         Q 330 540 348 534
         L 352 510 Z"
      fill="#D8D5CE"
      class="zone-interactive"
    />

    <!-- ── Corpo Frontal (inclui ombros/yoke + V-neck) ───────────── -->
    <path
      id="zona_corpo_frontal"
      data-zone="corpo_frontal"
      d="M 195 80
         C 173 86 155 92 145 98
         L 145 522
         Q 145 542 230 548
         Q 315 542 315 522
         L 315 98
         C 305 92 287 86 265 80
         L 230 150
         Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />
    <!-- Brilho corpo -->
    <path
      d="M 195 80
         C 173 86 155 92 145 98
         L 145 522
         Q 145 542 230 548
         Q 315 542 315 522
         L 315 98
         C 305 92 287 86 265 80
         L 230 150 Z"
      fill="url(#body-shine)"
      pointer-events="none"
    />

    <!-- ── Gola (V-neck collar band) ──────────────────────────────── -->
    <path
      id="zona_gola"
      data-zone="gola"
      d="M 195 80
         C 208 66 219 58 230 58
         C 241 58 252 66 265 80
         L 230 150 Z"
      fill="#CBC8C0"
      class="zone-interactive"
    />

    <!-- ── Faixa do Zíper ─────────────────────────────────────────── -->
    <rect
      id="zona_faixa_ziper"
      data-zone="faixa_ziper"
      x="223" y="150" width="14" height="196"
      rx="7"
      fill="#B8B4AC"
      class="zone-interactive"
    />

    <!-- ── Contorno geral ─────────────────────────────────────────── -->
    <path
      d="M 195 80
         C 208 66 219 58 230 58
         C 241 58 252 66 265 80
         C 287 86 305 92 315 98
         C 342 93 382 107 410 138
         C 429 157 434 182 428 204
         C 425 217 414 227 401 230
         C 386 233 363 228 352 218
         C 348 208 349 170 352 130
         L 315 98
         L 315 522
         Q 315 542 230 548
         Q 145 542 145 522
         L 145 98
         L 108 130
         C 111 170 112 208 108 218
         C 97 228 74 233 59 230
         C 46 227 35 217 32 204
         C 26 182 31 157 50 138
         C 78 107 118 93 145 98
         C 155 92 173 86 195 80
         L 230 150
         L 265 80"
      fill="none"
      stroke="rgba(0,0,0,0.09)"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Costura central (decorativa) -->
    <line
      x1="230" y1="154" x2="230" y2="522"
      stroke="rgba(0,0,0,0.05)"
      stroke-width="1"
      stroke-dasharray="5,5"
    />

    <!-- Costuras laterais (decorativas) -->
    <line x1="145" y1="98" x2="145" y2="522" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
    <line x1="315" y1="98" x2="315" y2="522" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>

  </g>
</svg>
`

/**
 * Jersey manga curta — visão traseira
 * Mesma geometria, sem V-neck e sem zíper.
 * Gola crew-neck (traseira é mais alta/larga).
 * Bolsos traseiros na borda inferior.
 */
export const JERSEY_SHORT_SVG_BACK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 560" id="jersey-short-back">
  <defs>
    <filter id="jersey-drop-shadow-back" x="-10%" y="-6%" width="120%" height="118%">
      <feDropShadow dx="0" dy="5" stdDeviation="14" flood-color="rgba(0,0,0,0.09)"/>
    </filter>
    <linearGradient id="body-shine-back" x1="0.25" y1="0" x2="0.75" y2="1">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.20)"/>
      <stop offset="60%"  stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.04)"/>
    </linearGradient>
  </defs>

  <g filter="url(#jersey-drop-shadow-back)">

    <!-- ── Manga Esquerda (traseira) ──────────────────────────────── -->
    <path
      id="zona_manga_esquerda_back"
      data-zone="manga_esquerda"
      d="M 145 98
         C 118 93 78 107 50 138
         C 31 157 26 182 32 204
         C 35 217 46 227 59 230
         C 74 233 97 228 108 218
         C 112 208 111 170 108 130
         C 120 110 134 100 145 98 Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />

    <!-- ── Manga Direita (traseira) ───────────────────────────────── -->
    <path
      id="zona_manga_direita_back"
      data-zone="manga_direita"
      d="M 315 98
         C 342 93 382 107 410 138
         C 429 157 434 182 428 204
         C 425 217 414 227 401 230
         C 386 233 363 228 352 218
         C 348 208 349 170 352 130
         C 340 110 326 100 315 98 Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />

    <!-- ── Lateral Esquerda (traseira) ────────────────────────────── -->
    <path
      id="zona_laterais_back_l"
      data-zone="laterais"
      d="M 108 130
         L 145 98
         L 145 522
         Q 130 540 112 534
         L 108 510 Z"
      fill="#D8D5CE"
      class="zone-interactive"
    />

    <!-- ── Lateral Direita (traseira) ─────────────────────────────── -->
    <path
      id="zona_laterais_back_r"
      data-zone="laterais"
      d="M 352 130
         L 315 98
         L 315 522
         Q 330 540 348 534
         L 352 510 Z"
      fill="#D8D5CE"
      class="zone-interactive"
    />

    <!-- ── Corpo Traseiro ─────────────────────────────────────────── -->
    <path
      id="zona_corpo_traseiro"
      data-zone="corpo_traseiro"
      d="M 195 80
         C 173 86 155 92 145 98
         L 145 460
         L 315 460
         L 315 98
         C 305 92 287 86 265 80
         C 252 66 241 58 230 58
         C 219 58 208 66 195 80 Z"
      fill="#E4E2DC"
      class="zone-interactive"
    />
    <!-- Brilho corpo traseiro -->
    <path
      d="M 195 80
         C 173 86 155 92 145 98
         L 145 460 L 315 460 L 315 98
         C 305 92 287 86 265 80
         C 252 66 241 58 230 58
         C 219 58 208 66 195 80 Z"
      fill="url(#body-shine-back)"
      pointer-events="none"
    />

    <!-- ── Área dos bolsos traseiros (fundo) ──────────────────────── -->
    <path
      id="zona_bolsos_traseiros"
      data-zone="bolsos_traseiros"
      d="M 145 460
         L 315 460
         L 315 522
         Q 315 542 230 548
         Q 145 542 145 522 Z"
      fill="#CCCAC3"
      class="zone-interactive"
    />

    <!-- Divisores dos 3 bolsos -->
    <line
      x1="196" y1="462" x2="196" y2="530"
      stroke="rgba(0,0,0,0.08)" stroke-width="1.5" stroke-linecap="round"
    />
    <line
      x1="264" y1="462" x2="264" y2="530"
      stroke="rgba(0,0,0,0.08)" stroke-width="1.5" stroke-linecap="round"
    />
    <!-- Abertura dos bolsos (borda superior) -->
    <line
      x1="148" y1="462" x2="312" y2="462"
      stroke="rgba(0,0,0,0.10)" stroke-width="1.5" stroke-linecap="round"
    />

    <!-- ── Gola traseira (crew-neck) ──────────────────────────────── -->
    <path
      id="zona_gola_back"
      data-zone="gola"
      d="M 195 80
         C 208 92 220 98 230 98
         C 240 98 252 92 265 80
         C 252 66 241 58 230 58
         C 219 58 208 66 195 80 Z"
      fill="#CBC8C0"
      class="zone-interactive"
    />

    <!-- ── Contorno geral (traseiro) ──────────────────────────────── -->
    <path
      d="M 195 80
         C 208 66 219 58 230 58
         C 241 58 252 66 265 80
         C 287 86 305 92 315 98
         C 342 93 382 107 410 138
         C 429 157 434 182 428 204
         C 425 217 414 227 401 230
         C 386 233 363 228 352 218
         C 348 208 349 170 352 130
         L 315 98
         L 315 522
         Q 315 542 230 548
         Q 145 542 145 522
         L 145 98
         L 108 130
         C 111 170 112 208 108 218
         C 97 228 74 233 59 230
         C 46 227 35 217 32 204
         C 26 182 31 157 50 138
         C 78 107 118 93 145 98
         C 155 92 173 86 195 80
         C 208 92 220 98 230 98
         C 240 98 252 92 265 80"
      fill="none"
      stroke="rgba(0,0,0,0.09)"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Costuras laterais -->
    <line x1="145" y1="98" x2="145" y2="522" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
    <line x1="315" y1="98" x2="315" y2="522" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>

  </g>
</svg>
`
