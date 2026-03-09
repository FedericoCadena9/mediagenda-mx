# Landing Page Redesign — Light Mode "App-First" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the landing page from dark mode to light mode with medical blue (#CAF4FD) color system, restructure layout as "App-First" with sticky header, screenshots grid, and demo categories.

**Architecture:** Update CSS variables in main.css to use medical color scale. Rewrite each landing section component to use light mode classes. Add new DemoCategoriesSection component. Update dashboard shell (sidebar, header) to light theme.

**Tech Stack:** Vue 3, Tailwind CSS 4, shadcn-vue, Lucide Vue Next

---

### Task 1: Update Color System in main.css

**Files:**
- Modify: `src/assets/styles/main.css`

**Step 1: Update body defaults and CSS variables**

Replace the entire `main.css` with light mode as default. Remove `.dark` variant. Update CSS custom properties to use the medical color scale:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #F8FAFB;
  color: #0A3040;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  /* Medical color scale */
  --color-medical-50: #EAFBFE;
  --color-medical-100: #CAF4FD;
  --color-medical-200: #9AEBFB;
  --color-medical-300: #5EDCF6;
  --color-medical-400: #2BC8ED;
  --color-medical-500: #0CADD4;
  --color-medical-600: #088BB2;
  --color-medical-700: #076F90;
  --color-medical-800: #095A76;
  --color-medical-900: #0C4A63;
  --color-medical-950: #0A3040;
}

