<script setup>
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Necesito saber de tecnología?',
    answer: 'No. Nosotros configuramos todo. Tú solo compartes tu link con tus pacientes.',
  },
  {
    question: '¿Cuánto tardan en tener mi página lista?',
    answer: '48–72 horas después de recibir tu información.',
  },
  {
    question: '¿Mis pacientes necesitan descargar una app?',
    answer: 'No. Agendan desde el navegador de su celular, sin instalar nada.',
  },
  {
    question: '¿Puedo personalizar los colores y mi información?',
    answer: 'Sí, todo se adapta a tu consultorio: nombre, servicios, horarios y colores.',
  },
  {
    question: '¿Qué pasa si necesito ayuda después?',
    answer: 'Con el plan de mantenimiento mensual tienes soporte por WhatsApp y actualizaciones.',
  },
  {
    question: '¿Funciona en celular?',
    answer: 'Sí, todo es 100% responsive. Funciona perfecto en cualquier celular.',
  },
]
</script>

<template>
  <section class="bg-[#09090b] py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <span class="text-xs tracking-[0.2em] uppercase text-zinc-500">FAQ</span>
        <h2 class="mt-4 text-3xl font-bold text-zinc-50 sm:text-4xl">
          Preguntas frecuentes
        </h2>
      </div>

      <!-- Accordion -->
      <Accordion type="single" collapsible class="mt-14 space-y-3">
        <AccordionItem
          v-for="(faq, i) in faqs"
          :key="i"
          :value="`faq-${i}`"
          class="overflow-hidden rounded-xl border border-[#1a1a2e] bg-[#0f0f14] mb-3"
        >
          <AccordionTrigger class="px-6 py-5 text-base font-medium text-zinc-200 hover:text-white hover:no-underline">
            {{ faq.question }}
          </AccordionTrigger>
          <AccordionContent class="px-6 pb-5 text-sm text-zinc-500">
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>
