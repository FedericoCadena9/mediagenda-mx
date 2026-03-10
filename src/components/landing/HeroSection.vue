<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWhatsApp } from '@/composables/useWhatsApp'

const { heroLink: waLink } = useWhatsApp()
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-[#F8FAFB]">
    <!-- Sticky Product Bar -->
    <div
      class="sticky top-0 z-50 transition-all duration-300"
      :class="[
        scrolled
          ? 'border-b border-[#e2e8f0] bg-white/90 backdrop-blur-xl shadow-sm'
          : 'bg-[#F8FAFB]'
      ]"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-extrabold text-[#0A3040] sm:text-lg">
            <span class="text-[#088BB2]">Consultia</span><span class="text-[#0A3040]/40"> — </span><span class="hidden font-semibold text-[#64748b] sm:inline">Sistema de Gestión para Consultorios</span>
          </h1>
        </div>
        <div class="flex shrink-0 items-center gap-2.5">
          <router-link
            to="/demo"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[#0A3040]/10 bg-[#0A3040] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0A3040]/90"
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Preview
          </router-link>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#0A3040] transition-all duration-200 hover:border-[#088BB2]/30 hover:bg-[#EAFBFE]/50"
          >
            Desde $499/mes
          </a>
        </div>
      </div>
    </div>

    <!-- Screenshot Grid -->
    <div class="mx-auto max-w-6xl px-4 pt-4 pb-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <!-- Card 1: Dashboard — Hoy -->
        <div class="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#F8FAFB] transition-all duration-300 hover:border-[#088BB2]/25 hover:shadow-xl hover:shadow-[#088BB2]/5">
          <!-- Replace src with your screenshot -->
          <img src="" alt="Dashboard — Hoy" class="aspect-[4/3] w-full object-cover bg-[#e2e8f0]" />
        </div>

        <!-- Card 2: Calendario -->
        <div class="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#F8FAFB] transition-all duration-300 hover:border-[#088BB2]/25 hover:shadow-xl hover:shadow-[#088BB2]/5">
          <!-- Replace src with your screenshot -->
          <img src="" alt="Calendario Semanal" class="aspect-[4/3] w-full object-cover bg-[#e2e8f0]" />
        </div>

        <!-- Card 3: Notas Clínicas IA -->
        <div class="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#F8FAFB] transition-all duration-300 hover:border-[#7C3AED]/25 hover:shadow-xl hover:shadow-[#7C3AED]/5">
          <!-- Replace src with your screenshot -->
          <img src="" alt="Notas Clínicas IA" class="aspect-[4/3] w-full object-cover bg-[#e2e8f0]" />
        </div>

        <!-- Card 4: Analítica -->
        <div class="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#F8FAFB] transition-all duration-300 hover:border-[#088BB2]/25 hover:shadow-xl hover:shadow-[#088BB2]/5">
          <!-- Replace src with your screenshot -->
          <img src="" alt="Analítica" class="aspect-[4/3] w-full object-cover bg-[#e2e8f0]" />
        </div>
      </div>

      <!-- Product Info Section (Stelvio style) -->
      <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        <!-- Left: Description -->
        <div>
          <p class="text-base text-[#64748b] leading-relaxed">
            Consultia es una plataforma integral diseñada para médicos independientes en México. Tus pacientes agendan por WhatsApp y el sistema captura cada cita automáticamente en tu dashboard con calendario, directorio de pacientes y analítica en tiempo real.
          </p>

          <h3 class="mt-8 text-lg font-bold text-[#0A3040]">Acerca de este producto</h3>
          <p class="mt-3 text-sm text-[#64748b] leading-relaxed">
            Diseñado específicamente para consultorios en Querétaro y ciudades medianas de México. Consultia incluye inteligencia artificial integrada (Google Gemini) que genera notas clínicas en formato SOAP, redacta mensajes de WhatsApp personalizados y proporciona insights sobre tu práctica médica. Tus pacientes agendan por WhatsApp como ya lo hacen — pero ahora todo se organiza solo.
          </p>
          <p class="mt-4 text-sm text-[#64748b] leading-relaxed">
            Nosotros configuramos todo por ti. Tus pacientes siguen escribiéndote por WhatsApp, pero ahora cada cita se agenda automáticamente. En 48–72 horas tienes tu plataforma lista.
          </p>
        </div>

        <!-- Right: Sidebar -->
        <div class="space-y-8">
          <!-- Categories (as screen tags) -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Pantallas</h4>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">Dashboard</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">Calendario</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">Citas</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">Pacientes</span>
              <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">Notas Clínicas IA</span>
              <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">Mensajes IA</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">Analítica</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-1 text-xs text-[#475569]">WhatsApp Bot</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Social proof -->
    <div class="mt-12 border-t border-[#e2e8f0] bg-white/60">
      <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <!-- Stacked avatars -->
          <div class="flex -space-x-2.5">
            <div v-for="(c, i) in ['#088BB2','#0E7490','#7C3AED','#D97706','#16A34A','#DC2626','#6366F1','#EA580C']" :key="i"
              class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
              :style="{ backgroundColor: c, zIndex: 8 - i }"
            >
              {{ ['MR','JH','AS','RL','CM','PT','GV','AJ'][i] }}
            </div>
          </div>
          <div class="text-center sm:text-left">
            <p class="text-sm font-semibold text-[#0A3040]">
              Usado por <span class="text-[#088BB2]">12+ médicos</span> en Querétaro
            </p>
            <p class="text-xs text-[#94a3b8] mt-0.5">Consultorios que ya dejaron de agendar por WhatsApp</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="border-t border-[#e2e8f0] bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
          <div class="text-center">
            <div class="text-3xl font-extrabold text-[#088BB2] sm:text-4xl">-2h</div>
            <div class="mt-1 text-sm text-[#64748b]">menos agendando al día</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-extrabold text-[#088BB2] sm:text-4xl">35%</div>
            <div class="mt-1 text-sm text-[#64748b]">menos no-shows</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-extrabold text-[#088BB2] sm:text-4xl">24/7</div>
            <div class="mt-1 text-sm text-[#64748b]">agendamiento en línea</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-extrabold text-[#088BB2] sm:text-4xl">$3k+</div>
            <div class="mt-1 text-sm text-[#64748b]">ahorro semanal estimado</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
