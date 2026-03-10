<script setup>
import { useWhatsApp } from '@/composables/useWhatsApp'

const { footerLink: waLink } = useWhatsApp()
</script>

<template>
  <footer class="bg-[#0A3040] py-8">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <!-- Left: brand + location -->
        <div class="flex items-center gap-3">
          <span class="text-[15px] font-bold text-white/90 tracking-tight">Consultia</span>
          <span class="hidden sm:block w-px h-4 bg-white/15"></span>
          <span class="hidden sm:block text-[12px] text-white/40">Querétaro, MX</span>
        </div>

        <!-- Center: links -->
        <nav class="flex items-center gap-5">
          <router-link to="/demo" class="text-[12px] text-white/45 hover:text-white/80 transition-colors">Demo</router-link>
          <a href="#precios" class="text-[12px] text-white/45 hover:text-white/80 transition-colors">Precios</a>
          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="text-[12px] text-white/45 hover:text-white/80 transition-colors">Contacto</a>
        </nav>

        <!-- Right: copyright -->
        <p class="text-[11px] text-white/30">&copy; 2026 Consultia</p>
      </div>
    </div>
  </footer>
</template>
