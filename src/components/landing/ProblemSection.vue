<script setup>
const painPoints = [
  {
    icon: '&#x23F0;',
    title: 'Pierdes 2+ horas al dia respondiendo mensajes para agendar',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: '&#x1F4B8;',
    title: 'Tus pacientes no llegan y pierdes $3,000+ MXN a la semana',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
  },
  {
    icon: '&#x1F4CB;',
    title: 'No tienes historial digital de tus pacientes',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
  },
]
</script>

<template>
  <section class="relative py-24 md:py-32">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center">
        <p class="mb-4 text-xs font-medium tracking-[0.2em] uppercase text-zinc-500">El problema</p>
        <h2 class="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Sigues agendando por WhatsApp?
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
          Si algo de esto te suena, no estas solo. La mayoria de los medicos pierden tiempo y dinero con metodos manuales.
        </p>
      </div>

      <!-- Pain point cards -->
      <div class="mt-16 grid gap-6 sm:grid-cols-3">
        <div
          v-for="(point, i) in painPoints"
          :key="i"
          class="group rounded-2xl border border-[#1a1a2e] bg-[#0f0f14]/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#2a2a3e] hover:-translate-y-1"
        >
          <div :class="[point.iconBg]" class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl" v-html="point.icon"></div>
          <p class="text-base font-semibold leading-relaxed text-zinc-200">{{ point.title }}</p>
        </div>
      </div>

      <!-- Before / After comparison -->
      <div class="mt-20 grid items-stretch gap-8 md:grid-cols-2">
        <!-- Before: Sin MediAgenda -->
        <div class="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14]/80 p-6 backdrop-blur-sm">
          <!-- Red accent bar -->
          <div class="mb-6 flex items-center gap-3">
            <div class="h-8 w-1 rounded-full bg-red-500"></div>
            <span class="text-sm font-semibold text-red-400">Sin MediAgenda</span>
          </div>

          <div class="space-y-3">
            <!-- WhatsApp message bubbles on dark -->
            <div class="flex items-start gap-3 rounded-xl border border-[#1a1a2e] bg-[#09090b] p-3">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20">
                <svg class="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-zinc-600">Paciente</div>
                <div class="text-sm text-zinc-300">"Hola doc, tiene espacio manana?"</div>
              </div>
              <div class="shrink-0 text-xs text-zinc-700">10:23 PM</div>
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-[#1a1a2e] bg-[#09090b] p-3">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20">
                <svg class="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-zinc-600">Otro paciente</div>
                <div class="text-sm text-zinc-300">"Buenos dias, quiero una cita para el jueves"</div>
              </div>
              <div class="shrink-0 text-xs text-zinc-700">7:15 AM</div>
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-[#1a1a2e] bg-[#09090b] p-3">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20">
                <svg class="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-zinc-600">Paciente</div>
                <div class="text-sm text-zinc-300">"A que hora podria ir?"</div>
              </div>
              <div class="shrink-0 text-xs text-zinc-700">8:02 AM</div>
            </div>
          </div>

          <p class="mt-5 text-center text-sm font-medium text-red-400/80">+47 mensajes sin leer...</p>
        </div>

        <!-- After: Con MediAgenda -->
        <div class="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14]/80 p-6 backdrop-blur-sm">
          <!-- Cyan accent bar -->
          <div class="mb-6 flex items-center gap-3">
            <div class="h-8 w-1 rounded-full bg-cyan-400"></div>
            <span class="text-sm font-semibold text-cyan-400">Con MediAgenda</span>
          </div>

          <!-- Clean agenda -->
          <div class="rounded-xl border border-[#1a1a2e] bg-[#09090b] p-5">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-sm font-semibold text-zinc-200">Agenda de hoy</span>
              <span class="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">8 citas</span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <span class="w-14 text-xs font-medium text-zinc-600">9:00</span>
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span class="text-zinc-300">Maria Rodriguez</span>
                <span class="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">Confirmada</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-14 text-xs font-medium text-zinc-600">9:30</span>
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span class="text-zinc-300">Juan Lopez</span>
                <span class="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">Confirmada</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-14 text-xs font-medium text-zinc-600">10:00</span>
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span class="text-zinc-300">Ana Martinez</span>
                <span class="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">Confirmada</span>
              </div>
            </div>
          </div>

          <!-- AI reminder card -->
          <div class="mt-3 rounded-xl border border-[#1a1a2e] bg-[#09090b] p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                <span class="text-lg">&#x1F9E0;</span>
              </div>
              <div>
                <div class="text-sm font-medium text-zinc-300">Recordatorios enviados automaticamente</div>
                <div class="text-xs text-zinc-600">8 de 8 pacientes confirmaron</div>
              </div>
            </div>
          </div>

          <p class="mt-5 text-center text-sm font-medium text-cyan-400/80">Todo organizado, sin estres</p>
        </div>
      </div>
    </div>
  </section>
</template>
