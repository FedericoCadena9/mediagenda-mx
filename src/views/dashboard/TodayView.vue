<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { animate } from 'motion'
import { motion } from 'motion-v'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { useMediBot } from '@/composables/useMediBot'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Sparkles,
  CalendarCheck,
  FileBarChart,
  Activity,
  Send,
  Maximize2,
  Minimize2,
  MoreVertical,
  Clock,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Bot,
  Loader2,
} from 'lucide-vue-next'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const servicesStore = useServicesStore()
const authStore = useAuthStore()

// ── MediBot ─────────────────────────────────────────────────────────
const { messages, loading: botLoading, sendMessage } = useMediBot()
const chatOpen = ref(false)
const chatInput = ref('')
const bannerInput = ref('')
const chatMessagesRef = ref(null)
const backdropRef = ref(null)
const dialogRef = ref(null)

const aiActions = [
  { label: 'Ver agenda de doctores', icon: CalendarCheck, prompt: '¿Cuál es la agenda de hoy del Dr. Mendoza?' },
  { label: 'Revisar citas de hoy', icon: CalendarDays, prompt: '¿Cuáles son las citas de hoy?' },
  { label: 'Generar reporte', icon: FileBarChart, prompt: 'Dame un reporte general del consultorio este mes' },
  { label: 'Ver flujo de pacientes', icon: Activity, prompt: '¿Cómo está el flujo de pacientes esta semana?' },
]

function scrollToBottom() {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

watch(() => messages.value.length, scrollToBottom)

async function openChat() {
  chatOpen.value = true
  await nextTick()
  if (backdropRef.value) {
    animate(backdropRef.value, { opacity: [0, 1] }, { duration: 0.25 })
  }
  if (dialogRef.value) {
    animate(
      dialogRef.value,
      { opacity: [0, 1], scale: [0.9, 1], y: [30, 0] },
      { duration: 0.35, easing: [0.16, 1, 0.3, 1] }
    )
  }
  scrollToBottom()
}

function closeChat() {
  if (backdropRef.value) {
    animate(backdropRef.value, { opacity: 0 }, { duration: 0.2 })
  }
  if (dialogRef.value) {
    animate(
      dialogRef.value,
      { opacity: 0, scale: 0.92, y: 20 },
      { duration: 0.2, easing: [0.4, 0, 1, 1] }
    ).then(() => {
      chatOpen.value = false
    })
  } else {
    chatOpen.value = false
  }
}

async function handleBannerSend() {
  const text = bannerInput.value.trim()
  if (!text) return
  bannerInput.value = ''
  await openChat()
  sendMessage(text)
}

function handleBannerKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleBannerSend()
  }
}

async function handleQuickAction(action) {
  await openChat()
  sendMessage(action.prompt)
}

function handleChatSend() {
  const text = chatInput.value.trim()
  if (!text || botLoading.value) return
  chatInput.value = ''
  sendMessage(text)
}

function handleChatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleChatSend()
  }
}

// ── Stats ───────────────────────────────────────────────────────────
const totalPatients = computed(() => patientsStore.patients.length)
const totalAppointments = computed(() => appointmentsStore.appointments.length)

const statsCards = computed(() => [
  { title: 'Total pacientes', value: totalPatients.value, change: '13.4%', positive: true },
  { title: 'Pacientes nuevos', value: 12, change: '3.2%', positive: false },
  { title: 'Citas', value: totalAppointments.value, change: '0.4%', positive: true },
  { title: 'Doctores', value: 1, change: '2.8%', positive: true },
])

// ── Today appointments ──────────────────────────────────────────────
const todayAppointments = computed(() => appointmentsStore.todayAppointments)

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

function patientName(patientId) {
  const p = patientsStore.getPatientById(patientId)
  return p ? p.fullName : 'Paciente desconocido'
}

function patientInitial(patientId) {
  const name = patientName(patientId)
  return name.charAt(0).toUpperCase()
}

function statusColor(status) {
  const map = {
    confirmada: 'bg-medical-500',
    pendiente: 'bg-amber-400',
    completada: 'bg-emerald-500',
    en_curso: 'bg-sky-400',
    cancelada: 'bg-slate-300',
    no_show: 'bg-red-400',
  }
  return map[status] || 'bg-slate-300'
}

