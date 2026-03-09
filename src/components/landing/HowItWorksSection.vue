<script setup>
import { MessageCircle, Settings, Rocket } from 'lucide-vue-next'

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    color: 'bg-[#EAFBFE] text-[#088BB2]',
    title: 'Nos contactas por WhatsApp',
    description: 'Cuentanos sobre tu consultorio: nombre, servicios, horarios y como quieres tu pagina.',
  },
  {
    number: '02',
    icon: Settings,
    color: 'bg-violet-50 text-violet-600',
    title: 'Configuramos tu pagina con tus datos',
    description: 'Nosotros nos encargamos de todo. En 48-72 horas tienes tu plataforma lista.',
  },
  {
    number: '03',
    icon: Rocket,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Compartes tu link y tus pacientes agendan solos',
    description: 'Envias tu link por WhatsApp, redes o donde quieras. Tus pacientes agendan 24/7.',
  },
]
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">
          Como funciona
        </p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          En 3 pasos estas en linea
        </h2>
      </div>

      <div class="relative mt-14 grid gap-8 sm:grid-cols-3">
        <div
          class="pointer-events-none absolute left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] top-10 hidden border-t border-dashed border-[#9AEBFB] sm:block"
        ></div>

        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative text-center"
        >
          <p class="text-5xl font-bold text-[#EAFBFE]">{{ step.number }}</p>

          <div
            :class="step.color"
            class="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full"
          >
            <component :is="step.icon" class="h-5 w-5" />
          </div>

          <h3 class="mt-5 font-semibold text-[#0A3040]">{{ step.title }}</h3>
          <p class="mt-2 text-sm text-[#64748b]">{{ step.description }}</p>
        </div>
      </div>

      <div class="mt-14 rounded-xl border border-[#e2e8f0] bg-white p-6 text-center">
        <p class="text-[#475569] font-medium">
          Tu no tocas codigo. Nosotros lo hacemos todo.
        </p>
      </div>
    </div>
  </section>
</template>
