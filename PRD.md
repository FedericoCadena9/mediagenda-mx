# MediAgenda MX — Product Requirements Document

**Version:** 2.0 — Product Page + Live Preview Demo
**Date:** 2026-03-09
**Author:** Product & Engineering
**Status:** Active

---

## 1. Executive Summary

### Problem Statement

Independent doctors in Mexico waste 2–4 hours daily managing appointments through WhatsApp, leading to scheduling conflicts, 20–35% no-show rates, and zero practice analytics. They actively seek solutions in Facebook groups ("¿me podrían diseñar una página para agendar mis citas?") but find no affordable, Mexico-focused product.

### What We're Building

A **single deployable Vue SPA** with two parts:

1. **Product Page** (`/`) — A high-converting landing page that sells MediAgenda MX. Inspired by Framer marketplace template pages: hero, feature showcase, screenshots, pricing, CTA to see the live demo.
2. **Live Preview** (`/demo/*`) — A fully functional interactive demo of the product. Doctors click "Ver demo en vivo" and experience the full platform with mock data and real AI features (Gemini). This is what convinces them to buy.

### Tagline

> "Tu consultorio en piloto automático"

### Business Model

**What's sold:** The complete MediAgenda MX solution — frontend + backend (Supabase) — configured and deployed for the doctor. The doctor gets their own live instance with their own data.

**How it's sold:**
- Post product page link in Facebook groups for doctors (Querétaro, Mexico)
- Share in WhatsApp groups
- Marketplace listings (optional)

**Pricing (accessible for Querétaro market):**

| Plan | Price | What's Included |
|------|-------|-----------------|
| **Básico** | $2,499 MXN pago único | Página pública de citas + agenda del doctor + configuración inicial |
| **Profesional** | $4,999 MXN pago único | Todo lo Básico + notas clínicas IA + mensajes IA + analítica |
| **Mantenimiento** (optional) | $499 MXN/mes | Hosting, actualizaciones, soporte por WhatsApp |

*Context: A doctor in Querétaro charges $400–$700/consultation. One day of no-shows saved pays for the product.*

### Success Criteria

| Criteria | Target |
|----------|--------|
| Product page → "Ver demo" click rate | ≥ 30% |
| Demo → WhatsApp contact conversion | ≥ 10% |
| Demo walkthrough time | 10–15 minutes |
| AI features work on every demo attempt | 100% |
| Page loads fast on Mexican mobile networks | < 3s LCP |

---

## 2. Core Build Rules

| Rule | Detail |
|------|--------|
| **No real auth** | Demo login with prefilled credentials, no validation |
| **No backend** | All demo data in Pinia stores with hardcoded seed data |
| **No external integrations** | No WhatsApp API, no Resend, no n8n. WhatsApp = `wa.me` deep links. Email = success toast |
| **Gemini AI is real** | Google Gemini API (`gemini-2.0-flash`) for all AI features. Key from `.env` |
| **One doctor only** | Dr. Carlos Mendoza hardcoded in demo. No multi-tenancy |
| **Spanish throughout** | All UI, labels, toasts, AI prompts in Mexican Spanish |
| **Single SPA** | Product page and demo live in the same Vue app |

---

## 3. Target Users

### Who Buys (Doctor)

| Attribute | Detail |
|-----------|--------|
| **Profile** | Médico general o especialista independiente, 28–50 años |
| **Location** | Querétaro (primary), ciudades medianas de México |
| **Practice** | 1 consultorio, sin secretaria o con 1 asistente |
| **Tech level** | WhatsApp daily, Instagram, smartphone. No sabe de hosting ni código |
| **Pain** | 2+ hrs/day agendando por WhatsApp, pierde $3,000+ MXN/semana por no-shows |
| **Budget** | $2,500–$5,000 MXN es razonable si ve valor claro |
| **Where they hang out** | Facebook groups ("Médicos de Querétaro", "Consultorios independientes"), WhatsApp groups |

### Who Uses (Patient)

| Attribute | Detail |
|-----------|--------|
| **Profile** | Paciente 20–60 años, Querétaro |
| **Device** | Android phone, mobile-first |
| **Goal** | Agendar cita rápido sin esperar respuesta por WhatsApp |

---