:root {
  --radius: 0.625rem;
  --background: #F8FAFB;
  --foreground: #0A3040;
  --card: #ffffff;
  --card-foreground: #0A3040;
  --popover: #ffffff;
  --popover-foreground: #0A3040;
  --primary: #088BB2;
  --primary-foreground: #ffffff;
  --secondary: #EAFBFE;
  --secondary-foreground: #088BB2;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #EAFBFE;
  --accent-foreground: #076F90;
  --destructive: oklch(0.577 0.245 27.325);
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #088BB2;
  --chart-1: #088BB2;
  --chart-2: #0CADD4;
  --chart-3: #7C3AED;
  --chart-4: #059669;
  --chart-5: #D97706;
  --sidebar: #ffffff;
  --sidebar-foreground: #0A3040;
  --sidebar-primary: #088BB2;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #EAFBFE;
  --sidebar-accent-foreground: #088BB2;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #088BB2;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 2: Verify the app compiles**

Run: `npm run dev` — verify no CSS errors and the page loads.

**Step 3: Commit**

```bash
git add src/assets/styles/main.css
git commit -m "feat: update color system to medical blue light mode"
```

---

### Task 2: Rewrite ProductPage.vue (Landing Shell + Sticky Header)

**Files:**
- Modify: `src/views/ProductPage.vue`

**Step 1: Rewrite the landing page shell**

Replace `ProductPage.vue` entirely. Key changes:
- Remove dark background (`bg-[#09090b]`), use `bg-[#F8FAFB]`
- Remove grid background overlay
- Remove grain overlay (body::after already removed in CSS)
- Sticky header: white bg + backdrop-blur + border-bottom
- Add nav links: Demo, Funciones, Precios, FAQ
- Update logo colors to medical-600 + medical-950
- Primary CTA: `bg-[#088BB2] text-white hover:bg-[#076F90]`
- Secondary CTA: `bg-[#EAFBFE] text-[#088BB2] border border-[#9AEBFB]`
- Remove `ScreenshotsSection` import (will be replaced by new section)
- Add new `DemoCategoriesSection` import
- Section order: Hero, DemoCategories, Features, HowItWorks, Pricing, FAQ, CTA, Footer
- Remove ProblemSection (merged into hero subtitle)

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import DemoCategoriesSection from '@/components/landing/DemoCategoriesSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import HowItWorksSection from '@/components/landing/HowItWorksSection.vue'
import PricingSection from '@/components/landing/PricingSection.vue'
import FAQSection from '@/components/landing/FAQSection.vue'
import CTASection from '@/components/landing/CTASection.vue'
import FooterSection from '@/components/landing/FooterSection.vue'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="relative min-h-screen bg-[#F8FAFB]">
    <!-- Sticky Header -->
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      :class="[
        scrolled
          ? 'border-b border-[#e2e8f0] bg-white/80 backdrop-blur-xl shadow-sm'
          : 'bg-white/60 backdrop-blur-sm'
      ]"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-1">
          <span class="text-lg font-extrabold text-[#088BB2]">Medi</span>
          <span class="text-lg font-extrabold text-[#0A3040]">Agenda</span>
        </div>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-6 md:flex">
          <a href="#demo-sections" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Demo</a>
          <a href="#funciones" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Funciones</a>
          <a href="#precios" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Precios</a>
          <a href="#faq" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">FAQ</a>
        </nav>

        <!-- CTA buttons -->
        <div class="flex items-center gap-3">
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden rounded-lg border border-[#9AEBFB] bg-[#EAFBFE] px-4 py-2 text-sm font-medium text-[#088BB2] transition-colors hover:bg-[#CAF4FD] sm:inline-flex"
          >
            Contactar
          </a>
          <a
            href="/demo"
            class="rounded-lg bg-[#088BB2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#076F90]"
          >
            Ver demo
          </a>
          <!-- Mobile hamburger -->
          <button
            class="ml-1 inline-flex items-center justify-center rounded-lg p-2 text-[#475569] hover:bg-[#EAFBFE] md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="border-t border-[#e2e8f0] bg-white px-4 py-4 md:hidden">
        <nav class="flex flex-col gap-3">
          <a href="#demo-sections" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Demo</a>
          <a href="#funciones" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Funciones</a>
          <a href="#precios" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Precios</a>
          <a href="#faq" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">FAQ</a>
          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-[#088BB2]">Contactar</a>
        </nav>
      </div>
    </header>

    <!-- Sections -->
    <main>
      <HeroSection />
      <DemoCategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>

    <FooterSection />

    <!-- Floating WhatsApp Button -->
    <a
      :href="waLink"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-1"
      aria-label="Contactar por WhatsApp"
    >
      <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.52-1.474A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.8-6.32-2.144l-.44-.348-2.914.95.975-2.86-.37-.467A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  </div>
</template>
```

**Step 2: Verify it renders**

Run dev server and check the landing page loads with new header.

**Step 3: Commit**

```bash
git add src/views/ProductPage.vue
git commit -m "feat: rewrite landing page shell with light mode sticky header"
```

---

### Task 3: Rewrite HeroSection.vue

**Files:**
- Modify: `src/components/landing/HeroSection.vue`

**Step 1: Rewrite hero for light mode**

Key changes:
- Remove gradient orbs (violet/cyan)
- Light background with subtle medical-50 gradient
- Badge: medical-100 bg, medical-600 text
- Heading: medical-950 color
- Subtitle: slate-500
- Primary CTA: medical-600 bg
- Secondary CTA: outline with medical-200 border
- Remove browser mockup entirely

```vue
<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
    <!-- Subtle gradient bg -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAFBFE]/50 to-transparent"></div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center text-center">
        <!-- Pill badge -->
        <div class="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EAFBFE] px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-[#088BB2]">
          <span>Para medicos en Mexico</span>
          <span class="h-1 w-1 rounded-full bg-[#9AEBFB]"></span>
          <span>7 secciones de demo</span>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold tracking-tight text-[#0A3040] leading-[1.1] sm:text-6xl lg:text-7xl">
          Tu consultorio en<br>piloto automatico
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#64748b]">
          Tus pacientes agendan solos. Tu solo llegas a consultar. Con inteligencia artificial que te ayuda a dar mejor atencion.
        </p>

        <!-- Buttons -->
        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/demo"
            class="rounded-lg bg-[#088BB2] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#088BB2]/25 transition-all duration-200 hover:bg-[#076F90] hover:shadow-xl hover:shadow-[#088BB2]/30"
          >
            Ver demo en vivo
          </a>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-[#9AEBFB] bg-[#EAFBFE] px-8 py-3.5 text-base font-medium text-[#088BB2] transition-all duration-200 hover:bg-[#CAF4FD]"
          >
            Contactanos
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify hero renders correctly**

**Step 3: Commit**

```bash
git add src/components/landing/HeroSection.vue
git commit -m "feat: rewrite hero section for light mode"
```

---

### Task 4: Create DemoCategoriesSection.vue

**Files:**
- Create: `src/components/landing/DemoCategoriesSection.vue`

**Step 1: Create the demo categories component**

This replaces ScreenshotsSection + ProblemSection with a clean grid of 7 demo pages.

```vue
<script setup>
import { Calendar, LayoutDashboard, ClipboardList, Users, Brain, MessageSquare, BarChart3 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    icon: LayoutDashboard,
    title: 'Hoy',
    description: 'Dashboard con citas del dia y metricas clave',
    to: '/demo/dashboard',
    ai: false,
  },
  {
    icon: Calendar,
    title: 'Calendario',
    description: 'Vista semanal y mensual de todas tus citas',
    to: '/demo/dashboard/calendario',
    ai: false,
  },
  {
    icon: ClipboardList,
    title: 'Citas',
    description: 'Gestiona, confirma y da seguimiento a cada cita',
    to: '/demo/dashboard/citas',
    ai: false,
  },
  {
    icon: Users,
    title: 'Pacientes',
    description: 'Directorio completo con historial de cada paciente',
    to: '/demo/dashboard/pacientes',
    ai: false,
  },
  {
    icon: Brain,
    title: 'Notas Clinicas',
    description: 'Genera notas SOAP automaticamente con IA',
    to: '/demo/dashboard/notas',
    ai: true,
  },
  {
    icon: MessageSquare,
    title: 'Mensajes',
    description: 'Recordatorios personalizados escritos por IA',
    to: '/demo/dashboard/mensajes',
    ai: true,
  },
  {
    icon: BarChart3,
    title: 'Analitica',
    description: 'Reportes de ingresos, servicios y no-shows',
    to: '/demo/dashboard/analytics',
    ai: false,
  },
]
</script>

<template>
  <section id="demo-sections" class="py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Producto</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Explora el demo completo
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-base text-[#64748b]">
          7 secciones interactivas para que veas todo lo que incluye tu consultorio digital
        </p>
      </div>

      <!-- Categories grid -->
      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <router-link
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          class="group relative rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all duration-200 hover:border-[#9AEBFB] hover:bg-[#EAFBFE]/50 hover:shadow-md hover:-translate-y-0.5"
        >
          <!-- AI badge -->
          <Badge
            v-if="cat.ai"
            class="absolute right-4 top-4 border-violet-200 bg-violet-50 text-violet-600 text-[10px]"
          >
            IA
          </Badge>

          <!-- Icon -->
          <div
            :class="cat.ai ? 'bg-violet-50 text-violet-600' : 'bg-[#EAFBFE] text-[#088BB2]'"
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          >
            <component :is="cat.icon" class="h-5 w-5" />
          </div>

          <h3 class="text-sm font-semibold text-[#0A3040]">{{ cat.title }}</h3>
          <p class="mt-1 text-xs text-[#64748b] leading-relaxed">{{ cat.description }}</p>
        </router-link>
      </div>

      <!-- CTA -->
      <div class="mt-10 text-center">
        <a
          href="/demo"
          class="inline-flex items-center gap-2 rounded-lg bg-[#088BB2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#076F90]"
        >
          Entrar al demo completo
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify the section renders in the landing page**

**Step 3: Commit**

```bash
git add src/components/landing/DemoCategoriesSection.vue
git commit -m "feat: add demo categories section with 7 interactive pages"
```

---

### Task 5: Rewrite FeaturesSection.vue

**Files:**
- Modify: `src/components/landing/FeaturesSection.vue`

**Step 1: Convert to light mode with Lucide icons**

Key changes:
- Replace emojis with Lucide icons
- White cards with border, light backgrounds
- Medical color palette for icons
- Violet accents for AI features

```vue
<script setup>
import { Calendar, LayoutDashboard, Users, Brain, MessageSquare, BarChart3 } from 'lucide-vue-next'

const features = [
  {
    icon: Calendar,
    title: 'Pagina publica de citas',
    description: 'Tus pacientes agendan 24/7 desde su celular',
    ai: false,
  },
  {
    icon: LayoutDashboard,
    title: 'Agenda inteligente',
    description: 'Ve tus citas del dia, semana y mes en un solo lugar',
    ai: false,
  },
  {
    icon: Users,
    title: 'Directorio de pacientes',
    description: 'Historial completo de cada paciente a un clic',
    ai: false,
  },
  {
    icon: Brain,
    title: 'Notas clinicas con IA',
    description: 'Escribe notas rapidas, la IA genera tu nota SOAP',
    ai: true,
  },
  {
    icon: MessageSquare,
    title: 'Mensajes inteligentes',
    description: 'La IA redacta recordatorios personalizados',
    ai: true,
  },
  {
    icon: BarChart3,
    title: 'Analitica',
    description: 'Conoce servicios mas pedidos, ingresos y no-shows',
    ai: false,
  },
]
</script>

<template>
  <section id="funciones" class="bg-white py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">
          Funcionalidades
        </p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Todo lo que necesita tu consultorio
        </h2>
      </div>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in features"
          :key="i"
          :class="[
            feature.ai
              ? 'border-violet-200 bg-violet-50/30'
              : 'border-[#e2e8f0]',
          ]"
          class="group relative rounded-xl border bg-white p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <!-- AI Badge -->
          <span
            v-if="feature.ai"
            class="absolute right-4 top-4 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600"
          >
            Con IA
          </span>

          <!-- Icon -->
          <div
            :class="feature.ai ? 'bg-violet-50 text-violet-600' : 'bg-[#EAFBFE] text-[#088BB2]'"
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          >
            <component :is="feature.icon" class="h-5 w-5" />
          </div>

          <h3 class="text-base font-semibold text-[#0A3040]">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-[#64748b]">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify features section renders**

**Step 3: Commit**

```bash
git add src/components/landing/FeaturesSection.vue
git commit -m "feat: rewrite features section with Lucide icons and light mode"
```

---

### Task 6: Rewrite HowItWorksSection.vue

**Files:**
- Modify: `src/components/landing/HowItWorksSection.vue`

**Step 1: Convert to light mode**

```vue
<script setup>
import { MessageCircle, Settings, Rocket } from 'lucide-vue-next'

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    color: 'bg-[#EAFBFE] text-[#088BB2]',
    title: 'Nos contactas por WhatsApp',
    description: 'Cuentanos sobre tu consultorio: nombre, servicios, horarios y como quieres tu pagina.',
  },
  {
    number: '02',
    icon: Settings,
    color: 'bg-violet-50 text-violet-600',
    title: 'Configuramos tu pagina con tus datos',
    description: 'Nosotros nos encargamos de todo. En 48-72 horas tienes tu plataforma lista.',
  },
  {
    number: '03',
    icon: Rocket,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Compartes tu link y tus pacientes agendan solos',
    description: 'Envias tu link por WhatsApp, redes o donde quieras. Tus pacientes agendan 24/7.',
  },
]
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">
          Como funciona
        </p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          En 3 pasos estas en linea
        </h2>
      </div>

      <div class="relative mt-14 grid gap-8 sm:grid-cols-3">
        <!-- Dashed connector line (desktop only) -->
        <div
          class="pointer-events-none absolute left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] top-10 hidden border-t border-dashed border-[#9AEBFB] sm:block"
        ></div>

        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative text-center"
        >
          <p class="text-5xl font-bold text-[#EAFBFE]">{{ step.number }}</p>

          <div
            :class="step.color"
            class="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full"
          >
            <component :is="step.icon" class="h-5 w-5" />
          </div>

          <h3 class="mt-5 font-semibold text-[#0A3040]">{{ step.title }}</h3>
          <p class="mt-2 text-sm text-[#64748b]">{{ step.description }}</p>
        </div>
      </div>

      <!-- Callout card -->
      <div class="mt-14 rounded-xl border border-[#e2e8f0] bg-white p-6 text-center">
        <p class="text-[#475569] font-medium">
          Tu no tocas codigo. Nosotros lo hacemos todo.
        </p>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify**

**Step 3: Commit**

```bash
git add src/components/landing/HowItWorksSection.vue
git commit -m "feat: rewrite how-it-works section for light mode"
```

---

### Task 7: Rewrite PricingSection.vue

**Files:**
- Modify: `src/components/landing/PricingSection.vue`

**Step 1: Convert pricing to light mode**

Key changes:
- White cards with borders
- Profesional: border-[#2BC8ED] (medical-400)
- Badge "Recomendado": bg-[#088BB2]
- Checkmarks: medical-500 for basic, violet-500 for pro
- CTA: medical-600 solid for pro, outline for basic

```vue
<script setup>
import { Button } from '@/components/ui/button'

const waBase = 'https://wa.me/5214421234567?text='

const plans = [
  {
    name: 'Basico',
    price: '$2,499',
    highlighted: false,
    features: [
      'Pagina publica de citas',
      'Agenda y calendario',
      'Directorio de pacientes',
      'Recordatorios por WhatsApp',
      'Configuracion personalizada',
    ],
    cta: 'Quiero el plan Basico',
    waMsg: encodeURIComponent('Hola, me interesa el plan Basico de MediAgenda MX'),
  },
  {
    name: 'Profesional',
    price: '$4,999',
    highlighted: true,
    features: [
      'Todo lo del plan Basico',
      'Notas clinicas con IA',
      'Mensajes inteligentes con IA',
      'Analitica y reportes',
      'Resumen de paciente con IA',
    ],
    cta: 'Quiero el plan Profesional',
    waMsg: encodeURIComponent('Hola, me interesa el plan Profesional de MediAgenda MX'),
  },
]
</script>

<template>
  <section id="precios" class="bg-[#EAFBFE]/40 py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <span class="text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Precios</span>
        <h2 class="mt-4 text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Precios accesibles para tu consultorio
        </h2>
      </div>

      <div class="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        <!-- Basico -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-8">
          <p class="text-sm uppercase tracking-wider text-[#64748b]">{{ plans[0].name }}</p>
          <div class="mt-5 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#0A3040]">{{ plans[0].price }}</span>
            <span class="text-[#94a3b8]">MXN</span>
          </div>
          <p class="mt-1 text-sm text-[#94a3b8]">pago unico</p>

          <ul class="mt-8 space-y-4">
            <li
              v-for="(feature, j) in plans[0].features"
              :key="j"
              class="flex items-start gap-3"
            >
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-[#0CADD4]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-[#475569]">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="`${waBase}${plans[0].waMsg}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-lg border border-[#9AEBFB] bg-[#EAFBFE] py-3 text-center text-sm font-medium text-[#088BB2] transition-colors hover:bg-[#CAF4FD]"
          >
            {{ plans[0].cta }}
          </a>
        </div>

        <!-- Profesional (highlighted) -->
        <div class="relative rounded-2xl border-2 border-[#2BC8ED] bg-white p-8 shadow-lg shadow-[#088BB2]/10">
          <!-- Recomendado badge -->
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#088BB2] px-4 py-1 text-xs font-semibold text-white">
            Recomendado
          </span>

          <p class="text-sm uppercase tracking-wider text-[#64748b]">{{ plans[1].name }}</p>
          <div class="mt-5 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#0A3040]">{{ plans[1].price }}</span>
            <span class="text-[#94a3b8]">MXN</span>
          </div>
          <p class="mt-1 text-sm text-[#94a3b8]">pago unico</p>

          <ul class="mt-8 space-y-4">
            <li
              v-for="(feature, j) in plans[1].features"
              :key="j"
              class="flex items-start gap-3"
            >
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-violet-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-[#475569]">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="`${waBase}${plans[1].waMsg}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-lg bg-[#088BB2] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#076F90]"
          >
            {{ plans[1].cta }}
          </a>
        </div>
      </div>

      <!-- Maintenance note -->
      <div class="mx-auto mt-8 max-w-4xl">
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-4 text-center">
          <p class="text-sm text-[#64748b]">
            <span class="font-semibold text-[#0A3040]">Opcional:</span> Mantenimiento mensual
            <span class="font-bold text-[#088BB2]">$499 MXN/mes</span>
            (hosting + soporte + actualizaciones)
          </p>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-[#94a3b8]">
          Un dia de pacientes que no faltan paga tu inversion
        </p>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify pricing renders**

**Step 3: Commit**

```bash
git add src/components/landing/PricingSection.vue
git commit -m "feat: rewrite pricing section for light mode"
```

---

### Task 8: Rewrite FAQSection.vue

**Files:**
- Modify: `src/components/landing/FAQSection.vue`

**Step 1: Convert to light mode**

Key changes:
- White bg, subtle borders
- Medical-colored headings
- Accordion items: white bg, border-[#e2e8f0]

```vue
<script setup>
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Necesito saber de tecnologia?',
    answer: 'No. Nosotros configuramos todo. Tu solo compartes tu link con tus pacientes.',
  },
  {
    question: 'Cuanto tardan en tener mi pagina lista?',
    answer: '48-72 horas despues de recibir tu informacion.',
  },
  {
    question: 'Mis pacientes necesitan descargar una app?',
    answer: 'No. Agendan desde el navegador de su celular, sin instalar nada.',
  },
  {
    question: 'Puedo personalizar los colores y mi informacion?',
    answer: 'Si, todo se adapta a tu consultorio: nombre, servicios, horarios y colores.',
  },
  {
    question: 'Que pasa si necesito ayuda despues?',
    answer: 'Con el plan de mantenimiento mensual tienes soporte por WhatsApp y actualizaciones.',
  },
  {
    question: 'Funciona en celular?',
    answer: 'Si, todo es 100% responsive. Funciona perfecto en cualquier celular.',
  },
]
</script>

<template>
  <section id="faq" class="bg-white py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <span class="text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">FAQ</span>
        <h2 class="mt-4 text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Preguntas frecuentes
        </h2>
      </div>

      <Accordion type="single" collapsible class="mt-14 space-y-3">
        <AccordionItem
          v-for="(faq, i) in faqs"
          :key="i"
          :value="`faq-${i}`"
          class="overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#F8FAFB] mb-3"
        >
          <AccordionTrigger class="px-6 py-5 text-base font-medium text-[#0A3040] hover:text-[#088BB2] hover:no-underline">
            {{ faq.question }}
          </AccordionTrigger>
          <AccordionContent class="px-6 pb-5 text-sm text-[#64748b]">
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>
```

**Step 2: Verify**

**Step 3: Commit**

```bash
git add src/components/landing/FAQSection.vue
git commit -m "feat: rewrite FAQ section for light mode"
```

---

### Task 9: Rewrite CTASection.vue

**Files:**
- Modify: `src/components/landing/CTASection.vue`

**Step 1: Convert to light mode with medical-600 card**

```vue
<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-2xl bg-[#088BB2] px-8 py-16 text-center shadow-xl shadow-[#088BB2]/20 sm:px-16">
        <!-- Subtle pattern -->
        <div class="pointer-events-none absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, #5EDCF6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #076F90 0%, transparent 50%);"></div>

        <div class="relative">
          <h2 class="text-3xl font-bold text-white sm:text-4xl">
            Listo para dejar de agendar por WhatsApp?
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-[#CAF4FD]">
            Unete a los medicos que ya automatizaron su consultorio
          </p>

          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/demo"
              class="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-[#088BB2] transition-colors hover:bg-[#EAFBFE]"
            >
              Ver demo en vivo
            </a>
            <a
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```

**Step 2: Verify**

**Step 3: Commit**

```bash
git add src/components/landing/CTASection.vue
git commit -m "feat: rewrite CTA section for light mode"
```

---

### Task 10: Update FooterSection.vue

**Files:**
- Modify: `src/components/landing/FooterSection.vue`

**Step 1: Update footer to medical-950 dark bg**

```vue
<script setup>
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <footer class="bg-[#0A3040] py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <!-- Wordmark -->
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#088BB2] text-sm font-bold text-white">M</div>
          <span class="text-lg font-bold text-white">MediAgenda MX</span>
        </div>

        <!-- Links -->
        <nav class="flex items-center gap-2">
          <Button as="a" href="/demo" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Demo en vivo
          </Button>
          <Button as="a" href="#precios" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Precios
          </Button>
          <Button as="a" :href="waLink" target="_blank" rel="noopener noreferrer" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Contacto
          </Button>
        </nav>
      </div>

      <Separator class="mt-8 mb-8 bg-[#0C4A63]" />

      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-sm text-[#5EDCF6]/60">Hecho en Queretaro</p>
        <p class="text-sm text-[#5EDCF6]/60">&copy; 2026 MediAgenda MX. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>
```

**Step 2: Verify**

**Step 3: Commit**

```bash
git add src/components/landing/FooterSection.vue
git commit -m "feat: update footer to medical-950 dark theme"
```

---

### Task 11: Update Dashboard — AppSidebar.vue (Light Sidebar)

**Files:**
- Modify: `src/components/layout/AppSidebar.vue`

**Step 1: Convert sidebar to light theme**

Key changes:
- Desktop: `bg-white` + `border-r border-[#e2e8f0]`
- Mobile Sheet: same white bg
- Active nav: `bg-[#EAFBFE] text-[#088BB2]`
- Inactive: `text-[#64748b] hover:bg-[#F8FAFB] hover:text-[#0A3040]`
- IA badges: `bg-violet-50 text-violet-600`
- Brand text: `text-[#0A3040]`
- Separators: `bg-[#e2e8f0]`

Replace the `SheetContent` class: `w-60 bg-white text-[#0A3040] p-0 border-none md:hidden`

Replace desktop aside class: `hidden md:flex sticky top-0 left-0 z-50 h-screen bg-white border-r border-[#e2e8f0] text-[#0A3040] flex-col transition-all duration-300 ease-in-out`

Active button: `bg-[#EAFBFE] text-[#088BB2] hover:bg-[#EAFBFE] hover:text-[#088BB2]`
Inactive button: `text-[#64748b] hover:bg-[#F8FAFB] hover:text-[#0A3040]`

Badge: `bg-violet-50 text-violet-600 border-none`

Separator: `bg-[#e2e8f0]`

Brand border: `border-b border-[#e2e8f0]`

Footer text: `text-[#94a3b8]`

**Step 2: Verify sidebar renders correctly in dashboard**

**Step 3: Commit**

```bash
git add src/components/layout/AppSidebar.vue
git commit -m "feat: convert sidebar to light theme with medical colors"
```

---

### Task 12: Update Dashboard — AppShell.vue + AppHeader.vue

**Files:**
- Modify: `src/components/layout/AppShell.vue`
- Modify: `src/components/layout/AppHeader.vue`

**Step 1: Update AppShell demo banner**

Change demo banner from `bg-violet-600` to `bg-[#088BB2]`:
```html
<div class="bg-[#088BB2] text-white text-center py-2 text-sm">
```

**Step 2: Update AppHeader brand colors**

The header is already white (`bg-white shadow-sm`). Just update the brand:
```html
<span class="text-lg font-bold tracking-tight">
  <span class="text-[#088BB2]">Medi</span><span class="text-[#0A3040]">Agenda</span> <span class="text-[#0A3040]">MX</span>
</span>
```

Update "Ver pagina publica" link from `text-cyan-600 hover:text-cyan-700` to `text-[#088BB2] hover:text-[#076F90]`.

**Step 3: Verify dashboard loads correctly**

**Step 4: Commit**

```bash
git add src/components/layout/AppShell.vue src/components/layout/AppHeader.vue
git commit -m "feat: update dashboard shell and header to medical theme"
```

---

### Task 13: Clean up unused files

**Files:**
- Delete or keep: `src/components/landing/ProblemSection.vue`
- Delete or keep: `src/components/landing/ScreenshotsSection.vue`
- Delete: `color-preview.html` (temp file)

**Step 1: Remove imports and files no longer used**

ProblemSection and ScreenshotsSection are no longer imported in ProductPage.vue. Delete them:

```bash
rm src/components/landing/ProblemSection.vue
rm src/components/landing/ScreenshotsSection.vue
rm color-preview.html
```

**Step 2: Verify no broken imports**

Run: `npm run dev` — verify no errors.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused landing sections and temp files"
```

---

### Task 14: Final visual review and polish

**Step 1: Run dev server and review all pages**

```bash
npm run dev
```

Check:
- [ ] Landing page loads in light mode
- [ ] Sticky header works (scroll behavior, backdrop blur)
- [ ] Mobile menu opens/closes
- [ ] Hero section: badge, title, CTAs render correctly
- [ ] Demo categories: all 7 cards link to correct routes
- [ ] Features: Lucide icons render, AI badges show
- [ ] How it works: 3 steps with connector line
- [ ] Pricing: 2 cards, Recomendado badge, WhatsApp links
- [ ] FAQ: accordion opens/closes
- [ ] CTA: medical-600 card with white text
- [ ] Footer: dark bg with medical-950
- [ ] Dashboard sidebar: white bg, active states
- [ ] Dashboard header: updated brand colors
- [ ] WhatsApp floating button still works
- [ ] Responsive: check mobile, tablet, desktop

**Step 2: Fix any visual issues found**

**Step 3: Final commit if needed**
