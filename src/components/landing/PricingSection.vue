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
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-8">
          <p class="text-sm uppercase tracking-wider text-[#64748b]">{{ plans[0].name }}</p>
          <div class="mt-5 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#0A3040]">{{ plans[0].price }}</span>
            <span class="text-[#94a3b8]">MXN</span>
          </div>
          <p class="mt-1 text-sm text-[#94a3b8]">pago unico</p>

          <ul class="mt-8 space-y-4">
            <li v-for="(feature, j) in plans[0].features" :key="j" class="flex items-start gap-3">
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

        <div class="relative rounded-2xl border-2 border-[#2BC8ED] bg-white p-8 shadow-lg shadow-[#088BB2]/10">
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
            <li v-for="(feature, j) in plans[1].features" :key="j" class="flex items-start gap-3">
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
