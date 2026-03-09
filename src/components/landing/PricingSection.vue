<script setup>
import { Button } from '@/components/ui/button'

const waBase = 'https://wa.me/5214421234567?text='

const plans = [
  {
    name: 'Básico',
    price: '$2,499',
    highlighted: false,
    features: [
      'Página pública de citas',
      'Agenda y calendario',
      'Directorio de pacientes',
      'Recordatorios por WhatsApp',
      'Configuración personalizada',
    ],
    cta: 'Quiero el plan Básico',
    waMsg: encodeURIComponent('Hola, me interesa el plan Básico de MediAgenda MX'),
  },
  {
    name: 'Profesional',
    price: '$4,999',
    highlighted: true,
    features: [
      'Todo lo del plan Básico',
      'Notas clínicas con IA',
      'Mensajes inteligentes con IA',
      'Analítica y reportes',
      'Resumen de paciente con IA',
    ],
    cta: 'Quiero el plan Profesional',
    waMsg: encodeURIComponent('Hola, me interesa el plan Profesional de MediAgenda MX'),
  },
]
</script>

<template>
  <section id="precios" class="bg-[#0a0a0f] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <span class="text-xs tracking-[0.2em] uppercase text-zinc-500">PRECIOS</span>
        <h2 class="mt-4 text-3xl font-bold text-zinc-50 sm:text-4xl">
          Precios accesibles para tu consultorio
        </h2>
      </div>

      <!-- Pricing Cards -->
      <div class="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        <!-- Básico -->
        <div class="rounded-2xl bg-[#0f0f14] border border-[#1a1a2e] p-8">
          <p class="text-sm uppercase tracking-wider text-zinc-400">{{ plans[0].name }}</p>
          <div class="mt-5 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-zinc-50">{{ plans[0].price }}</span>
            <span class="text-zinc-500">MXN</span>
          </div>
          <p class="mt-1 text-sm text-zinc-600">pago único</p>

          <ul class="mt-8 space-y-4">
            <li
              v-for="(feature, j) in plans[0].features"
              :key="j"
              class="flex items-start gap-3"
            >
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-zinc-300">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="`${waBase}${plans[0].waMsg}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-full border border-zinc-700 py-3 text-center text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            {{ plans[0].cta }}
          </a>
        </div>

        <!-- Profesional (highlighted) -->
        <div class="relative rounded-2xl bg-gradient-to-b from-[#0f0f14] to-[#12101f] border border-violet-500/30 p-8">
          <!-- Glow -->
          <div class="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-violet-500/10 blur-xl"></div>

          <!-- Recomendado badge -->
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-4 py-1 text-xs font-semibold text-white">
            Recomendado
          </span>

          <p class="text-sm uppercase tracking-wider text-zinc-400">{{ plans[1].name }}</p>
          <div class="mt-5 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-zinc-50">{{ plans[1].price }}</span>
            <span class="text-zinc-500">MXN</span>
          </div>
          <p class="mt-1 text-sm text-zinc-600">pago único</p>

          <ul class="mt-8 space-y-4">
            <li
              v-for="(feature, j) in plans[1].features"
              :key="j"
              class="flex items-start gap-3"
            >
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-zinc-300">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="`${waBase}${plans[1].waMsg}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            {{ plans[1].cta }}
          </a>
        </div>
      </div>

      <!-- Maintenance note -->
      <div class="mx-auto mt-8 max-w-4xl">
        <div class="rounded-xl bg-[#0f0f14] border border-[#1a1a2e] p-4 text-center">
          <p class="text-sm text-zinc-400">
            <span class="font-semibold text-zinc-300">Opcional:</span> Mantenimiento mensual
            <span class="font-bold text-cyan-400">$499 MXN/mes</span>
            (hosting + soporte + actualizaciones)
          </p>
        </div>
      </div>

      <!-- Trust note -->
      <div class="mt-8 text-center">
        <p class="text-sm text-zinc-500">
          Un día de pacientes que no faltan paga tu inversión
        </p>
      </div>
    </div>
  </section>
</template>
