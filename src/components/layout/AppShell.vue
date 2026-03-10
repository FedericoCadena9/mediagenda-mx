<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { AnimatePresence, motion } from 'motion-v'
import AppSidebar from './AppSidebar.vue'

const $route = useRoute()
const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-background">
    <!-- Demo banner -->
    <div class="flex-shrink-0 bg-medical-950 text-white text-center py-2 text-[12.5px] font-medium tracking-wide">
      <span class="text-white/50">Estás viendo una</span>
      <span class="mx-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/[0.08] rounded-full text-[10px] font-bold uppercase tracking-widest text-medical-300 border border-white/[0.06]">Demo</span>
      <span class="text-white/50">interactiva —</span>
      <router-link to="/" class="ml-1 text-medical-300 hover:text-medical-200 underline underline-offset-2 transition-colors">
        Ver precios
      </router-link>
    </div>

    <div class="flex flex-1 min-h-0">
      <AppSidebar
        :mobile-open="mobileMenuOpen"
        @close="mobileMenuOpen = false"
      />

      <div class="flex-1 flex flex-col min-h-0">
        <!-- Mobile-only header -->
        <div class="md:hidden flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div class="flex items-center justify-between h-[52px] px-4">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-foreground p-1.5 -ml-1.5 rounded-lg hover:bg-muted active:bg-muted transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold tracking-tight text-foreground">Consultia</span>
              <span class="text-base font-bold tracking-tight text-medical-600">MX</span>
            </div>
            <div class="w-8"></div>
          </div>
        </div>

        <main class="flex-1 min-h-0 overflow-auto bg-background">
          <router-view v-slot="{ Component }">
            <AnimatePresence mode="wait">
              <motion.div
                v-if="Component"
                :key="$route.path"
                :initial="{ opacity: 0, y: 6 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: -6 }"
                :transition="{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }"
                class="h-full"
              >
                <component :is="Component" />
              </motion.div>
            </AnimatePresence>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>
