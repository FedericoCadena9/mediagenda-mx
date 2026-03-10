<script setup>
const features = [
  {
    title: 'Agendamiento por WhatsApp',
    desc: 'Tus pacientes agendan por WhatsApp 24/7. El sistema captura la cita automáticamente y la guarda en tu agenda.',
    icon: 'whatsapp',
    ai: false,
    stat: '24/7',
    statLabel: 'Disponible',
  },
  {
    title: 'Agenda inteligente',
    desc: 'Ve tus citas del día, semana y mes en un solo lugar. Confirma, cancela o reagenda con un clic.',
    icon: 'calendar',
    ai: false,
    stat: '3 vistas',
    statLabel: 'Día, semana, mes',
  },
  {
    title: 'Directorio de pacientes',
    desc: 'Historial completo de cada paciente a un clic. Citas previas, notas clínicas y datos de contacto.',
    icon: 'users',
    ai: false,
    stat: '100%',
    statLabel: 'Historial digital',
  },
  {
    title: 'Notas clínicas con IA',
    desc: 'Escribe notas rápidas y la IA genera tu nota SOAP completa. Subjetivo, Objetivo, Evaluación y Plan.',
    icon: 'sparkles',
    ai: true,
    stat: 'SOAP',
    statLabel: 'Generado en segundos',
  },
  {
    title: 'Mensajes inteligentes',
    desc: 'La IA redacta recordatorios y seguimientos personalizados que se envían automáticamente por WhatsApp.',
    icon: 'messages',
    ai: true,
    stat: '3 tonos',
    statLabel: 'Cálido, ejecutivo, preventivo',
  },
  {
    title: 'Analítica y reportes',
    desc: 'Conoce tus servicios más pedidos, ingresos estimados y tasa de no-shows. La IA genera insights.',
    icon: 'chart',
    ai: false,
    stat: 'Real-time',
    statLabel: 'Métricas del consultorio',
  },
]
</script>

