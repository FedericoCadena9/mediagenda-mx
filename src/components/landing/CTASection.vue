<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0f0f14] to-[#09090b] py-20 md:py-28">
    <!-- Violet orb -->
    <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/15 blur-[100px]"></div>

    <div class="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-zinc-50 sm:text-4xl">
        ¿Listo para dejar de agendar por WhatsApp?
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
        Únete a los médicos que ya automatizaron su consultorio
      </p>

      <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a
          href="/demo"
          class="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
        >
          Ver demo en vivo &rarr;
        </a>
        <a
          :href="waLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center rounded-full border border-zinc-700 px-8 py-3.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Contactar por WhatsApp &rarr;
        </a>
      </div>
    </div>
  </section>
</template>
