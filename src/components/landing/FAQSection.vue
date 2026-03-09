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