## 4. Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Vue 3 + Vite |
| **Routing** | Vue Router 4 |
| **State** | Pinia (one store per domain) |
| **Styling** | TailwindCSS 3 + shadcn-vue |
| **Calendar** | FullCalendar (@fullcalendar/vue3) |
| **AI** | Google Gemini API via `@google/generative-ai` (`gemini-2.0-flash`) |
| **Charts** | Chart.js via vue-chartjs |
| **Animations** | CSS transitions + + Tailwind + Framer Motion + Vue `<Transition>` |
| **Deployment** | Vercel (static SPA) |
| **Backend** | None (demo) — production uses Supabase |

---

## 5. App Structure & Routes

```
/                              → Product Page (landing de venta)
/demo                          → Demo Login
/demo/dr/carlos-mendoza        → Public Booking Page (patient view)
/demo/dashboard                → Dashboard — Hoy
/demo/dashboard/calendario     → Dashboard — Calendario
/demo/dashboard/citas          → Dashboard — Citas
/demo/dashboard/pacientes      → Dashboard — Pacientes
/demo/dashboard/pacientes/:id  → Dashboard — Detalle de Paciente
/demo/dashboard/notas          → Dashboard — Notas Clínicas IA
/demo/dashboard/mensajes       → Dashboard — Mensajes IA
/demo/dashboard/analytics      → Dashboard — Analítica
```

---

## 6. Feature Specifications

### 6.1 Product Page (`/`) — Landing de Venta

**Priority:** P0

**Description:** High-converting landing page inspired by Framer template product pages. Must feel premium, professional, and trustworthy. This is the first thing a doctor sees when they click the link in Facebook.

#### Section 1: Hero
- [ ] Large headline: "Tu consultorio en piloto automático"
- [ ] Subheadline: "Tus pacientes agendan solos. Tú solo llegas a consultar. Con inteligencia artificial que te ayuda a dar mejor atención."
- [ ] Two CTA buttons:
  - Primary: "Ver demo en vivo →" → navigates to `/demo`
  - Secondary: "Contáctanos por WhatsApp" → `wa.me` link to seller
- [ ] Hero image/mockup: screenshot of the dashboard (placeholder initially, real screenshot later)
- [ ] Trust badge: "Diseñado para médicos en México 🇲🇽"

#### Section 2: Problem Statement
- [ ] Headline: "¿Sigues agendando por WhatsApp?"
- [ ] 3 pain point cards with icons:
  - "Pierdes 2+ horas al día respondiendo mensajes para agendar"
  - "Tus pacientes no llegan y pierdes $3,000+ MXN a la semana"
  - "No tienes historial digital de tus pacientes"
- [ ] Visual: before/after comparison (WhatsApp chaos → MediAgenda clean dashboard)

#### Section 3: Feature Showcase
- [ ] Headline: "Todo lo que necesita tu consultorio"
- [ ] Feature cards (6) with icon, title, short description:
  1. **Página pública de citas** — "Tus pacientes agendan 24/7 desde su celular"
  2. **Agenda inteligente** — "Ve tus citas del día, semana y mes en un solo lugar"
  3. **Directorio de pacientes** — "Historial completo de cada paciente a un clic"
  4. **Notas clínicas con IA** — "Escribe notas rápidas, la IA genera tu nota SOAP"
  5. **Mensajes inteligentes** — "La IA redacta recordatorios personalizados por WhatsApp"
  6. **Analítica** — "Conoce tus servicios más pedidos, ingresos y tasa de no-shows"
- [ ] AI features highlighted with sparkle icon / "Con IA" badge

#### Section 4: Screenshots / Product Preview
- [ ] Headline: "Así se ve por dentro"
- [ ] Carousel or grid of 4–6 screenshots (placeholders initially):
  - Dashboard — Today view
  - Calendar view
  - Public booking page (mobile mockup)
  - Clinical notes AI
  - Messages AI
  - Analytics
- [ ] Each screenshot with a short caption
- [ ] "Ver demo en vivo →" CTA below

#### Section 5: How It Works
- [ ] Headline: "En 3 pasos estás en línea"
- [ ] 3 steps with numbers and icons:
  1. "Nos contactas por WhatsApp" — icon: chat
  2. "Configuramos tu página con tus datos" — icon: settings
  3. "Compartes tu link y tus pacientes agendan solos" — icon: rocket
