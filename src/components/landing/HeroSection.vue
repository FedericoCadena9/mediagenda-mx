<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAFBFE]/50 to-transparent"></div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center text-center">
        <div class="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EAFBFE] px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-[#088BB2]">
          <span>Para medicos en Mexico</span>
          <span class="h-1 w-1 rounded-full bg-[#9AEBFB]"></span>
          <span>7 secciones de demo</span>
        </div>

        <h1 class="text-5xl font-extrabold tracking-tight text-[#0A3040] leading-[1.1] sm:text-6xl lg:text-7xl">
          Tu consultorio en<br>piloto automatico
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#64748b]">
          Tus pacientes agendan solos. Tu solo llegas a consultar. Con inteligencia artificial que te ayuda a dar mejor atencion.
        </p>

        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/demo"
            class="rounded-lg bg-[#088BB2] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#088BB2]/25 transition-all duration-200 hover:bg-[#076F90] hover:shadow-xl hover:shadow-[#088BB2]/30"
          >
            Ver demo en vivo
          </a>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-[#9AEBFB] bg-[#EAFBFE] px-8 py-3.5 text-base font-medium text-[#088BB2] transition-all duration-200 hover:bg-[#CAF4FD]"
          >
            Contactanos
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
