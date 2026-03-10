# MediAgenda MX

**Sistema de Gestión para Consultorios Médicos**

Plataforma integral diseñada para médicos independientes en México. Tus pacientes agendan por WhatsApp y el sistema captura cada cita automáticamente en tu dashboard con calendario, directorio de pacientes y analítica en tiempo real.

## Características

- **Agendamiento por WhatsApp** — Tus pacientes agendan 24/7 por WhatsApp. El sistema captura la cita automáticamente y la guarda en tu agenda.
- **Agenda inteligente** — Ve tus citas del día, semana y mes en un solo lugar. Confirma, cancela o reagenda con un clic.
- **Directorio de pacientes** — Historial completo de cada paciente: citas previas, notas clínicas y datos de contacto.
- **Notas clínicas con IA** — Escribe notas rápidas y la IA genera tu nota SOAP completa (Subjetivo, Objetivo, Evaluación, Plan).
- **Mensajes inteligentes con IA** — La IA redacta recordatorios y seguimientos personalizados que se envían por WhatsApp.
- **Analítica y reportes** — Conoce tus servicios más pedidos, ingresos estimados y tasa de no-shows con insights de IA.

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | Vue 3 + Vite |
| Routing | Vue Router 4 |
| Estado | Pinia |
| Estilos | TailwindCSS + shadcn-vue |
| Calendario | FullCalendar |
| IA | Google Gemini API (`gemini-2.0-flash`) |
| Gráficas | Chart.js + vue-chartjs |
| Deploy | Vercel (SPA estático) |

## Estructura

```
/                              → Product Page (landing de venta)
/demo                          → Demo Login
/demo/dr/carlos-mendoza        → Página pública de citas (vista paciente)
/demo/dashboard                → Dashboard — Hoy
/demo/dashboard/calendario     → Calendario semanal
/demo/dashboard/citas          → Listado de citas
/demo/dashboard/pacientes      → Directorio de pacientes
/demo/dashboard/pacientes/:id  → Detalle de paciente
/demo/dashboard/notas          → Notas Clínicas IA
/demo/dashboard/mensajes       → Mensajes IA
/demo/dashboard/analytics      → Analítica
```

## Setup

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Agregar tu VITE_GEMINI_API_KEY en .env

# Desarrollo
npm run dev

# Build
npm run build
```

## Variables de entorno

```env
VITE_GEMINI_API_KEY=   # Google Gemini API key (requerida para funciones de IA)
```

## Modelo de negocio

| Plan | Precio | Incluye |
|------|--------|---------|
| Básico | $2,499 MXN (pago único) | Agendamiento por WhatsApp + agenda del doctor + configuración inicial |
| Profesional | $4,999 MXN (pago único) | Todo lo Básico + notas clínicas IA + mensajes IA + analítica |
| Mantenimiento | $499 MXN/mes (opcional) | Hosting, actualizaciones, soporte por WhatsApp |

## Mercado objetivo

Médicos generales y especialistas independientes en Querétaro y ciudades medianas de México que actualmente agendan citas por WhatsApp manualmente.

---

Hecho en Querétaro, México