- [ ] Emphasize: "Tú no tocas código. Nosotros lo hacemos todo."

#### Section 6: Pricing
- [ ] Headline: "Precios accesibles para tu consultorio"
- [ ] Two pricing cards:
  - **Básico** — $2,499 MXN (pago único)
    - ✅ Página pública de citas
    - ✅ Agenda y calendario
    - ✅ Directorio de pacientes
    - ✅ Recordatorios por WhatsApp
    - ✅ Configuración personalizada
    - CTA: "Quiero el plan Básico"
  - **Profesional** — $4,999 MXN (pago único) — badge: "Recomendado"
    - ✅ Todo lo del plan Básico
    - ✅ Notas clínicas con IA
    - ✅ Mensajes inteligentes con IA
    - ✅ Analítica y reportes
    - ✅ Resumen de paciente con IA
    - CTA: "Quiero el plan Profesional"
  - Below both: "Opcional: Mantenimiento mensual $499 MXN/mes (hosting + soporte + actualizaciones)"
- [ ] All CTAs → `wa.me` deep link with prefilled message: "Hola, me interesa el plan {plan} de MediAgenda MX"
- [ ] Trust note: "Un día de pacientes que no faltan paga tu inversión"

#### Section 7: FAQ
- [ ] Headline: "Preguntas frecuentes"
- [ ] Accordion with 5–6 questions:
  - "¿Necesito saber de tecnología?" → "No. Nosotros configuramos todo..."
  - "¿Cuánto tardan en tener mi página lista?" → "48–72 horas..."
  - "¿Mis pacientes necesitan descargar una app?" → "No. Agendan desde el navegador..."
  - "¿Puedo personalizar los colores y mi información?" → "Sí, todo se adapta..."
  - "¿Qué pasa si necesito ayuda después?" → "Plan de mantenimiento mensual..."
  - "¿Funciona en celular?" → "Sí, todo es responsive..."

#### Section 8: CTA Final
- [ ] Headline: "¿Listo para dejar de agendar por WhatsApp?"
- [ ] Subtext: "Únete a los médicos que ya automatizaron su consultorio"
- [ ] Two buttons:
  - "Ver demo en vivo →" → `/demo`
  - "Contactar por WhatsApp →" → `wa.me` link
- [ ] WhatsApp floating button (fixed bottom-right, always visible throughout product page)

#### Section 9: Footer
- [ ] MediAgenda MX logo/wordmark
- [ ] Links: Demo en vivo, Precios, Contacto
- [ ] "Hecho en Querétaro 🇲🇽"
- [ ] Copyright 2026

#### Product Page Design Requirements
- [ ] Mobile-first (doctors will see this on their phone from Facebook)
- [ ] Fast: no heavy images on initial load, lazy-load screenshots
- [ ] Professional: blues/teals/whites, clean typography
- [ ] Trust: feels like a real product, not a freelancer side project
- [ ] Sticky header with "Ver demo" button always accessible
- [ ] Smooth scroll between sections
- [ ] WhatsApp floating button on all sections

---

### 6.2 Demo Login (`/demo`)

**Priority:** P0

**Acceptance Criteria:**
- [ ] Card centered on screen with MediAgenda MX logo
- [ ] Headline: "Demo Interactiva"
- [ ] Email field prefilled: `demo@mediagenda.mx`
- [ ] Password field prefilled: `demo1234`
- [ ] Button: "Entrar al demo"→ sets `isLoggedIn = true` → navigates to `/demo/dashboard`
- [ ] Note: "Esta es una demo interactiva. Los datos son ficticios."
- [ ] Secondary link: "Ver página pública del doctor →" → `/demo/dr/carlos-mendoza`
- [ ] Back link: "← Volver al sitio" → `/`
- [ ] Any credentials accepted (no validation)

---

### 6.3 Public Booking Page (`/demo/dr/carlos-mendoza`)

**Priority:** P0

**Description:** Patient-facing page. No auth required. Demonstrates self-booking flow.

