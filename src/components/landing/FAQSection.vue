<script setup>
import { ref } from 'vue'

const faqs = [
  {
    question: '¿Necesito saber de tecnología?',
    answer: 'No. Nosotros configuramos todo. Tus pacientes siguen agendando por WhatsApp como siempre, pero ahora todo se organiza automáticamente.',
  },
  {
    question: '¿Cuánto tardan en tener mi página lista?',
    answer: '48–72 horas después de recibir tu información. Te enviamos el link listo para usar.',
  },
  {
    question: '¿Mis pacientes necesitan descargar algo?',
    answer: 'No. Agendan directo por WhatsApp, como ya lo hacen. La diferencia es que ahora cada cita se captura automáticamente en tu sistema.',
  },
  {
    question: '¿Puedo personalizar los colores y mi información?',
    answer: 'Sí, todo se adapta a tu consultorio: nombre, servicios, horarios, colores y logo.',
  },
  {
    question: '¿Qué pasa si necesito ayuda después?',
    answer: 'Con el plan de mantenimiento mensual tienes soporte por WhatsApp, hosting incluido y actualizaciones.',
  },
  {
    question: '¿Funciona en celular?',
    answer: 'Sí, todo es 100% responsive. Funciona perfecto en cualquier celular, tablet o computadora.',
  },
]

const openIndex = ref(null)

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="bg-white py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">FAQ</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Preguntas frecuentes
        </h2>
      </div>

      <div class="mt-14 space-y-3">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#F8FAFB] transition-all duration-200"
          :class="{ 'border-[#088BB2]/20 bg-[#EAFBFE]/20': openIndex === i }"
        >
          <button
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggle(i)"
          >
            <span class="text-base font-medium text-[#0A3040]">{{ faq.question }}</span>
            <svg
              class="h-5 w-5 shrink-0 text-[#94a3b8] transition-transform duration-200"
              :class="{ 'rotate-180 text-[#088BB2]': openIndex === i }"
              fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div
            class="grid transition-all duration-200"
            :class="openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <p class="px-6 pb-5 text-sm text-[#64748b] leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