<template>
  <section id="funciones" class="bg-white py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Funcionalidades</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          Todo lo que necesita tu consultorio
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base text-[#64748b]">
          Una plataforma completa para gestionar citas, pacientes y comunicación, con inteligencia artificial integrada.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          class="feature-card group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-400"
          :class="f.ai ? 'ai-feature' : 'regular-feature'"
        >
          <!-- AI cards: animated gradient border + bg -->
          <template v-if="f.ai">
            <div class="ai-border-glow"></div>
            <div class="absolute inset-[1.5px] rounded-[15px] bg-white z-[1]"></div>
            <div class="absolute inset-[1.5px] rounded-[15px] bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 z-[2]"></div>
            <!-- Shimmer -->
            <div class="absolute inset-0 z-[3] pointer-events-none feature-shimmer"></div>
            <!-- Floating orbs -->
            <div class="absolute top-6 right-6 w-16 h-16 rounded-full bg-emerald-200/15 blur-xl z-[3] group-hover:bg-emerald-200/25 transition-all duration-700"></div>
            <div class="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-emerald-300/10 blur-lg z-[3] group-hover:bg-emerald-300/20 transition-all duration-700 delay-100"></div>
            <!-- Particles -->
            <div class="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-emerald-400/40 z-[4] feature-particle-1"></div>
            <div class="absolute bottom-12 right-8 w-1 h-1 rounded-full bg-emerald-300/30 z-[4] feature-particle-2"></div>
            <div class="absolute top-1/2 left-6 w-1 h-1 rounded-full bg-emerald-400/25 z-[4] feature-particle-3"></div>
          </template>

          <!-- Regular cards: subtle pattern -->
          <template v-else>
            <div class="absolute inset-0 bg-white"></div>
            <div class="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#EAFBFE]/40 blur-2xl -translate-y-8 translate-x-8 group-hover:bg-[#EAFBFE]/60 transition-all duration-700"></div>
          </template>

          <!-- Content layer -->
          <div class="relative z-10">

            <!-- Icon row -->
            <div class="flex items-center gap-3 mb-5">
              <!-- Icon -->
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
                :class="f.ai
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-105'
                  : 'bg-[#EAFBFE] group-hover:bg-[#d4f4fb] group-hover:scale-105'"
              >
                <!-- WhatsApp -->
                <svg v-if="f.icon === 'whatsapp'" class="h-5.5 w-5.5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                <!-- Calendar -->
                <svg v-else-if="f.icon === 'calendar'" class="h-5.5 w-5.5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <!-- Users -->
                <svg v-else-if="f.icon === 'users'" class="h-5.5 w-5.5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                <!-- Sparkles (AI) -->
                <svg v-else-if="f.icon === 'sparkles'" class="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                <!-- Messages (AI) -->
                <svg v-else-if="f.icon === 'messages'" class="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                <!-- Chart -->
                <svg v-else-if="f.icon === 'chart'" class="h-5.5 w-5.5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              </div>

              <!-- AI Badge -->
              <span v-if="f.ai" class="ai-badge-pill">
                <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                IA
              </span>
            </div>

            <!-- Text -->
            <h3 class="text-lg font-bold text-[#0A3040] mb-2">{{ f.title }}</h3>
            <p class="text-sm text-[#64748b] leading-relaxed mb-5">{{ f.desc }}</p>

            <!-- Stat pill -->
            <div class="flex items-center gap-3">
              <span
                class="text-lg font-extrabold tracking-tight"
                :class="f.ai ? 'text-emerald-600' : 'text-[#088BB2]'"
              >{{ f.stat }}</span>
              <span class="text-xs text-[#94a3b8]">{{ f.statLabel }}</span>
            </div>
          </div>

          <!-- Bottom accent line -->
          <div
            class="absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-300"
            :class="f.ai
              ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 opacity-60 group-hover:opacity-100'
              : 'bg-gradient-to-r from-[#088BB2] to-[#0CADD4] opacity-0 group-hover:opacity-40'"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══ Regular feature cards ═══ */
.regular-feature {
  border: 1px solid #e2e8f0;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.regular-feature:hover {
  border-color: rgba(8, 139, 178, 0.25);
  box-shadow: 0 8px 30px -4px rgba(8, 139, 178, 0.08), 0 4px 12px -2px rgba(0,0,0,0.03);
  transform: translateY(-3px);
}

/* ═══ AI feature cards ═══ */
.ai-feature {
  padding: 1.5px;
  border: none;
}
.ai-feature:hover {
  transform: translateY(-4px);
}

/* Animated border glow */
.ai-border-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  z-index: 0;
  background: linear-gradient(
    var(--border-angle, 0deg),
    #10B981,
    #34D399,
    #6EE7B7,
    #A7F3D0,
    #34D399,
    #10B981
  );
  animation: border-rotate 6s linear infinite;
  opacity: 0.45;
  transition: opacity 0.4s ease;
}
.ai-feature:hover .ai-border-glow {
  opacity: 1;
}

@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes border-rotate {
  to { --border-angle: 360deg; }
}

/* AI feature inner padding fix (border eats 1.5px) */
.ai-feature > .relative.z-10 {
  padding: 22px 24px;
}
@media (min-width: 640px) {
  .ai-feature > .relative.z-10 {
    padding: 26px 28px;
  }
}

/* Shimmer sweep */
.feature-shimmer {
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(16, 185, 129, 0.04) 42%,
    rgba(52, 211, 153, 0.08) 50%,
    rgba(16, 185, 129, 0.04) 58%,
    transparent 70%
  );
  background-size: 250% 100%;
  animation: shimmer 5s ease-in-out infinite;
  border-radius: 15px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Floating particles */
.feature-particle-1 { animation: fp1 5s ease-in-out infinite; }
.feature-particle-2 { animation: fp2 6s ease-in-out 1s infinite; }
.feature-particle-3 { animation: fp3 7s ease-in-out 2s infinite; }

@keyframes fp1 {
  0%, 100% { transform: translate(0, 0); opacity: 0.4; }
  50% { transform: translate(-6px, -10px); opacity: 1; }
}
@keyframes fp2 {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  50% { transform: translate(4px, -8px); opacity: 0.9; }
}
@keyframes fp3 {
  0%, 100% { transform: translate(0, 0); opacity: 0.25; }
  50% { transform: translate(6px, -12px); opacity: 0.7; }
}

/* AI badge pill */
.ai-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  background: linear-gradient(135deg, #059669, #10B981);
  color: white;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
</style>