#### Hero Section
- [ ] Doctor placeholder avatar (initials circle or generic medical icon)
- [ ] "Dr. Carlos Mendoza" — name prominent
- [ ] "Médico General" — specialty
- [ ] "Querétaro, Qro." — location with map pin icon
- [ ] Bio: 2–3 sentences
- [ ] Clinic info: "Consultorio Médico Dr. Mendoza — Av. Universidad 150, Col. Centro"

#### Services List
- [ ] Card per service: name, duration badge, price in MXN
  - Consulta General — 30 min — $400 MXN
  - Revisión de Seguimiento — 30 min — $250 MXN
  - Consulta de Urgencia — 30 min — $700 MXN
- [ ] "Agendar" button per card → starts booking flow

#### Booking Widget (5 Steps)
- [ ] **Step 1 — Servicio:** Service selection (pre-selected if clicked from card)
- [ ] **Step 2 — Fecha:** Mini calendar, next 30 days. Mon–Fri available, weekends grayed out
- [ ] **Step 3 — Hora:** Time slots from schedule (9:00–14:00, 16:00–19:00, 30-min intervals). Booked slots disabled
- [ ] **Step 4 — Datos:** nombre (required), teléfono 10 digits (required), email (required), notas (optional, max 300 chars)
- [ ] **Step 5 — Confirmación:** Summary + "Confirmar por WhatsApp" button (`wa.me/5214421234567?text=...`)
- [ ] On submit: creates appointment in Pinia store with status `pendiente`, creates patient if new phone
- [ ] Toast: "¡Cita agendada! Se envió confirmación por correo electrónico"
- [ ] Step indicator (1–5) + back button each step
- [ ] Demo banner at top: "🔍 Estás viendo la demo — [Ver precios](/)" link back to product page

---

### 6.4 Dashboard Layout

**Priority:** P0

#### AppShell
- [ ] Dark sidebar (slate-800) with white icons and labels
- [ ] Sidebar items with icons:
  - Hoy (`/demo/dashboard`)
  - Calendario (`/demo/dashboard/calendario`)
  - Citas (`/demo/dashboard/citas`)
  - Pacientes (`/demo/dashboard/pacientes`)
  - Notas Clínicas IA (`/demo/dashboard/notas`) — sparkle icon, "IA" badge
  - Mensajes IA (`/demo/dashboard/mensajes`) — sparkle icon, "IA" badge
  - Analítica (`/demo/dashboard/analytics`)
- [ ] Header: "MediAgenda MX" brand, doctor name, "Ver página pública" link, "Cerrar sesión"
- [ ] Demo banner across top: "🔍 Estás viendo una demo interactiva — [Ver precios](/)"
- [ ] Mobile: sidebar collapses to hamburger
- [ ] If not "logged in", redirect to `/demo`

---

### 6.5 Dashboard — Hoy (`/demo/dashboard`)

**Priority:** P0

**Acceptance Criteria:**
- [ ] Greeting: "Buenos días/tardes/noches, Dr. Mendoza" (time-based)
- [ ] 4 stat cards: Citas hoy, Confirmadas, Pendientes, Completadas esta semana
- [ ] Today's appointments list sorted by time:
  - Each row: time, patient name, service, status badge, no-show risk badge
  - Quick actions: Confirmar, Iniciar, Completar, Cancelar, No-show (contextual per status)
  - Status transitions:
    - `pendiente` → `confirmada`, `cancelada`
    - `confirmada` → `en_curso`, `cancelada`, `no_show`
    - `en_curso` → `completada`
    - Terminal: `completada`, `cancelada`, `no_show`
- [ ] Updates Pinia store reactively
- [ ] Empty state: "No tienes citas programadas para hoy"
- [ ] No-show risk badges (rule-based):
  - 0 previous no-shows → Bajo (green)
  - 1 no-show → Medio (yellow)
  - 2+ no-shows → Alto (red)
  - First-time patient → Medio (yellow)

---

### 6.6 Dashboard — Calendario (`/demo/dashboard/calendario`)

**Priority:** P0

**Acceptance Criteria:**
- [ ] FullCalendar week view (`@fullcalendar/vue3` + `@fullcalendar/timegrid`)
- [ ] Appointments as colored events by status:
  - `pendiente` → amber, `confirmada` → blue, `en_curso` → cyan, `completada` → green, `cancelada` → gray, `no_show` → red
