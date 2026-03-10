<script setup>
</script>

<template>
  <section id="demo-sections" class="py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Producto</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Explora el demo interactivo
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-base text-[#64748b]">
          Conoce cada sección del sistema con datos de ejemplo listos para explorar
        </p>
      </div>

      <!-- ═══ TOP ROW: 2 hero cards ══════════════════════════════════ -->
      <div class="mt-14 grid gap-5 lg:grid-cols-2">

        <!-- Dashboard / Hoy -->
        <router-link
          to="/demo/dashboard"
          class="demo-card group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFE]">
                  <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0A3040]">Dashboard</h3>
                  <p class="text-xs text-[#94a3b8]">Vista general del consultorio</p>
                </div>
              </div>
              <div class="demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
            </div>
            <!-- Preview: stats + timeline -->
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <p class="text-[10px] text-[#94a3b8] mb-0.5">Citas hoy</p>
                <p class="text-xl font-extrabold text-[#0A3040]">6</p>
              </div>
              <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <p class="text-[10px] text-[#94a3b8] mb-0.5">Confirmadas</p>
                <p class="text-xl font-extrabold text-[#088BB2]">4</p>
              </div>
              <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <p class="text-[10px] text-[#94a3b8] mb-0.5">Pendientes</p>
                <p class="text-xl font-extrabold text-[#d97706]">2</p>
              </div>
            </div>
            <div class="space-y-1.5">
              <div v-for="(apt, i) in [
                { time: '09:00', name: 'María García', status: 'Confirmada', color: 'bg-emerald-500' },
                { time: '09:30', name: 'Juan Hernández', status: 'Pendiente', color: 'bg-amber-400' },
                { time: '10:00', name: 'Ana Sofía R.', status: 'Confirmada', color: 'bg-emerald-500' },
              ]" :key="i" class="flex items-center gap-3 rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2">
                <span class="text-xs font-mono font-semibold text-[#64748b] w-10">{{ apt.time }}</span>
                <div class="w-1.5 h-1.5 rounded-full" :class="apt.color"></div>
                <span class="text-xs font-medium text-[#0A3040] flex-1">{{ apt.name }}</span>
                <span class="text-[10px] text-[#94a3b8]">{{ apt.status }}</span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Calendario -->
        <router-link
          to="/demo/dashboard/calendario"
          class="demo-card group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFE]">
                  <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0A3040]">Calendario</h3>
                  <p class="text-xs text-[#94a3b8]">Vista semanal de citas</p>
                </div>
              </div>
              <div class="demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
            </div>
            <!-- Calendar preview -->
            <div class="grid grid-cols-5 gap-2">
              <div v-for="(day, di) in [
                { label: 'Lun', slots: ['9:00', '10:00', '16:00'] },
                { label: 'Mar', slots: ['9:30', '11:00'] },
                { label: 'Mie', slots: ['9:00', '10:30'] },
                { label: 'Jue', slots: ['10:00', '16:30'] },
                { label: 'Vie', slots: ['9:30', '11:00'] },
              ]" :key="day.label" class="text-center">
                <p class="text-[11px] font-semibold text-[#64748b] mb-2">{{ day.label }}</p>
                <div class="space-y-1.5">
                  <div
                    v-for="(slot, si) in day.slots"
                    :key="si"
                    class="rounded-lg py-1.5 px-1 text-[11px] font-medium"
                    :class="[
                      ['bg-[#EAFBFE] text-[#088BB2]', 'bg-emerald-50 text-emerald-600', 'bg-amber-50 text-amber-600'][
                        (di + si) % 3
                      ]
                    ]"
                  >{{ slot }}</div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-3 pt-2 border-t border-[#e2e8f0]/60">
              <div class="h-px flex-1 bg-[#e2e8f0]"></div>
              <span class="text-[11px] text-[#94a3b8] font-medium">14-16h Descanso</span>
              <div class="h-px flex-1 bg-[#e2e8f0]"></div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- ═══ MIDDLE ROW: 2 standard cards ═══════════════════════════ -->
      <div class="mt-5 grid gap-5 lg:grid-cols-2">

        <!-- Citas -->
        <router-link
          to="/demo/dashboard/citas"
          class="demo-card group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFE]">
                  <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0A3040]">Gestión de citas</h3>
                  <p class="text-xs text-[#94a3b8]">Tabla completa con filtros y estados</p>
                </div>
              </div>
              <div class="demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
            </div>
            <!-- Mini table -->
            <div class="rounded-xl border border-[#e2e8f0]/60 overflow-hidden">
              <div class="grid grid-cols-4 gap-1 bg-[#EAFBFE] px-3 py-2">
                <span class="text-[10px] font-bold text-[#088BB2]">Fecha</span>
                <span class="text-[10px] font-bold text-[#088BB2]">Paciente</span>
                <span class="text-[10px] font-bold text-[#088BB2]">Servicio</span>
                <span class="text-[10px] font-bold text-[#088BB2]">Estado</span>
              </div>
              <div v-for="(r, i) in [
                { date: '09 Mar', name: 'M. García', service: 'General', status: 'Confirmada', sc: 'bg-emerald-50 text-emerald-600' },
                { date: '09 Mar', name: 'J. Hernández', service: 'Seguimiento', status: 'Pendiente', sc: 'bg-amber-50 text-amber-600' },
                { date: '10 Mar', name: 'A. Sofía R.', service: 'General', status: 'Completada', sc: 'bg-sky-50 text-sky-600' },
              ]" :key="i" class="grid grid-cols-4 gap-1 px-3 py-2 border-t border-[#f1f5f9]">
                <span class="text-[11px] text-[#64748b]">{{ r.date }}</span>
                <span class="text-[11px] font-medium text-[#0A3040]">{{ r.name }}</span>
                <span class="text-[11px] text-[#64748b]">{{ r.service }}</span>
                <span class="text-[10px] font-semibold rounded-full px-2 py-0.5 w-fit" :class="r.sc">{{ r.status }}</span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Pacientes -->
        <router-link
          to="/demo/dashboard/pacientes"
          class="demo-card group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFE]">
                  <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0A3040]">Pacientes</h3>
                  <p class="text-xs text-[#94a3b8]">Directorio con historial completo</p>
                </div>
              </div>
              <div class="demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
            </div>
            <div class="space-y-2">
              <div v-for="(p, i) in [
                { name: 'María García López', phone: '442 100 1001', visits: 8 },
                { name: 'Juan Hernández M.', phone: '442 100 1002', visits: 5 },
                { name: 'Ana Sofía Rodríguez', phone: '442 100 1003', visits: 3 },
              ]" :key="i" class="flex items-center gap-3 rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" :class="['bg-[#088BB2]', 'bg-[#0CADD4]', 'bg-emerald-500'][i]">
                  {{ p.name[0] }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-[#0A3040] truncate">{{ p.name }}</p>
                  <p class="text-[10px] text-[#94a3b8]">{{ p.phone }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold text-[#0A3040]">{{ p.visits }}</p>
                  <p class="text-[10px] text-[#94a3b8]">citas</p>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- ═══ BOTTOM ROW: AI cards + Analítica ═══════════════════════ -->
      <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <!-- Notas Clínicas (AI) -->
        <router-link
          to="/demo/dashboard/notas"
          class="ai-demo-card group relative rounded-2xl"
        >
          <div class="ai-demo-border"></div>
          <div class="relative z-10 overflow-hidden rounded-[15px] bg-white">
            <!-- AI bg effects -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30"></div>
            <div class="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-200/15 blur-xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-emerald-300/10 blur-lg"></div>
            <div class="ai-demo-shimmer"></div>
            <!-- Particles -->
            <div class="absolute top-5 right-10 w-1.5 h-1.5 rounded-full bg-emerald-400/40 ai-p1"></div>
            <div class="absolute bottom-8 right-6 w-1 h-1 rounded-full bg-emerald-300/30 ai-p2"></div>

            <div class="relative z-10 p-5 sm:p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-bold text-[#0A3040]">Notas Clínicas</h3>
                      <span class="ai-badge-sm">IA</span>
                    </div>
                    <p class="text-xs text-[#94a3b8]">Genera notas SOAP con IA</p>
                  </div>
                </div>
                <div class="ai-demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
              </div>
              <!-- SOAP preview -->
              <div class="rounded-xl border border-emerald-200/40 bg-white/80 backdrop-blur-sm p-3 mb-3">
                <p class="text-[11px] text-[#94a3b8] italic mb-2.5">"Paciente con dolor de cabeza, 2 semanas..."</p>
                <div class="space-y-2">
                  <div v-for="s in [
                    { l: 'S', c: 'bg-emerald-500', t: 'Cefalea tensional, intensidad 6/10' },
                    { l: 'O', c: 'bg-sky-400', t: 'PA 130/85, rigidez cervical leve' },
                    { l: 'A', c: 'bg-amber-400', t: 'Cefalea tensional crónica' },
                    { l: 'P', c: 'bg-emerald-400', t: 'Paracetamol 500mg c/8h' },
                  ]" :key="s.l" class="flex items-center gap-2.5">
                    <span class="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold text-white shrink-0" :class="s.c">{{ s.l }}</span>
                    <span class="text-[12px] text-[#64748b]">{{ s.t }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Mensajes (AI) -->
        <router-link
          to="/demo/dashboard/mensajes"
          class="ai-demo-card group relative rounded-2xl"
        >
          <div class="ai-demo-border"></div>
          <div class="relative z-10 overflow-hidden rounded-[15px] bg-white">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30"></div>
            <div class="absolute top-0 left-0 w-20 h-20 rounded-full bg-emerald-200/15 blur-xl"></div>
            <div class="ai-demo-shimmer"></div>
            <div class="absolute top-6 right-14 w-1.5 h-1.5 rounded-full bg-emerald-400/40 ai-p1"></div>
            <div class="absolute bottom-10 left-8 w-1 h-1 rounded-full bg-emerald-300/30 ai-p2"></div>

            <div class="relative z-10 p-5 sm:p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-bold text-[#0A3040]">Mensajes</h3>
                      <span class="ai-badge-sm">IA</span>
                    </div>
                    <p class="text-xs text-[#94a3b8]">Recordatorios escritos por IA</p>
                  </div>
                </div>
                <div class="ai-demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
              </div>
              <!-- Message types -->
              <div class="flex gap-1.5 mb-3">
                <span class="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm shadow-emerald-500/15">Recordatorio</span>
                <span class="rounded-full bg-[#F8FAFB] border border-[#e2e8f0] px-2.5 py-1 text-[10px] text-[#94a3b8]">Seguimiento</span>
                <span class="rounded-full bg-[#F8FAFB] border border-[#e2e8f0] px-2.5 py-1 text-[10px] text-[#94a3b8]">No atendida</span>
              </div>
              <!-- WhatsApp bubble -->
              <div class="rounded-xl bg-[#dcfce7] p-3 mb-3 shadow-sm">
                <p class="text-[12px] text-[#0A3040] leading-relaxed">
                  Estimada Sra. García, le recordamos su cita mañana a las 9:00 AM para Consulta General con el Dr. Mendoza.
                </p>
                <p class="mt-1.5 text-right text-[10px] text-emerald-600 font-medium">10:30 AM &#10003;&#10003;</p>
              </div>
              <div class="flex gap-2">
                <span class="flex-1 rounded-lg bg-[#25D366] py-1.5 text-center text-[11px] font-semibold text-white shadow-sm">WhatsApp</span>
                <span class="flex-1 rounded-lg bg-[#F8FAFB] border border-[#e2e8f0] py-1.5 text-center text-[11px] text-[#64748b]">Copiar</span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Analítica -->
        <router-link
          to="/demo/dashboard/analytics"
          class="demo-card group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFE]">
                  <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0A3040]">Analitica</h3>
                  <p class="text-xs text-[#94a3b8]">Reportes de ingresos y servicios</p>
                </div>
              </div>
              <div class="demo-arrow"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
            </div>
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <p class="text-[10px] text-[#94a3b8] mb-0.5">Citas/mes</p>
                <p class="text-xl font-extrabold text-[#0A3040]">34</p>
              </div>
              <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 px-3 py-2.5">
                <p class="text-[10px] text-[#94a3b8] mb-0.5">Ingresos</p>
                <p class="text-xl font-extrabold text-emerald-600">$14.2k</p>
              </div>
            </div>
            <!-- Bar chart -->
            <div class="rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 p-3 mb-3">
              <div class="flex items-end gap-2 h-12">
                <div v-for="(h, i) in [70, 90, 55, 100, 45]" :key="i" class="flex-1 rounded-md transition-all" :class="h === 100 ? 'bg-[#088BB2]' : 'bg-[#088BB2]/30'" :style="{ height: h + '%' }"></div>
              </div>
            </div>
            <!-- Donut -->
            <div class="flex items-center gap-4 rounded-xl bg-[#F8FAFB] border border-[#e2e8f0]/60 p-3">
              <svg class="h-12 w-12 -rotate-90 shrink-0" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="12" fill="none" stroke-width="4" stroke="#f1f5f9" />
                <circle cx="18" cy="18" r="12" fill="none" stroke-width="4" stroke="#088BB2" stroke-dasharray="44 76" stroke-linecap="round" />
                <circle cx="18" cy="18" r="12" fill="none" stroke-width="4" stroke="#059669" stroke-dasharray="19 76" stroke-dashoffset="-44" stroke-linecap="round" />
                <circle cx="18" cy="18" r="12" fill="none" stroke-width="4" stroke="#d97706" stroke-dasharray="13 76" stroke-dashoffset="-63" stroke-linecap="round" />
              </svg>
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 text-[11px]"><div class="h-2 w-2 rounded-full bg-[#088BB2]"></div><span class="text-[#64748b]">General 59%</span></div>
                <div class="flex items-center gap-2 text-[11px]"><div class="h-2 w-2 rounded-full bg-[#059669]"></div><span class="text-[#64748b]">Seguimiento 25%</span></div>
                <div class="flex items-center gap-2 text-[11px]"><div class="h-2 w-2 rounded-full bg-[#d97706]"></div><span class="text-[#64748b]">Urgencia 16%</span></div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <router-link
          to="/demo"
          class="inline-flex items-center gap-2 rounded-xl bg-[#088BB2] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#088BB2]/20 transition-all duration-200 hover:bg-[#076F90] hover:shadow-xl hover:shadow-[#088BB2]/30 hover:-translate-y-0.5"
        >
          Entrar al demo completo
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══ Regular demo cards ═══ */
.demo-card {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.demo-card:hover {
  border-color: rgba(8, 139, 178, 0.25);
  box-shadow: 0 12px 32px -4px rgba(8, 139, 178, 0.1), 0 4px 12px -2px rgba(0,0,0,0.03);
  transform: translateY(-4px);
}

.demo-arrow {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #088BB2;
  color: white;
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
}
.demo-card:hover .demo-arrow {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* ═══ AI demo cards ═══ */
.ai-demo-card {
  padding: 1.5px;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 2px 8px -2px rgba(16, 185, 129, 0.06);
}
.ai-demo-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 0 24px 0 rgba(16, 185, 129, 0.12),
    0 16px 40px -4px rgba(16, 185, 129, 0.16),
    0 24px 48px -8px rgba(5, 150, 105, 0.06);
}

.ai-demo-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  z-index: 0;
  background: linear-gradient(var(--ai-angle, 0deg), #10B981, #34D399, #6EE7B7, #A7F3D0, #34D399, #10B981);
  animation: ai-spin 6s linear infinite;
  opacity: 0.45;
  transition: opacity 0.4s ease;
}
.ai-demo-card:hover .ai-demo-border {
  opacity: 1;
}

@property --ai-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes ai-spin {
  to { --ai-angle: 360deg; }
}

.ai-demo-arrow {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669, #10B981);
  color: white;
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.ai-demo-card:hover .ai-demo-arrow {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.ai-badge-sm {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 20px;
  background: linear-gradient(135deg, #059669, #10B981);
  color: white;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
}

.ai-demo-shimmer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(110deg, transparent 30%, rgba(16, 185, 129, 0.04) 42%, rgba(52, 211, 153, 0.08) 50%, rgba(16, 185, 129, 0.04) 58%, transparent 70%);
  background-size: 250% 100%;
  animation: ai-shimmer 5s ease-in-out infinite;
  border-radius: 15px;
}
@keyframes ai-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ai-p1 { animation: ap1 5s ease-in-out infinite; }
.ai-p2 { animation: ap2 6s ease-in-out 1s infinite; }
@keyframes ap1 {
  0%, 100% { transform: translate(0, 0); opacity: 0.4; }
  50% { transform: translate(-5px, -8px); opacity: 1; }
}
@keyframes ap2 {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  50% { transform: translate(4px, -6px); opacity: 0.8; }
}
</style>
