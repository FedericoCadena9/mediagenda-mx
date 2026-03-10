<script setup>
import { useWhatsApp } from '@/composables/useWhatsApp'

const { ctaLink: waLink } = useWhatsApp()
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl bg-[#0A3040] px-8 py-16 text-center sm:px-16 sm:py-20">
        <!-- Subtle pattern -->
        <div class="pointer-events-none absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 25% 25%, #088BB2 1px, transparent 1px), radial-gradient(circle at 75% 75%, #088BB2 1px, transparent 1px); background-size: 32px 32px;"></div>
        <!-- Gradient accent -->
        <div class="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#088BB2]/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl"></div>

        <div class="relative">
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            ¿Listo para dejar de agendar<br class="hidden sm:block"> por WhatsApp?
          </h2>
          <p class="mx-auto mt-5 max-w-2xl text-lg text-[#9AEBFB]">
            Únete a los médicos que ya automatizaron su consultorio
          </p>

          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <router-link
              to="/demo"
              class="inline-flex items-center gap-2 rounded-xl bg-[#088BB2] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#088BB2]/30 transition-all duration-200 hover:bg-[#0CADD4] hover:shadow-xl"
            >
              Ver demo en vivo
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </router-link>
            <a
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