- [ ] Click event → slide-over panel with details + status change buttons + patient link
- [ ] Week navigation (prev/next/today)
- [ ] Break time 14:00–16:00 shown as gray zone
- [ ] Mobile: day or list view

---

### 6.7 Dashboard — Citas (`/demo/dashboard/citas`)

**Priority:** P0

**Acceptance Criteria:**
- [ ] Table: Fecha, Hora, Paciente, Servicio, Estado, Acciones
- [ ] Filters: status dropdown, date range (esta semana / este mes / últimos 30 días / todos)
- [ ] Search by patient name
- [ ] Status badges as colored pills
- [ ] "Ver detalle" → modal/drawer with full info + status change
- [ ] Pagination or scroll for 41 records

---

### 6.8 Dashboard — Pacientes (`/demo/dashboard/pacientes`)

**Priority:** P0

**Acceptance Criteria:**
- [ ] Table: Nombre, Teléfono, Email, Última cita, Total citas
- [ ] Search by name/phone/email
- [ ] Click → patient detail (`/demo/dashboard/pacientes/:id`)

#### Patient Detail View
- [ ] Info card (name, phone, email)
- [ ] Appointment history list
- [ ] Clinical notes list (SOAP)
- [ ] **"Resumen IA" button:**
  - Calls Gemini with patient history + notes
  - Returns 3-bullet summary in Spanish
  - Loading spinner → fade-in result
  - < 2 visits: "Paciente nuevo, sin historial suficiente"
- [ ] No-show risk badge

---

### 6.9 Dashboard — Notas Clínicas IA (`/demo/dashboard/notas`) — KEY AI FEATURE

**Priority:** P0

**Acceptance Criteria:**
- [ ] Patient selector dropdown
- [ ] Large textarea: "Describe la consulta de hoy en tus palabras..."
- [ ] Example placeholder text
- [ ] Button: "Generar Nota SOAP con IA" (disabled if empty)
- [ ] Gemini system prompt:
  ```
  Eres un asistente médico profesional. El médico te proporciona notas informales
  de una consulta y tú generas una nota clínica estructurada en formato SOAP en
  español mexicano. Sé claro, profesional y conciso.

  Notas del médico: {userInput}

  Genera la nota SOAP con 4 secciones:
  - Subjetivo (S): Lo que el paciente reporta
  - Objetivo (O): Hallazgos del examen físico y signos vitales
  - Evaluación (A): Diagnóstico o diagnósticos diferenciales
  - Plan (P): Tratamiento, medicamentos, seguimiento
  ```
- [ ] Response in styled card with labeled S/O/A/P sections
- [ ] Fade-in animation
- [ ] "Guardar nota" → saves to patient's clinical notes in Pinia
- [ ] Toast: "Nota clínica guardada"
- [ ] "Notas guardadas" section below showing history for selected patient

---

### 6.10 Dashboard — Mensajes IA (`/demo/dashboard/mensajes`) — KEY AI FEATURE

**Priority:** P0

**Acceptance Criteria:**
- [ ] Patient selector dropdown
- [ ] Message type selector:
  - Recordatorio de cita
  - Seguimiento post-consulta
  - Cita no atendida
- [ ] Context auto-populated from patient's recent appointment
- [ ] Button: "Generar mensaje con IA"
- [ ] Gemini system prompt:
  ```
  Eres el asistente de Dr. Carlos Mendoza, médico general en Querétaro.
  Redacta un mensaje de WhatsApp personalizado y profesional en español
  mexicano para el/la paciente {nombre}.

  Tipo: {tipo}
  Servicio: {servicio}
  Fecha: {fecha}
  Historial: {visitas previas}

  Requisitos:
  - Cálido y profesional (usar "usted")
  - Breve (máximo 3 párrafos)
  - Terminar con datos del consultorio: Consultorio Dr. Mendoza,
    Av. Universidad 150, Querétaro. Tel: 442 123 4567
  ```
- [ ] Response in **WhatsApp-style bubble** (green, rounded, chat-like)
- [ ] Buttons: "Abrir en WhatsApp" (`wa.me` link), "Regenerar", "Copiar mensaje"

---

### 6.11 Dashboard — Analítica (`/demo/dashboard/analytics`)

