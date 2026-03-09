<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import ProblemSection from '@/components/landing/ProblemSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import ScreenshotsSection from '@/components/landing/ScreenshotsSection.vue'
import HowItWorksSection from '@/components/landing/HowItWorksSection.vue'
import PricingSection from '@/components/landing/PricingSection.vue'
import FAQSection from '@/components/landing/FAQSection.vue'
import CTASection from '@/components/landing/CTASection.vue'
import FooterSection from '@/components/landing/FooterSection.vue'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
const scrolled = ref(false)

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
  <div class="relative min-h-screen bg-[#09090b]" style="scroll-behavior: smooth;">
    <!-- Subtle grid background -->
    <div class="pointer-events-none fixed inset-0 z-0" style="background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 64px 64px;"></div>

    <!-- Sticky Header -->
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      :class="[
        scrolled
          ? 'border-b border-[#1a1a2e] bg-[#09090b]/80 backdrop-blur-xl'
          : 'bg-transparent'
      ]"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-1.5">
          <span class="text-lg font-bold text-zinc-100">MediAgenda</span>
          <span class="text-lg font-bold text-cyan-400">MX</span>
        </div>
        <div class="flex items-center gap-4">
          <a
            href="#precios"
            class="hidden text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white sm:inline-flex"
          >
            Precios
          </a>
          <a
            href="/demo"
            class="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-zinc-100"
          >
            Ver demo &rarr;
          </a>
        </div>
      </div>
    </header>

    <!-- Sections -->
    <main class="relative z-10">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>

    <FooterSection />

    <!-- Floating WhatsApp Button -->
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
