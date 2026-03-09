<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-2xl bg-[#088BB2] px-8 py-16 text-center shadow-xl shadow-[#088BB2]/20 sm:px-16">
        <div class="pointer-events-none absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, #5EDCF6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #076F90 0%, transparent 50%);"></div>

        <div class="relative">
          <h2 class="text-3xl font-bold text-white sm:text-4xl">
            Listo para dejar de agendar por WhatsApp?
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-[#CAF4FD]">
            Unete a los medicos que ya automatizaron su consultorio
          </p>

          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/demo"
              class="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-[#088BB2] transition-colors hover:bg-[#EAFBFE]"
            >
              Ver demo en vivo
            </a>
            <a
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