**Priority:** P1

**Acceptance Criteria:**
- [ ] 4 stat cards: Total citas este mes, Tasa de no-shows (%), Servicio más solicitado, Ingresos estimados (MXN)
- [ ] Bar chart: citas por día de la semana (vue-chartjs)
- [ ] Pie/donut chart: distribución de servicios
- [ ] **"Insight IA" card:**
  - Auto-calls Gemini on page load with aggregated stats
  - Returns 2–3 actionable insights
  - Loading skeleton → fade-in
- [ ] All stats from Pinia store (reactive)

---

## 7. AI Integration (Gemini)

### Service Wrapper (`services/gemini.js`)

Single reusable function:
```js
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export async function callGemini(prompt, systemPrompt = '') {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  const result = await model.generateContent(fullPrompt)
  return result.response.text()
}
```

### AI Feature Map

| Feature | Route | Trigger | Output |
|---------|-------|---------|--------|
| SOAP Note | `/demo/dashboard/notas` | Manual button | Structured clinical note |
| Smart Message | `/demo/dashboard/mensajes` | Manual button | WhatsApp-ready message |
| Patient Summary | `/demo/dashboard/pacientes/:id` | Manual button | 3-bullet summary |
| Analytics Insights | `/demo/dashboard/analytics` | Auto on load | 2–3 recommendations |

### Error Handling
- Missing API key: inline warning "Configura tu API key de Gemini en .env"
- API failure: toast "No se pudo conectar con el servicio de IA. Intenta de nuevo."
- Retry button on all AI features

---

## 8. Pinia Stores (Data Layer)

All data is in-memory. Resets on page refresh.

### `stores/auth.js`
```
{ isLoggedIn: false, doctorName: 'Dr. Carlos Mendoza' }
```

### `stores/services.js`
```
services: [{ id, name, description, durationMinutes, priceMxn, isActive, sortOrder }]
```

### `stores/schedule.js`
```
{
  schedule: [{ dayOfWeek, startTime, endTime, isActive }],
  blockedDates: [{ date, reason }],
  slotDuration: 30
}
```

### `stores/patients.js`
```
patients: [{ id, fullName, phone, email, notes, isActive, createdAt }]
clinicalNotes: [{ id, patientId, appointmentId, rawInput, soapS, soapO, soapA, soapP, aiGenerated, createdAt }]
```
Actions: `addPatient`, `getPatientById`, `getPatientNotes`, `addClinicalNote`

### `stores/appointments.js`
```
appointments: [{ id, patientId, serviceId, date, startTime, endTime, status, patientNotes, source, createdAt }]
```
Status enum: `pendiente`, `confirmada`, `en_curso`, `completada`, `cancelada`, `no_show`

Actions: `addAppointment`, `updateStatus`, `getTodayAppointments`, `getAvailableSlots(date)`

Getters: `todayAppointments`, `thisWeekAppointments`, `thisMonthAppointments`, `noShowRate`, `topService`, `estimatedRevenue`

---

## 9. Seed Data

### Doctor
```json
{
  "fullName": "Dr. Carlos Mendoza",
  "slug": "carlos-mendoza",
  "specialty": "Médico General",
  "bio": "Médico General con 8 años de experiencia. Egresado de la UAQ. Especializado en medicina preventiva y enfermedades crónicas.",
  "phone": "4421234567",
  "clinicName": "Consultorio Médico Dr. Mendoza",
  "clinicAddress": "Av. Universidad 150, Col. Centro",
  "clinicCity": "Querétaro",
  "clinicState": "Querétaro"
}
```

### Services: 3 (Consulta General $400, Revisión $250, Urgencia $700) — all 30 min

### Schedule: Mon–Fri, 09:00–14:00 + 16:00–19:00

### Patients: 25 with Mexican names, 10-digit phones, emails (see Appendix)

### Appointments: 41 total
- 8 this week (2 pendiente, 3 confirmada, 1 completada, 1 cancelada, 1 no_show) — relative dates
- 30 historical past 60 days (70% completada, 15% cancelada, 10% no_show, 5% pendiente)
- 3 next week (all pendiente)

