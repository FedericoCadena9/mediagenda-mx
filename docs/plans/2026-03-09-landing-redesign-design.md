# Landing Page Redesign — Light Mode "App-First"

## Color System

### Primary Scale ("medical") — base #CAF4FD

| Token | Hex | Usage |
|-------|-----|-------|
| 50 | #EAFBFE | bg sutiles, hover cards |
| 100 | #CAF4FD | surfaces, badges |
| 200 | #9AEBFB | borders, outline buttons |
| 300 | #5EDCF6 | accent light |
| 400 | #2BC8ED | links, icons |
| 500 | #0CADD4 | primary medium |
| 600 | #088BB2 | botones primary, CTA |
| 700 | #076F90 | hover botones |
| 800 | #095A76 | active/pressed |
| 900 | #0C4A63 | text emphasis |
| 950 | #0A3040 | headings, sidebar dark |

### Supporting Colors

- **Accent (IA):** violet-500 → violet-700
- **Background:** #F8FAFB
- **Cards:** white
- **Text:** #0A3040 (headings), #475569 (body), #94a3b8 (muted)
- **Status:** emerald (confirmada), amber (pendiente), red (cancelada)

## Landing Page Sections

### 1. Sticky Header
- White bg + backdrop-blur + border-bottom sutil
- Logo: "MediAgenda" (medical-600 + 950)
- Nav: Demo, Funciones, Precios, FAQ
- CTAs: "Ver Demo" (primary 600) + "Contactar" (outline 200)
- Mobile: hamburger

### 2. Hero
- Background: #F8FAFB con gradiente sutil medical-50
- Badge pill: "Para medicos en Mexico · 7 secciones de demo"
- Titulo: "Tu consultorio en piloto automatico" (950, extrabold)
- Subtitulo en slate-500
- 2 CTAs: primary + outline
- Sin browser mockup

### 3. App Screenshots Grid (nueva)
- Titulo: "Conoce la plataforma"
- Grid 2x2 (desktop) / 1 col (mobile)
- 4 screenshots: Hoy, Calendario, Notas IA, Mensajes IA
- Border-radius 12px, shadow sutil, label + badge IA

### 4. Demo Categories (nueva)
- Titulo: "Explora el demo completo" + "7 secciones interactivas"
- Grid 3 cols (desktop) / 2 (tablet) / 1 (mobile)
- 7 cards: Hoy, Calendario, Citas, Pacientes, Notas IA, Mensajes IA, Analitica
- Icono Lucide + nombre + descripcion + link al demo
- Hover: border medical-200, bg medical-50
- Cards IA con badge violet

### 5. Features (rediseñada)
- Titulo: "Todo lo que necesitas"
- Grid 3x2, cards blancas, borde sutil
- Icono Lucide en circle medical-50 (sin emojis)
- Badge violet para features IA

### 6. Pricing (light mode)
- Fondo: medical-50
- 2 cards blancas: Basico y Profesional
- Profesional: border medical-400, badge "Recomendado" medical-600
- Checkmarks medical-500
- CTA WhatsApp en cada card

### 7. FAQ + CTA Final + Footer
- FAQ: accordion, bordes sutiles, fondo blanco
- CTA: card bg medical-600, texto blanco, boton blanco
- Footer: bg medical-950, texto claro

## Dashboard Changes

- **Sidebar:** fondo blanco, border-right, active = bg medical-50 + text medical-600
- **Header:** blanco + backdrop-blur
- **Main area:** bg #F8FAFB
- Stats/badges/botones: escala medical
- Mantener estructura actual de cada vista

## Decisions

- Sidebar: light (white bg)
- Color approach: escala completa, 600 para primary actions
- Approach: "App-First" — screenshots y demo categories prominentes
