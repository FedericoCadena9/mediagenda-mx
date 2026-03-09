<script setup>
const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <section class="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
    <!-- Gradient orbs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]"></div>
      <div class="absolute top-[10%] left-1/3 h-[400px] w-[600px] rounded-full bg-cyan-600/10 blur-[120px]"></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Centered content -->
      <div class="flex flex-col items-center text-center">
        <!-- Pill badge -->
        <div class="mb-8 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-violet-300">
          Para medicos en Mexico
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold tracking-tight text-zinc-50 leading-[1.1] sm:text-6xl lg:text-7xl">
          Tu consultorio en<br>piloto automatico
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Tus pacientes agendan solos. Tu solo llegas a consultar. Con inteligencia artificial que te ayuda a dar mejor atencion.
        </p>

        <!-- Buttons -->
        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/demo"
            class="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-100"
          >
            Ver demo en vivo &rarr;
          </a>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-zinc-700 px-8 py-3.5 text-base font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:text-white"
          >
            Contactanos
          </a>
        </div>

        <!-- Dashboard mockup -->
        <div class="relative mx-auto mt-20 w-full max-w-4xl">
          <!-- Glow behind -->
          <div class="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-violet-500/15 blur-3xl"></div>

          <!-- Browser window -->
          <div class="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14]/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <!-- Browser chrome -->
            <div class="flex items-center gap-2 border-b border-[#1a1a2e] px-4 py-3">
              <div class="h-3 w-3 rounded-full bg-[#1a1a2e]"></div>
              <div class="h-3 w-3 rounded-full bg-[#1a1a2e]"></div>
              <div class="h-3 w-3 rounded-full bg-[#1a1a2e]"></div>
              <div class="ml-4 flex-1 rounded-lg bg-[#09090b] px-4 py-1.5 text-xs text-zinc-600">mediagenda.mx/dashboard</div>
            </div>

            <!-- Dashboard content -->
            <div class="relative overflow-hidden rounded-b-xl bg-[#09090b] p-6 sm:p-8" style="min-height: 340px;">
              <div class="mb-2 text-sm font-medium text-zinc-600">MediAgenda MX</div>
              <div class="mb-6 text-2xl font-bold text-zinc-100">Buenos dias, Dr. Garcia</div>

              <!-- Stats row -->
              <div class="mb-6 grid grid-cols-3 gap-3">
                <div class="rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
                  <div class="text-xs text-zinc-600">Hoy</div>
                  <div class="mt-1 text-xl font-bold text-cyan-400">8 citas</div>
                </div>
                <div class="rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
                  <div class="text-xs text-zinc-600">Semana</div>
                  <div class="mt-1 text-xl font-bold text-violet-400">32</div>
                </div>
                <div class="rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
                  <div class="text-xs text-zinc-600">Ingresos</div>
                  <div class="mt-1 text-xl font-bold text-emerald-400">$24k</div>
                </div>
              </div>

              <!-- Appointment list -->
              <div class="space-y-2">
                <div class="flex items-center gap-3 rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">MR</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-zinc-200">Maria Rodriguez</div>
                    <div class="text-xs text-zinc-600">9:00 AM — Consulta general</div>
                  </div>
                  <span class="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">Confirmada</span>
                </div>
                <div class="flex items-center gap-3 rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-400">JL</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-zinc-200">Juan Lopez</div>
                    <div class="text-xs text-zinc-600">9:30 AM — Seguimiento</div>
                  </div>
                  <span class="shrink-0 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">Pendiente</span>
                </div>
                <div class="flex items-center gap-3 rounded-xl border border-[#1a1a2e] bg-[#0f0f14] p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">AM</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-zinc-200">Ana Martinez</div>
                    <div class="text-xs text-zinc-600">10:00 AM — Revision</div>
                  </div>
                  <span class="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">Confirmada</span>
                </div>
              </div>

              <!-- Fade at bottom -->
              <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#09090b] to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
