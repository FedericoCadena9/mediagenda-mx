<script setup>
const features = [
  {
    emoji: '📅',
    title: 'Página pública de citas',
    description: 'Tus pacientes agendan 24/7 desde su celular',
    ai: false,
    iconBg: 'bg-cyan-950/60',
  },
  {
    emoji: '📊',
    title: 'Agenda inteligente',
    description: 'Ve tus citas del día, semana y mes en un solo lugar',
    ai: false,
    iconBg: 'bg-cyan-950/60',
  },
  {
    emoji: '👥',
    title: 'Directorio de pacientes',
    description: 'Historial completo de cada paciente a un clic',
    ai: false,
    iconBg: 'bg-cyan-950/60',
  },
  {
    emoji: '🧠',
    title: 'Notas clínicas con IA',
    description: 'Escribe notas rápidas, la IA genera tu nota SOAP',
    ai: true,
    iconBg: 'bg-violet-950/60',
  },
  {
    emoji: '💬',
    title: 'Mensajes inteligentes',
    description: 'La IA redacta recordatorios personalizados',
    ai: true,
    iconBg: 'bg-violet-950/60',
  },
  {
    emoji: '📈',
    title: 'Analítica',
    description: 'Conoce servicios más pedidos, ingresos y no-shows',
    ai: false,
    iconBg: 'bg-cyan-950/60',
  },
]
</script>

<template>
  <section class="bg-[#0a0a0f] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-4 text-xs tracking-[0.2em] uppercase text-zinc-500">
          Funcionalidades
        </p>
        <h2 class="text-3xl font-bold text-zinc-50 sm:text-4xl">
          Todo lo que necesita tu consultorio
        </h2>
      </div>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in features"
          :key="i"
          :class="[
            feature.ai
              ? 'border-violet-500/20 bg-gradient-to-b from-violet-500/5 to-transparent'
              : 'border-[#1a1a2e]',
          ]"
          class="group relative rounded-2xl border bg-[#0f0f14] p-6 transition-colors duration-300 hover:border-[#2a2a3e]"
        >
          <!-- AI Badge -->
          <span
            v-if="feature.ai"
            class="absolute right-4 top-4 rounded-full border border-violet-500/30 bg-violet-500/20 px-2.5 py-0.5 text-xs text-violet-300"
          >
            Con IA
          </span>

          <!-- Icon -->
          <div
            :class="feature.iconBg"
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          >
            {{ feature.emoji }}
          </div>

          <h3 class="text-base font-semibold text-zinc-100">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-zinc-500">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
