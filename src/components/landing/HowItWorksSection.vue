<script setup>
const steps = [
  {
    number: '01',
    emoji: '💬',
    color: 'bg-cyan-950/60',
    title: 'Nos contactas por WhatsApp',
    description: 'Cuéntanos sobre tu consultorio: nombre, servicios, horarios y cómo quieres tu página.',
  },
  {
    number: '02',
    emoji: '⚙️',
    color: 'bg-violet-950/60',
    title: 'Configuramos tu página con tus datos',
    description: 'Nosotros nos encargamos de todo. En 48–72 horas tienes tu plataforma lista.',
  },
  {
    number: '03',
    emoji: '🚀',
    color: 'bg-emerald-950/60',
    title: 'Compartes tu link y tus pacientes agendan solos',
    description: 'Envías tu link por WhatsApp, redes o donde quieras. Tus pacientes agendan 24/7.',
  },
]
</script>

<template>
  <section class="bg-[#0a0a0f] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-4 text-xs tracking-[0.2em] uppercase text-zinc-500">
          Cómo funciona
        </p>
        <h2 class="text-3xl font-bold text-zinc-50 sm:text-4xl">
          En 3 pasos estás en línea
        </h2>
      </div>

      <div class="relative mt-14 grid gap-8 sm:grid-cols-3">
        <!-- Dashed connector line (desktop only) -->
        <div
          class="pointer-events-none absolute left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] top-10 hidden border-t border-dashed border-zinc-800 sm:block"
        ></div>

        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative text-center"
        >
          <!-- Step number -->
          <p class="text-5xl font-bold text-zinc-800">{{ step.number }}</p>

          <!-- Icon circle -->
          <div
            :class="step.color"
            class="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full text-xl"
          >
            {{ step.emoji }}
          </div>

          <h3 class="mt-5 font-semibold text-zinc-100">{{ step.title }}</h3>
          <p class="mt-2 text-sm text-zinc-500">{{ step.description }}</p>
        </div>
      </div>

      <!-- Callout card -->
      <div class="mt-14 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-6 text-center">
        <p class="text-zinc-300">
          Tú no tocas código. Nosotros lo hacemos todo.
        </p>
      </div>
    </div>
  </section>
</template>