### Clinical Notes: 5 patients with SOAP history
- Patient 1 (María): Hipertensión, 2 notes
- Patient 3 (Ana Sofía): Diabetes tipo 2, 1 note
- Patient 5 (Carmen): Infección respiratoria, 1 note
- Patient 8 (Miguel Ángel): Dolor lumbar, 2 notes
- Patient 10 (Fernando): Control embarazo (esposa), 1 note

---

## 10. UI/UX Design

### Color Palette

| Role | Hex | Tailwind |
|------|-----|----------|
| Primary | `#0891B2` | `cyan-600` |
| Primary hover | `#0E7490` | `cyan-700` |
| Sidebar | `#1E293B` | `slate-800` |
| Background | `#F8FAFC` | `slate-50` |
| Surface | `#FFFFFF` | `white` |
| Text | `#0F172A` | `slate-900` |
| Text secondary | `#64748B` | `slate-500` |
| AI accent | `#7C3AED` | `violet-600` |
| Success | `#16A34A` | `green-600` |
| Warning | `#D97706` | `amber-600` |
| Error | `#DC2626` | `red-600` |

### Design Principles
1. Mobile-first (doctors see product page on phone from Facebook)
2. Spanish (MX) throughout, dates DD/MM/YYYY, currency MXN
3. Clean & professional — medical trust
4. AI features feel premium (violet accent, sparkle icons, animations)
5. Product page feels like a real startup, not a freelancer project
6. Demo has subtle "demo banner" so it's clear it's a preview

### Component Styles
- Cards: `bg-white rounded-lg shadow-sm border border-slate-200 p-4`
- AI cards: `bg-violet-50 border-violet-200` + sparkle icon
- WhatsApp bubble: `bg-green-100 rounded-2xl rounded-bl-sm p-4`
- Primary buttons: `bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg`
- AI buttons: `bg-violet-600 hover:bg-violet-700 text-white` + sparkle
- Loading: `bg-slate-200 rounded animate-pulse`

---

## 11. File Structure

```
mediagenda-mx/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── assets/styles/main.css
│   ├── router/index.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── patients.js
│   │   ├── services.js
│   │   └── schedule.js
│   ├── services/
│   │   └── gemini.js
│   ├── composables/
│   │   └── useNoShowRisk.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppHeader.vue
│   │   ├── ui/
│   │   │   ├── StatusBadge.vue
│   │   │   ├── RiskBadge.vue
│   │   │   ├── AIResponseCard.vue
│   │   │   ├── WhatsAppBubble.vue
│   │   │   ├── StatsCard.vue
│   │   │   ├── LoadingSkeleton.vue
│   │   │   └── AppointmentRow.vue
│   │   └── landing/
│   │       ├── HeroSection.vue
│   │       ├── ProblemSection.vue
│   │       ├── FeaturesSection.vue
│   │       ├── ScreenshotsSection.vue
│   │       ├── HowItWorksSection.vue
│   │       ├── PricingSection.vue
│   │       ├── FAQSection.vue
│   │       ├── CTASection.vue
│   │       └── FooterSection.vue
│   └── views/
│       ├── ProductPage.vue
│       ├── DemoLoginView.vue
│       ├── PublicDoctorPage.vue
│       └── dashboard/
│           ├── TodayView.vue
│           ├── CalendarView.vue
│           ├── AppointmentsView.vue
│           ├── PatientsView.vue
│           ├── PatientDetailView.vue
│           ├── ClinicalNotesView.vue
│           ├── MessagesView.vue
│           └── AnalyticsView.vue
```

---

## 12. Build Order

| Step | Task | Dependencies |
|------|------|--------------|
| 1 | Project scaffold (Vite + Vue 3 + Tailwind + shadcn-vue + deps) | None |
| 2 | Router setup (all routes) | Step 1 |
| 3 | Pinia stores with full seed data | Step 1 |
| 4 | Gemini service wrapper | Step 1 |
| 5 | Dashboard layout (AppShell + Sidebar + Header) | Steps 2, 3 |
| 6 | Demo login page | Steps 2, 3 |
| 7 | Public booking page | Steps 2, 3 |
| 8 | Today view | Steps 3, 5 |
| 9 | Appointments table | Steps 3, 5 |
| 10 | Calendar view (FullCalendar) | Steps 3, 5 |
| 11 | Patients directory + detail | Steps 3, 4, 5 |
| 12 | AI: Clinical Notes (SOAP) | Steps 3, 4, 5 |
| 13 | AI: Messages | Steps 3, 4, 5 |
| 14 | Analytics + AI insights | Steps 3, 4, 5 |
| 15 | **Product Page (landing de venta)** | Steps 6–14 (needs screenshots) |
| 16 | Polish: animations, responsive, loading states | All |

