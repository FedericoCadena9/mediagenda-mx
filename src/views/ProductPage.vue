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
import { useWhatsApp } from '@/composables/useWhatsApp'

const { floatingLink: waLink } = useWhatsApp()

// ── FOMO notifications ──────────────────────────────────────────────
const fomoVisible = ref(false)
const fomoData = ref({ name: '', time: '', action: '' })

const fomoItems = [
  { name: 'Dra. Martínez', time: 'hace 2 horas', action: 'activó su consultorio' },
  { name: 'Dr. Ramírez', time: 'hace 5 horas', action: 'recibió su primera cita online' },
  { name: 'Dra. López', time: 'hace 1 día', action: 'configuró notas clínicas con IA' },
  { name: 'Dr. Hernández', time: 'hace 1 día', action: 'activó su consultorio' },
  { name: 'Dra. Sánchez', time: 'hace 2 días', action: 'agendó 8 citas esta semana' },
  { name: 'Dr. Torres', time: 'hace 3 días', action: 'redujo sus no-shows un 40%' },
]

let fomoIndex = 0
let fomoTimeout = null
let fomoHideTimeout = null

function showNextFomo() {
  fomoData.value = fomoItems[fomoIndex % fomoItems.length]
  fomoVisible.value = true
  fomoIndex++

  fomoHideTimeout = setTimeout(() => {
    fomoVisible.value = false
  }, 4000)

  fomoTimeout = setTimeout(showNextFomo, 15000 + Math.random() * 10000)
}

onMounted(() => {
  fomoTimeout = setTimeout(showNextFomo, 6000)
})

onUnmounted(() => {
  clearTimeout(fomoTimeout)
  clearTimeout(fomoHideTimeout)
})
</script>

<template>
  <div class="relative min-h-screen bg-[#F8FAFB]">
    <main>
      <HeroSection />
      <FeaturesSection />
      <DemoCategoriesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>

    <FooterSection />

    <!-- FOMO notification -->
    <Transition name="fomo">
      <div
        v-if="fomoVisible"
        class="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg shadow-black/8 border border-[#e2e8f0] max-w-[320px]"
      >
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#088BB2]/10">
          <svg class="h-4.5 w-4.5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[13px] font-semibold text-[#0A3040] leading-tight">
            {{ fomoData.name }}
            <span class="font-normal text-[#475569]">{{ fomoData.action }}</span>
          </p>
          <p class="text-[11px] text-[#94a3b8] mt-0.5">{{ fomoData.time }} · Querétaro</p>
        </div>
      </div>
    </Transition>

    <!-- WhatsApp Floating Button -->
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

<style scoped>
.fomo-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fomo-leave-active {
  transition: all 0.3s ease;
}
.fomo-enter-from {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}
.fomo-leave-to {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.97);
}
</style>
