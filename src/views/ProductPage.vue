<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import DemoCategoriesSection from '@/components/landing/DemoCategoriesSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import HowItWorksSection from '@/components/landing/HowItWorksSection.vue'
import PricingSection from '@/components/landing/PricingSection.vue'
import FAQSection from '@/components/landing/FAQSection.vue'
import CTASection from '@/components/landing/CTASection.vue'
import FooterSection from '@/components/landing/FooterSection.vue'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="relative min-h-screen bg-[#F8FAFB]">
    <!-- Sticky Header -->
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      :class="[
        scrolled
          ? 'border-b border-[#e2e8f0] bg-white/80 backdrop-blur-xl shadow-sm'
          : 'bg-white/60 backdrop-blur-sm'
      ]"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center gap-1">
          <span class="text-lg font-extrabold text-[#088BB2]">Medi</span>
          <span class="text-lg font-extrabold text-[#0A3040]">Agenda</span>
        </div>

        <nav class="hidden items-center gap-6 md:flex">
          <a href="#demo-sections" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Demo</a>
          <a href="#funciones" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Funciones</a>
          <a href="#precios" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">Precios</a>
          <a href="#faq" class="text-sm font-medium text-[#475569] transition-colors hover:text-[#088BB2]">FAQ</a>
        </nav>

        <div class="flex items-center gap-3">
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden rounded-lg border border-[#9AEBFB] bg-[#EAFBFE] px-4 py-2 text-sm font-medium text-[#088BB2] transition-colors hover:bg-[#CAF4FD] sm:inline-flex"
          >
            Contactar
          </a>
          <a
            href="/demo"
            class="rounded-lg bg-[#088BB2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#076F90]"
          >
            Ver demo
          </a>
          <button
            class="ml-1 inline-flex items-center justify-center rounded-lg p-2 text-[#475569] hover:bg-[#EAFBFE] md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileMenuOpen" class="border-t border-[#e2e8f0] bg-white px-4 py-4 md:hidden">
        <nav class="flex flex-col gap-3">
          <a href="#demo-sections" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Demo</a>
          <a href="#funciones" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Funciones</a>
          <a href="#precios" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">Precios</a>
          <a href="#faq" class="text-sm font-medium text-[#475569]" @click="mobileMenuOpen = false">FAQ</a>
          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-[#088BB2]">Contactar</a>
        </nav>
      </div>
    </header>

    <main>
      <HeroSection />
      <DemoCategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>

    <FooterSection />

    <a
      :href="waLink"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-1"
      aria-label="Contactar por WhatsApp"
    >
      <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.52-1.474A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.8-6.32-2.144l-.44-.348-2.914.95.975-2.86-.37-.467A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  </div>
</template>