---

## 13. Out of Scope (Demo)

| Feature | Reason |
|---------|--------|
| Real auth / Supabase | Demo only |
| Real database | Pinia stores |
| Email sending | Toast only |
| WhatsApp Business API | wa.me deep links |
| Multi-tenancy | Single doctor |
| Data persistence | Resets on refresh |
| Doctor onboarding | Not needed |
| Online payments | Out of scope v1 |
| Voice input | Text only |
| Patient portal | Guests only |

---

## 14. Roadmap

### Current: Demo MVP (This Build)
- Product page (landing de venta) + live preview demo
- Real AI features (Gemini)
- Deployable on Vercel
- Used to sell in Facebook groups

### Next: Production v1 (per customer)
- Supabase backend (auth, DB, RLS, storage)
- Real email (Resend)
- n8n for WhatsApp automation
- Custom doctor data (not Carlos Mendoza)
- Each sale = new Supabase project + deploy

### Future: SaaS v2
- Multi-tenancy (one instance, many doctors)
- Self-service onboarding
- Stripe/Conekta payments
- Admin panel
- Mobile app

---

## Appendix: Patients List (25)

| # | Name | Phone | Email |
|---|------|-------|-------|
| 1 | María García López | 4421001001 | maria.garcia@email.com |
| 2 | Juan Hernández Martínez | 4421001002 | juan.hernandez@email.com |
| 3 | Ana Sofía Rodríguez Pérez | 4421001003 | ana.rodriguez@email.com |
| 4 | Roberto López Sánchez | 4421001004 | roberto.lopez@email.com |
| 5 | Carmen Martínez Rivera | 4421001005 | carmen.martinez@email.com |
| 6 | José Luis Torres Flores | 4421001006 | joseluis.torres@email.com |
| 7 | Patricia Ramírez González | 4421001007 | patricia.ramirez@email.com |
| 8 | Miguel Ángel Flores Díaz | 4421001008 | miguel.flores@email.com |
| 9 | Lucía Morales Vargas | 4421001009 | lucia.morales@email.com |
| 10 | Fernando Díaz Castro | 4421001010 | fernando.diaz@email.com |
| 11 | Gabriela Vargas Mendoza | 4421001011 | gabriela.vargas@email.com |
| 12 | Alejandro Jiménez Ruiz | 4421001012 | alejandro.jimenez@email.com |
| 13 | Laura Sánchez Ortega | 4421001013 | laura.sanchez@email.com |
| 14 | Ricardo Pérez Navarro | 4421001014 | ricardo.perez@email.com |
| 15 | Verónica Castro Luna | 4421001015 | veronica.castro@email.com |
| 16 | Daniel Guzmán Herrera | 4421001016 | daniel.guzman@email.com |
| 17 | Silvia Ortega Campos | 4421001017 | silvia.ortega@email.com |
| 18 | Arturo Navarro Silva | 4421001018 | arturo.navarro@email.com |
| 19 | Isabel Reyes Moreno | 4421001019 | isabel.reyes@email.com |
| 20 | Enrique Herrera Aguilar | 4421001020 | enrique.herrera@email.com |
| 21 | Rosa María Aguilar Vega | 4421001021 | rosa.aguilar@email.com |
| 22 | Óscar Delgado Romero | 4421001022 | oscar.delgado@email.com |
| 23 | Teresa Romero Fuentes | 4421001023 | teresa.romero@email.com |
| 24 | Raúl Fuentes Espinoza | 4421001024 | raul.fuentes@email.com |
| 25 | Adriana Espinoza Cruz | 4421001025 | adriana.espinoza@email.com |

## Appendix: Environment Variables

```env
# .env.example
VITE_GEMINI_API_KEY=           # Google Gemini API key (required for AI features)
```
