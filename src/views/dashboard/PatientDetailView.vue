<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { useRoute, useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { callGemini } from '@/services/gemini'
import {
  ArrowLeft,
  Phone,
  Mail,
  CalendarDays,
  Sparkles,
  AlertCircle,
  Clock,
  User,
  Activity,
  ClipboardList,
  CalendarCheck,
  FileText,
  Shield,
  TrendingUp,
  Stethoscope,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()

const patient = computed(() => patientsStore.getPatientById(route.params.id))

const patientAppointments = computed(() => {
  if (!patient.value) return []
  return appointmentsStore.appointments
    .filter((a) => a.patientId === patient.value.id)
    .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))
})

const patientNotes = computed(() => {
  if (!patient.value) return []
  return patientsStore.getPatientNotes(patient.value.id)
})

// ── Stats ───────────────────────────────────────────────────────────
const totalAppointments = computed(() => patientAppointments.value.length)
const completedAppointments = computed(() => patientAppointments.value.filter((a) => a.status === 'completada').length)
const noShowCount = computed(() => patientAppointments.value.filter((a) => a.status === 'no_show').length)

const noShowRisk = computed(() => {
  if (!patient.value) return { level: 'medio', label: 'Medio', color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50' }
  const apts = patientAppointments.value
  if (apts.length <= 1) return { level: 'medio', label: 'Medio', color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50' }
  const noShows = apts.filter((a) => a.status === 'no_show').length
  if (noShows >= 2) return { level: 'alto', label: 'Alto', color: 'text-red-500', dot: 'bg-red-400', bg: 'bg-red-50' }
  if (noShows === 1) return { level: 'medio', label: 'Medio', color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50' }
  return { level: 'bajo', label: 'Bajo', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' }
})

// ── Helpers ─────────────────────────────────────────────────────────
function patientInitials(name) {
  const parts = name.split(' ')
  return parts.length >= 2
    ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    : parts[0].charAt(0).toUpperCase()
}

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014'
  const [y, m, d] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function formatNoteDate(isoStr) {
  if (!isoStr) return '\u2014'
  const d = new Date(isoStr)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function formatNoteTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatRegisteredDate(isoStr) {
  if (!isoStr) return '\u2014'
  const d = new Date(isoStr)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function getStatusInfo(status) {
  const map = {
    confirmada: { label: 'Confirmada', color: 'text-medical-600', dot: 'bg-medical-500' },
    pendiente: { label: 'Pendiente', color: 'text-amber-600', dot: 'bg-amber-400' },
    completada: { label: 'Completada', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    en_curso: { label: 'En curso', color: 'text-sky-600', dot: 'bg-sky-400' },
    cancelada: { label: 'Cancelada', color: 'text-muted-foreground', dot: 'bg-muted-foreground/70' },
    no_show: { label: 'No asistió', color: 'text-red-500', dot: 'bg-red-400' },
  }
  return map[status] || { label: status, color: 'text-muted-foreground', dot: 'bg-muted-foreground/70' }
}

// ── SOAP config ─────────────────────────────────────────────────────
const soapSections = [
  { key: 'S', label: 'Subjetivo', icon: User, border: 'border-l-medical-500', text: 'text-medical-700' },
  { key: 'O', label: 'Objetivo', icon: Activity, border: 'border-l-sky-400', text: 'text-sky-700' },
  { key: 'A', label: 'Evaluación', icon: ClipboardList, border: 'border-l-amber-400', text: 'text-amber-700' },
  { key: 'P', label: 'Plan', icon: CalendarCheck, border: 'border-l-emerald-500', text: 'text-emerald-700' },
]

// ── AI Summary ──────────────────────────────────────────────────────
const aiLoading = ref(false)
const aiSummary = ref('')
const aiError = ref('')
const aiNoKey = ref(false)

async function generateSummary() {
  if (!patient.value) return

  if (patientAppointments.value.length < 2) {
    aiSummary.value = 'Paciente nuevo, sin historial suficiente para generar resumen.'
    return
  }

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  aiSummary.value = ''

  const appointmentsSummary = patientAppointments.value
    .map((a) => `${formatDate(a.date)} - ${serviceName(a.serviceId)} - ${a.status}`)
    .join('; ')

  const notesSummary = patientNotes.value
    .map((n) => `${formatNoteDate(n.createdAt)}: S:${n.soapS} A:${n.soapA} P:${n.soapP}`)
    .join(' | ')

  const systemPrompt = `Eres un asistente medico. Genera un resumen breve (3 puntos) del historial de este paciente en espanol mexicano. Paciente: ${patient.value.fullName}. Historial de citas: ${appointmentsSummary}. Notas clinicas: ${notesSummary || 'Sin notas clinicas registradas.'}.`

  try {
    const result = await callGemini('Genera el resumen del paciente.', systemPrompt)
    aiSummary.value = result
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      aiNoKey.value = true
    } else {
      aiError.value = 'Error al generar el resumen. Intenta de nuevo.'
    }
  } finally {
    aiLoading.value = false
  }
}

// ── Active tab ──────────────────────────────────────────────────────
const activeTab = ref('citas')

function goBack() {
  router.push('/demo/dashboard/pacientes')
}
</script>

<template>
  <div class="h-full flex flex-col p-5 sm:p-6 lg:p-7">

    <!-- Not found -->
    <div v-if="!patient" class="flex-1 flex flex-col items-center justify-center">
      <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle class="w-6 h-6 text-red-400" />
      </div>
      <p class="text-sm font-medium text-foreground">Paciente no encontrado</p>
      <button class="mt-3 text-[13px] font-medium text-medical-600 hover:text-medical-700" @click="goBack">
        Volver a pacientes
      </button>
    </div>

    <template v-else>
      <!-- Back button -->
      <motion.button
        :initial="{ opacity: 0, x: -8 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }"
        class="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-5 flex-shrink-0 self-start"
        @click="goBack"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        Pacientes
      </motion.button>

      <!-- Patient header -->
      <motion.div
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }"
        class="bg-white border border-border rounded-2xl p-5 mb-5 flex-shrink-0 shadow-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-start gap-5">
          <!-- Avatar -->
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md shadow-medical-500/20">
            {{ patientInitials(patient.fullName) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-[1.4rem] font-extrabold text-foreground tracking-tight">{{ patient.fullName }}</h1>
              <span
                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                :class="[noShowRisk.color, noShowRisk.bg]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="noShowRisk.dot"></span>
                Riesgo {{ noShowRisk.label }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-muted-foreground">
              <span class="flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-muted-foreground/70" />
                {{ patient.phone }}
              </span>
              <span class="flex items-center gap-1.5">
                <Mail class="w-3.5 h-3.5 text-muted-foreground/70" />
                {{ patient.email }}
              </span>
              <span class="flex items-center gap-1.5">
                <CalendarDays class="w-3.5 h-3.5 text-muted-foreground/70" />
                Desde {{ formatRegisteredDate(patient.createdAt) }}
              </span>
            </div>

            <!-- Quick stats row -->
            <div class="flex items-center gap-5 mt-3 pt-3 border-t border-border/60">
              <div>
                <p class="text-lg font-bold text-foreground leading-tight">{{ totalAppointments }}</p>
                <p class="text-[10px] text-muted-foreground font-medium">Citas totales</p>
              </div>
              <div class="w-px h-8 bg-muted"></div>
              <div>
                <p class="text-lg font-bold text-emerald-600 leading-tight">{{ completedAppointments }}</p>
                <p class="text-[10px] text-muted-foreground font-medium">Completadas</p>
              </div>
              <div class="w-px h-8 bg-muted"></div>
              <div>
                <p class="text-lg font-bold leading-tight" :class="noShowCount > 0 ? 'text-red-500' : 'text-foreground'">{{ noShowCount }}</p>
                <p class="text-[10px] text-muted-foreground font-medium">No asistió</p>
              </div>
              <div class="w-px h-8 bg-muted"></div>
              <div>
                <p class="text-lg font-bold text-foreground leading-tight">{{ patientNotes.length }}</p>
                <p class="text-[10px] text-muted-foreground font-medium">Notas clínicas</p>
              </div>
            </div>
          </div>

          <!-- AI Summary button -->
          <motion.button
            :whilePress="{ scale: 0.97 }"
            class="flex items-center gap-2 px-4 py-2.5 bg-medical-950 hover:bg-medical-900 text-white text-[12.5px] font-semibold rounded-xl transition-colors flex-shrink-0 shadow-md shadow-medical-950/15 disabled:opacity-40"
            :disabled="aiLoading"
            @click="generateSummary"
          >
            <Sparkles class="w-3.5 h-3.5" />
            <span v-if="aiLoading">Generando...</span>
            <span v-else>Resumen IA</span>
          </motion.button>
        </div>

        <!-- AI Summary result -->
        <div v-if="aiLoading" class="mt-4 p-4 bg-medical-50 border border-medical-100 rounded-xl">
          <div class="flex items-center gap-2 mb-3">
            <Sparkles class="w-3.5 h-3.5 text-medical-600 animate-pulse" />
            <p class="text-[12px] font-semibold text-medical-700">Generando resumen...</p>
          </div>
          <div class="space-y-2">
            <div v-for="i in 3" :key="i" class="h-3 bg-medical-100/60 rounded-md animate-pulse" :style="{ width: `${60 + i * 12}%` }"></div>
          </div>
        </div>

        <div v-if="aiNoKey" class="mt-4 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-[12px] font-semibold text-amber-800">API Key no configurada</p>
            <p class="text-[11px] text-amber-600 mt-0.5">Agrega VITE_GEMINI_API_KEY en tus variables de entorno.</p>
          </div>
        </div>

        <div v-if="aiError" class="mt-4 flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
          <p class="text-[12px] text-red-700 flex-1">{{ aiError }}</p>
          <button class="text-[11px] font-semibold text-red-600 hover:text-red-700" @click="generateSummary">Reintentar</button>
        </div>

        <div v-if="aiSummary && !aiLoading" class="mt-4 p-4 bg-medical-50 border border-medical-100 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles class="w-3.5 h-3.5 text-medical-600" />
            <p class="text-[12px] font-semibold text-medical-700">Resumen del Paciente</p>
            <span class="text-[9px] font-bold uppercase tracking-wider text-medical-600 bg-medical-100 px-1.5 py-0.5 rounded ml-auto">IA</span>
          </div>
          <p class="text-[12.5px] text-medical-800/80 leading-relaxed whitespace-pre-line">{{ aiSummary }}</p>
        </div>
      </motion.div>

      <!-- Tab navigation -->
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.3, delay: 0.15 }"
        class="flex items-center gap-1 mb-4 flex-shrink-0"
      >
        <button
          class="px-4 py-2 text-[13px] font-medium rounded-lg transition-all"
          :class="activeTab === 'citas'
            ? 'bg-foreground text-white'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
          @click="activeTab = 'citas'"
        >
          Historial de Citas
          <span class="ml-1.5 text-[11px] opacity-60">{{ totalAppointments }}</span>
        </button>
        <button
          class="px-4 py-2 text-[13px] font-medium rounded-lg transition-all"
          :class="activeTab === 'notas'
            ? 'bg-foreground text-white'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
          @click="activeTab = 'notas'"
        >
          Notas Clínicas
          <span class="ml-1.5 text-[11px] opacity-60">{{ patientNotes.length }}</span>
        </button>
      </motion.div>

      <!-- Tab content -->
      <motion.div
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }"
        class="flex-1 min-h-0 bg-white border border-border rounded-2xl flex flex-col shadow-sm"
      >

        <!-- ═══ CITAS TAB ═══ -->
        <template v-if="activeTab === 'citas'">
          <div class="px-5 pt-4 pb-3 flex-shrink-0">
            <h3 class="text-[15px] font-bold text-foreground">Historial de citas</h3>
          </div>

          <div class="flex-1 min-h-0 overflow-auto px-5">
            <!-- Desktop table -->
            <table v-if="patientAppointments.length > 0" class="w-full text-[13px] hidden md:table">
              <thead class="sticky top-0 bg-white z-10">
                <tr class="border-b border-border/60">
                  <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Fecha</th>
                  <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Hora</th>
                  <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Servicio</th>
                  <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Estado</th>
                  <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Origen</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="apt in patientAppointments"
                  :key="apt.id"
                  class="border-b border-border/40 last:border-0 hover:bg-muted/60/60 transition-colors"
                >
                  <td class="py-3">
                    <p class="text-foreground font-medium text-xs">{{ formatDate(apt.date) }}</p>
                  </td>
                  <td class="py-3">
                    <span class="text-foreground text-xs">{{ apt.startTime }}</span>
                    <span class="text-muted-foreground text-[11px] ml-1">- {{ apt.endTime }}</span>
                  </td>
                  <td class="py-3 text-muted-foreground text-xs">
                    {{ serviceName(apt.serviceId) }}
                  </td>
                  <td class="py-3">
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold" :class="getStatusInfo(apt.status).color">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(apt.status).dot" />
                      {{ getStatusInfo(apt.status).label }}
                    </span>
                  </td>
                  <td class="py-3 text-muted-foreground text-xs capitalize">
                    {{ apt.source }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Mobile cards -->
            <div class="md:hidden space-y-2 pb-4">
              <div
                v-for="apt in patientAppointments"
                :key="apt.id"
                class="rounded-xl border border-border/60 p-3.5"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-[13px] font-semibold text-foreground">{{ formatDate(apt.date) }}</p>
                  <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="getStatusInfo(apt.status).color">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(apt.status).dot" />
                    {{ getStatusInfo(apt.status).label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{{ apt.startTime }} - {{ apt.endTime }}</span>
                  <span>{{ serviceName(apt.serviceId) }}</span>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-if="patientAppointments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-4">
                <CalendarCheck class="w-6 h-6 text-medical-500" />
              </div>
              <p class="text-sm font-medium text-foreground">Sin citas</p>
              <p class="text-xs text-muted-foreground mt-0.5">Este paciente no tiene citas registradas</p>
            </div>
          </div>
        </template>

        <!-- ═══ NOTAS TAB ═══ -->
        <template v-if="activeTab === 'notas'">
          <div class="px-5 pt-4 pb-3 flex-shrink-0">
            <h3 class="text-[15px] font-bold text-foreground">Notas clínicas</h3>
          </div>

          <div class="flex-1 min-h-0 overflow-auto px-5 pb-5">
            <div v-if="patientNotes.length > 0" class="space-y-4">
              <div
                v-for="note in patientNotes"
                :key="note.id"
                class="rounded-xl border border-border/60 p-4 hover:border-border transition-colors"
              >
                <!-- Note header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Clock class="w-3.5 h-3.5 text-muted-foreground/70" />
                    <span class="font-medium">{{ formatNoteDate(note.createdAt) }}</span>
                    <span class="text-muted-foreground/40">·</span>
                    <span>{{ formatNoteTime(note.createdAt) }}</span>
                  </div>
                  <span
                    v-if="note.aiGenerated"
                    class="text-[9px] font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-2 py-0.5 rounded-md"
                  >IA</span>
                </div>

                <!-- SOAP sections -->
                <div class="space-y-2.5">
                  <div
                    v-for="section in soapSections"
                    :key="section.key"
                    class="border-l-[3px] pl-3.5 py-0.5"
                    :class="section.border"
                  >
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <component :is="section.icon" class="w-3 h-3" :class="section.text" />
                      <p class="text-[10px] font-bold uppercase tracking-wider" :class="section.text">{{ section.label }} ({{ section.key }})</p>
                    </div>
                    <p class="text-[12.5px] text-foreground/80 leading-relaxed">{{ note[`soap${section.key}`] }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-if="patientNotes.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-4">
                <FileText class="w-6 h-6 text-medical-500" />
              </div>
              <p class="text-sm font-medium text-foreground">Sin notas clínicas</p>
              <p class="text-xs text-muted-foreground mt-0.5">Genera notas SOAP desde la sección de Notas Clínicas</p>
            </div>
          </div>
        </template>
      </motion.div>
    </template>
  </div>
</template>
