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
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Producto</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Explora el demo completo
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-base text-[#64748b]">
          7 secciones interactivas para que veas todo lo que incluye tu consultorio digital
        </p>
      </div>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <router-link
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          class="group relative rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all duration-200 hover:border-[#9AEBFB] hover:bg-[#EAFBFE]/50 hover:shadow-md hover:-translate-y-0.5"
        >
          <Badge
            v-if="cat.ai"
            class="absolute right-4 top-4 border-violet-200 bg-violet-50 text-violet-600 text-[10px]"
          >
            IA
          </Badge>

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
