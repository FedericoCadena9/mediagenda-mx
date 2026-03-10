<script setup>
import { useWhatsApp } from '@/composables/useWhatsApp'

const { planBasicoLink, planProLink } = useWhatsApp()

const plans = [
  {
    name: 'Básico',
    price: '$499',
    period: '/mes',
    highlighted: false,
    features: [
      'Agenda y calendario inteligente',
      'Directorio de pacientes',
      'Recordatorios por WhatsApp',
      'Página pública de citas',
      'Soporte por WhatsApp',
    ],
    cta: 'Comenzar con Básico',
    link: planBasicoLink,
  },
  {
    name: 'Pro',
    price: '$899',
    period: '/mes',
    highlighted: true,
    features: [
      'Todo lo del plan Básico',
      'Notas clínicas con IA',
      'Transcripción de consultas con IA',
      'Mensajes inteligentes con IA',
      'Analítica y reportes con IA',
    ],
    cta: 'Comenzar con Pro',
    link: planProLink,
  },
]
</script>

<template>
  <section id="precios" class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Precios</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Precios accesibles para tu consultorio
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-base text-[#64748b]">
          Menos de lo que cobras por 2 consultas. Cancela cuando quieras.
        </p>
      </div>

      <div class="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        <!-- Basic Plan -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-8 transition-all duration-300 hover:shadow-lg">
          <p class="text-sm font-semibold uppercase tracking-wider text-[#64748b]">{{ plans[0].name }}</p>
          <div class="mt-5 flex items-baseline gap-1">
            <span class="text-5xl font-extrabold text-[#0A3040]">{{ plans[0].price }}</span>
            <span class="text-lg text-[#94a3b8]">MXN{{ plans[0].period }}</span>
          </div>
          <p class="mt-1 text-sm text-[#94a3b8]">Cancela cuando quieras</p>

          <ul class="mt-8 space-y-4">
            <li v-for="(feature, j) in plans[0].features" :key="j" class="flex items-start gap-3">
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-[#475569]">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="plans[0].link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-xl border border-[#e2e8f0] bg-white py-3.5 text-center text-sm font-semibold text-[#0A3040] transition-all duration-200 hover:border-[#088BB2]/30 hover:shadow-md"
          >
            {{ plans[0].cta }}
          </a>
        </div>

        <!-- Professional Plan -->
        <div class="relative rounded-2xl border-2 border-[#088BB2] bg-white p-8 shadow-lg shadow-[#088BB2]/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#088BB2]/15">
          <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#088BB2] px-4 py-1 text-xs font-bold text-white">
            Recomendado
          </span>

          <p class="text-sm font-semibold uppercase tracking-wider text-[#64748b]">{{ plans[1].name }}</p>
          <div class="mt-5 flex items-baseline gap-1">
            <span class="text-5xl font-extrabold text-[#0A3040]">{{ plans[1].price }}</span>
            <span class="text-lg text-[#94a3b8]">MXN{{ plans[1].period }}</span>
          </div>
          <p class="mt-1 text-sm text-[#94a3b8]">Cancela cuando quieras</p>

          <ul class="mt-8 space-y-4">
            <li v-for="(feature, j) in plans[1].features" :key="j" class="flex items-start gap-3">
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-sm text-[#475569]">{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="plans[1].link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block w-full rounded-xl bg-[#088BB2] py-3.5 text-center text-sm font-bold text-white transition-all duration-200 hover:bg-[#076F90] hover:shadow-lg hover:shadow-[#088BB2]/20"
          >
            {{ plans[1].cta }}
          </a>
        </div>
      </div>

      <!-- Setup fee -->
      <div class="mx-auto mt-6 max-w-4xl">
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-5 text-center">
          <p class="text-sm text-[#64748b]">
            <span class="font-semibold text-[#0A3040]">Configuración inicial:</span>
            <span class="font-bold text-[#088BB2]">$999 MXN</span>
            (pago único) — personalizamos tu página, horarios y servicios
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