function durationMinutes(start, end) {
  if (!start || !end) return 30
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

const terminalStatuses = ['completada', 'cancelada', 'no_show']
function isTerminal(status) {
  return terminalStatuses.includes(status)
}

function handleUpdateStatus(id, newStatus) {
  appointmentsStore.updateStatus(id, newStatus)
}

// ── Schedule date ───────────────────────────────────────────────────
const scheduleDate = ref(new Date())
const scheduleDateLabel = computed(() => {
  const d = scheduleDate.value
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d.getDate()} de ${months[d.getMonth()]}`
})

function prevDay() {
  const d = new Date(scheduleDate.value)
  d.setDate(d.getDate() - 1)
  scheduleDate.value = d
}
function nextDay() {
  const d = new Date(scheduleDate.value)
  d.setDate(d.getDate() + 1)
  scheduleDate.value = d
}

// ── Upcoming appointments (next 7 days) ─────────────────────────────
const upcomingAppointments = computed(() => {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  return appointmentsStore.appointments
    .filter((a) => a.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 6)
})

function formatAptDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

// ── Medical History ─────────────────────────────────────────────────
const medicalRecords = computed(() => {
  return patientsStore.clinicalNotes.map((note) => {
    const patient = patientsStore.getPatientById(note.patientId)
    const diagnosis = note.soapA ? note.soapA.split('.')[0] : 'Sin diagnóstico'
    const noteDate = new Date(note.createdAt)
    const daysSince = Math.floor((Date.now() - noteDate.getTime()) / 86400000)
    let status = 'en_progreso'
    if (daysSince > 30) status = 'completado'
    if (daysSince > 60) status = 'remision'

    return {
      id: note.id,
      patient: patient ? patient.fullName : 'Desconocido',
      diagnosis,
      status,
      date: noteDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      treatment: note.soapP ? note.soapP.split('.')[0] : 'Sin tratamiento',
      notes: note.rawInput,
    }
  })
})

function statusDotClass(status) {
  return { en_progreso: 'bg-amber-500', completado: 'bg-emerald-500', remision: 'bg-sky-500' }[status] || 'bg-gray-400'
}

function statusTextClass(status) {
  return { en_progreso: 'text-amber-600', completado: 'text-emerald-600', remision: 'text-sky-600' }[status] || 'text-gray-600'
}

function statusLabel(status) {
  return { en_progreso: 'En progreso', completado: 'Completado', remision: 'Remisión' }[status] || status
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-7 lg:h-full lg:flex lg:flex-col lg:gap-4 space-y-3 sm:space-y-4 lg:space-y-0">

    <!-- ═══ ROW 0: HEADER ═══ -->
    <motion.div
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
      class="flex-shrink-0"
    >
      <h1 class="text-[1.4rem] sm:text-[1.65rem] font-extrabold text-foreground tracking-tight">Dashboard</h1>
      <p class="mt-0.5 text-[12px] sm:text-[13px] text-muted-foreground">Reportes del consultorio actualizados en tiempo real</p>
    </motion.div>

    <!-- ═══ ROW 1: STATS ═══ -->
    <motion.div
      class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 flex-shrink-0"
      :initial="'hidden'"
      :animate="'visible'"
      :transition="{ staggerChildren: 0.06 }"
    >
      <motion.div
        v-for="(stat, idx) in statsCards"
        :key="stat.title"
        :variants="{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0 }
        }"
        :transition="{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }"
      >
        <motion.div
          class="border border-border rounded-xl sm:rounded-2xl shadow-card p-3 sm:p-4 lg:p-5"
          :whileHover="{ y: -2, transition: { duration: 0.2 } }"
        >
          <div class="flex items-center justify-between mb-2 sm:mb-4">
            <p class="text-[11px] sm:text-[13px] font-medium text-muted-foreground leading-tight">{{ stat.title }}</p>
            <button class="text-muted-foreground/40 hover:text-muted-foreground -mr-1 hidden sm:block">
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>
          <p class="text-[1.35rem] sm:text-[1.7rem] font-extrabold text-foreground tracking-tight leading-none">{{ stat.value }}</p>
          <p class="mt-1.5 sm:mt-2 text-[10px] sm:text-[11.5px] text-muted-foreground leading-tight">
            <span class="font-semibold" :class="stat.positive ? 'text-emerald-500' : 'text-red-500'">{{ stat.change }}</span>
            <TrendingUp v-if="stat.positive" class="w-2.5 sm:w-3 h-2.5 sm:h-3 inline ml-0.5 text-emerald-500" />
            <TrendingDown v-else class="w-2.5 sm:w-3 h-2.5 sm:h-3 inline ml-0.5 text-red-500" />
            <span class="ml-1 hidden sm:inline">desde la semana pasada</span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>

    <!-- ═══ ROW 2: AI BANNER + SCHEDULE ═══ -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 flex-shrink-0 lg:h-[200px] overflow-hidden">
      <!-- AI ASSISTANT (3/5) -->
      <motion.div
        class="lg:col-span-3 overflow-hidden"
        :initial="{ opacity: 0, scale: 0.97 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="medibot-banner relative rounded-2xl p-4 overflow-hidden h-full flex flex-col justify-between">
          <!-- Emerald gradient background -->
          <div class="absolute inset-0 bg-ai-gradient"></div>
          <!-- Animated mesh overlay -->
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
          <!-- Radial glow -->
          <div class="absolute top-0 right-0 w-56 h-56 rounded-full opacity-[0.12]" style="background: radial-gradient(circle, #34D399 0%, transparent 70%)"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-[0.08]" style="background: radial-gradient(circle, #6EE7B7 0%, transparent 70%)"></div>
          <!-- Floating particles -->
          <div class="absolute top-6 right-12 w-2 h-2 rounded-full bg-emerald-300/30" style="animation: ai-float 5s ease-in-out infinite"></div>
          <div class="absolute top-16 right-24 w-1.5 h-1.5 rounded-full bg-emerald-200/20" style="animation: ai-float-delayed 6s ease-in-out 1s infinite"></div>
          <div class="absolute bottom-8 right-16 w-1 h-1 rounded-full bg-emerald-300/25" style="animation: ai-float 4s ease-in-out 2s infinite"></div>

          <button class="absolute top-3 right-3 text-white/40 hover:text-white/70 transition-colors z-10" @click="openChat">
            <Maximize2 class="w-3.5 h-3.5" />
          </button>

          <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                  <Sparkles class="w-3.5 h-3.5 text-emerald-200 ai-sparkle" />
                </div>
                <h3 class="text-sm font-bold text-white">Hola, soy MediBot</h3>
                <span class="text-[9px] font-bold uppercase tracking-widest text-emerald-300/60 bg-white/[0.08] px-2 py-0.5 rounded-full border border-white/[0.06] ml-1">AI</span>
              </div>
              <div class="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-x-visible pb-1 sm:pb-0 -mx-1 px-1">
                <motion.button
                  v-for="action in aiActions"
                  :key="action.label"
                  :whileHover="{ scale: 1.04, transition: { duration: 0.15 } }"
                  :whilePress="{ scale: 0.96 }"
                  class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] text-white/70 hover:text-white text-[11px] font-medium transition-all duration-200 border border-white/[0.06] whitespace-nowrap flex-shrink-0 sm:flex-shrink"
                  @click="handleQuickAction(action)"
                >
                  <component :is="action.icon" class="w-3 h-3 text-emerald-300" />
                  {{ action.label }}
                </motion.button>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-white/[0.08] rounded-lg px-3 py-2 border border-white/[0.06] mt-3 backdrop-blur-sm">
              <input
                v-model="bannerInput"
                type="text"
                placeholder="Pregúntame algo..."
                class="flex-1 bg-transparent text-white placeholder-white/30 text-xs outline-none"
                @keydown="handleBannerKeydown"
              />
              <div class="w-px h-3 bg-white/10"></div>
              <button
                class="text-emerald-300/50 hover:text-emerald-200 transition-colors"
                @click="handleBannerSend"
              >
                <Send class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- SCHEDULE / UPCOMING (2/5) -->
      <motion.div
        class="lg:col-span-2 overflow-hidden"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="border border-border rounded-2xl shadow-card h-full flex flex-col overflow-hidden">
          <!-- Header with date nav -->
          <div class="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0">
            <h3 class="text-[15px] font-bold text-foreground">Agenda</h3>
            <div class="flex items-center gap-1.5">
              <button class="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors" @click="prevDay">
                <ChevronLeft class="w-3.5 h-3.5" />
              </button>
              <span class="text-xs font-semibold text-foreground min-w-[110px] text-center">{{ scheduleDateLabel }}</span>
              <button class="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors" @click="nextDay">
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Timeline list -->
          <div class="flex-1 min-h-0 overflow-y-auto px-5 pb-3">
            <div class="relative">
              <!-- Timeline line -->
              <div class="absolute left-[27px] top-2 bottom-2 w-px bg-muted"></div>

              <div v-for="(apt, idx) in upcomingAppointments" :key="apt.id" class="relative flex gap-3 mb-2 last:mb-0">
                <!-- Time column -->
                <div class="flex flex-col items-end w-[54px] flex-shrink-0 pt-0.5">
                  <span class="text-[11px] font-semibold text-foreground">{{ apt.startTime }}</span>
                  <span class="text-[10px] text-muted-foreground">{{ apt.endTime }}</span>
                </div>

                <!-- Dot on timeline -->
                <div class="flex flex-col items-center flex-shrink-0 pt-1.5">
                  <div class="w-2.5 h-2.5 rounded-full border-2 border-white z-10" :class="statusColor(apt.status)"></div>
                </div>

                <!-- Card -->
                <div class="flex-1 rounded-lg border border-border/60 px-3 py-2 hover:border-border transition-colors">
                  <p class="text-[12px] font-semibold text-foreground leading-tight">{{ serviceName(apt.serviceId) }}</p>
                  <p class="text-[10.5px] text-muted-foreground mt-0.5">{{ patientName(apt.patientId) }}</p>
                </div>
              </div>

              <!-- Empty -->
              <div v-if="upcomingAppointments.length === 0" class="py-8 text-center">
                <p class="text-xs text-muted-foreground">Sin citas próximas</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- ═══ ROW 3: FULL-WIDTH MEDICAL HISTORY TABLE ═══ -->
    <motion.div
      class="flex-1 min-h-0"
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }"
    >
      <div class="border border-border rounded-xl sm:rounded-2xl shadow-card h-full flex flex-col">
        <div class="flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4 pb-2 flex-shrink-0">
          <h3 class="text-[14px] sm:text-[15px] font-bold text-foreground">Historial médico</h3>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] sm:text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg cursor-pointer hover:bg-muted transition-colors flex items-center gap-1">
              <Filter class="w-3 h-3" /> Mes
            </span>
            <span class="hidden sm:flex text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg cursor-pointer hover:bg-muted transition-colors items-center gap-1">
              <ArrowUpDown class="w-3 h-3" /> Ordenar
            </span>
          </div>
        </div>

        <!-- Mobile: Card list -->
        <div class="sm:hidden flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-2">
          <div
            v-for="record in medicalRecords"
            :key="record.id"
            class="rounded-lg border border-border/50 p-3"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] text-muted-foreground">{{ record.date }}</span>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="statusTextClass(record.status)">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(record.status)" />
                {{ statusLabel(record.status) }}
              </span>
            </div>
            <p class="text-[12px] font-semibold text-foreground leading-tight">{{ record.diagnosis }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{{ record.treatment }}</p>
          </div>
        </div>

        <!-- Desktop: Table -->
        <div class="hidden sm:block px-5 pb-4 flex-1 min-h-0 overflow-y-auto">
          <table class="w-full text-[13px]">
            <thead class="sticky top-0 bg-white z-10">
              <tr class="border-b border-border/60">
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Fecha</th>
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Doctor</th>
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Diagnóstico</th>
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Tratamiento</th>
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Estado</th>
                <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Notas</th>
                <th class="py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in medicalRecords"
                :key="record.id"
                class="border-b border-border/40 last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td class="py-3 text-muted-foreground whitespace-nowrap text-xs">{{ record.date }}</td>
                <td class="py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">CM</div>
                    <span class="text-xs font-medium text-foreground">{{ authStore.doctorName }}</span>
                  </div>
                </td>
                <td class="py-3 text-xs text-foreground max-w-[180px] truncate">{{ record.diagnosis }}</td>
                <td class="py-3 text-xs text-muted-foreground max-w-[180px] truncate">{{ record.treatment }}</td>
                <td class="py-3">
                  <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold" :class="statusTextClass(record.status)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(record.status)" />
                    {{ statusLabel(record.status) }}
                  </span>
                </td>
                <td class="py-3 text-xs text-muted-foreground max-w-[160px] truncate">{{ record.notes }}</td>
                <td class="py-3">
                  <button class="text-medical-600 hover:text-medical-700 text-[11px] font-semibold transition-colors">Más</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>

    <!-- ═══ MEDIBOT CHAT DIALOG ═══ -->
    <Teleport to="body">
      <div v-if="chatOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div ref="backdropRef" class="absolute inset-0 bg-black/30 backdrop-blur-[3px]" @click="closeChat"></div>

        <!-- Dialog -->
        <div
          ref="dialogRef"
          class="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-emerald-900/15 border border-emerald-200/40 flex flex-col overflow-hidden"
          style="max-height: min(600px, 85vh)"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-emerald-900/20 flex-shrink-0 relative overflow-hidden">
            <div class="absolute inset-0 bg-ai-gradient"></div>
            <!-- Floating particles in header -->
            <div class="absolute top-2 right-12 w-1.5 h-1.5 rounded-full bg-emerald-300/30" style="animation: ai-float 4s ease-in-out infinite"></div>
            <div class="absolute bottom-2 right-24 w-1 h-1 rounded-full bg-emerald-200/20" style="animation: ai-float-delayed 5s ease-in-out 1s infinite"></div>

            <div class="relative z-10 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <Sparkles class="w-4 h-4 text-emerald-200 ai-sparkle" />
            </div>
            <div class="relative z-10 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-[14px] font-bold text-white">MediBot</h3>
                <span class="text-[8px] font-bold uppercase tracking-widest text-emerald-300/70 bg-white/[0.08] px-1.5 py-0.5 rounded-full border border-white/[0.06]">AI</span>
              </div>
              <p class="text-[10px] text-emerald-200/40">Asistente clínico inteligente</p>
            </div>
            <button
              class="relative z-10 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              @click="closeChat"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Messages -->
          <div ref="chatMessagesRef" class="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3 medibot-chat-bg">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex"
              :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <!-- Bot message -->
              <div v-if="msg.role === 'bot'" class="flex items-start gap-2.5 max-w-[85%]">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200/60">
                  <Bot class="w-3 h-3 text-emerald-600" />
                </div>
                <div
                  class="rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                  :class="msg.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-muted text-foreground'"
                >
                  <p class="whitespace-pre-line">{{ msg.text }}</p>
                </div>
              </div>

              <!-- User message -->
              <div v-else class="max-w-[80%]">
                <div class="rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[12.5px] leading-relaxed bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                  <p>{{ msg.text }}</p>
                </div>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="botLoading" class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-medical-100">
                <Bot class="w-3 h-3 text-medical-600" />
              </div>
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-100/60 rounded-2xl rounded-tl-md px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ai-dot-1"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ai-dot-2"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ai-dot-3"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick actions (shown when few messages) -->
          <div v-if="messages.length <= 1 && !botLoading" class="px-5 pb-3 flex-shrink-0">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="action in aiActions"
                :key="action.label"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60 hover:bg-emerald-100 hover:border-emerald-200 transition-all"
                @click="sendMessage(action.prompt)"
              >
                <component :is="action.icon" class="w-3 h-3" />
                {{ action.label }}
              </button>
            </div>
          </div>

          <!-- Input -->
          <div class="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0 bg-white">
            <input
              v-model="chatInput"
              type="text"
              placeholder="Escribe tu pregunta..."
              class="flex-1 h-9 px-3.5 text-[13px] text-foreground bg-muted border border-border rounded-xl outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all placeholder:text-muted-foreground/60"
              :disabled="botLoading"
              @keydown="handleChatKeydown"
            />
            <button
              class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm shadow-emerald-500/20"
              :disabled="!chatInput.trim() || botLoading"
              @click="handleChatSend"
            >
              <Loader2 v-if="botLoading" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.medibot-banner {
  box-shadow: 0 8px 32px -4px rgba(5, 150, 105, 0.15), 0 4px 16px -2px rgba(16, 185, 129, 0.1);
}
.medibot-chat-bg {
  background-color: #fafafa;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e5e5' fill-opacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='25' r='0.8'/%3E%3Ccircle cx='55' cy='12' r='0.9'/%3E%3Ccircle cx='70' cy='40' r='0.8'/%3E%3Ccircle cx='20' cy='55' r='1'/%3E%3Ccircle cx='45' cy='65' r='0.8'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
