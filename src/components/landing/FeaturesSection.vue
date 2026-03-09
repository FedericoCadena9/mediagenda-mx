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
          <span
            v-if="feature.ai"
            class="absolute right-4 top-4 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600"
          >
            Con IA
          </span>

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
