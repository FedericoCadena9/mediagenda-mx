<script setup>
const screenshots = [
  {
    title: 'Dashboard Hoy',
    subtitle: 'Tus citas de hoy y métricas clave de un vistazo',
    gradient: 'from-cyan-950/40 to-[#0f0f14]',
  },
  {
    title: 'Calendario',
    subtitle: 'Vista de semana y mes con todas tus citas',
    gradient: 'from-sky-950/40 to-[#0f0f14]',
  },
  {
    title: 'Página Pública',
    subtitle: 'Tus pacientes agendan desde su celular',
    gradient: 'from-teal-950/40 to-[#0f0f14]',
  },
  {
    title: 'Notas Clínicas IA',
    subtitle: 'Genera notas SOAP con inteligencia artificial',
    gradient: 'from-violet-950/40 to-[#0f0f14]',
  },
  {
    title: 'Mensajes IA',
    subtitle: 'Recordatorios personalizados automáticos',
    gradient: 'from-purple-950/40 to-[#0f0f14]',
  },
  {
    title: 'Analítica',
    subtitle: 'Reportes de ingresos, servicios y no-shows',
    gradient: 'from-emerald-950/40 to-[#0f0f14]',
  },
]
</script>

<template>
  <section class="bg-[#09090b] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-4 text-xs tracking-[0.2em] uppercase text-zinc-500">
          Producto
        </p>
        <h2 class="text-3xl font-bold text-zinc-50 sm:text-4xl">
          Así se ve por dentro
        </h2>
      </div>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(shot, i) in screenshots"
          :key="i"
          class="overflow-hidden rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] transition-colors duration-300 hover:border-[#2a2a3e]"
        >
          <!-- Gradient placeholder -->
          <div
            :class="`bg-gradient-to-b ${shot.gradient}`"
            class="flex h-48 items-center justify-center"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="h-3 w-24 rounded-full bg-white/5"></div>
              <div class="h-2 w-16 rounded-full bg-white/[0.03]"></div>
              <div class="mt-2 h-12 w-32 rounded-lg bg-white/[0.03]"></div>
            </div>
          </div>

          <!-- Caption -->
          <div class="p-4">
            <p class="text-sm font-medium text-zinc-200">{{ shot.title }}</p>
            <p class="mt-0.5 text-xs text-zinc-500">{{ shot.subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <a
          href="/demo"
          class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-opacity duration-200 hover:opacity-90"
        >
          Ver demo en vivo &rarr;
        </a>
      </div>
    </div>
  </section>
</template>
