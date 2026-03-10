<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { animate } from 'motion'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Stethoscope,
  CalendarDays,
  ArrowRight,
  CalendarCheck,
  X,
} from 'lucide-vue-next'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const servicesStore = useServicesStore()

// ── Calendar state ──────────────────────────────────────────────────
const currentDate = ref(new Date())
const viewMode = ref('month')

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const monthNamesShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const dayNamesShort = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const headerTitle = computed(() => `${monthNames[currentMonth.value]} ${currentYear.value}`)

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}
function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}
function goToToday() {
  currentDate.value = new Date()
}

// ── Mini calendar ───────────────────────────────────────────────────
function getMiniCalendarDays() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const days = []
  for (let i = startDay - 1; i >= 0; i--)
    days.push({ day: daysInPrev - i, current: false, date: new Date(year, month - 1, daysInPrev - i) })
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ day: i, current: true, date: new Date(year, month, i) })
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++)
    days.push({ day: i, current: false, date: new Date(year, month + 1, i) })
  return days
}

const miniCalendarDays = computed(() => getMiniCalendarDays())

function isToday(date) {
  const t = new Date()
  return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear()
}

function selectMiniDate(d) {
  currentDate.value = new Date(d.date)
}

// ── Month grid ──────────────────────────────────────────────────────
function getMonthGridDays() {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const days = []
  for (let i = startDay - 1; i >= 0; i--)
    days.push({ day: daysInPrev - i, current: false, dateStr: formatISO(new Date(year, month - 1, daysInPrev - i)) })
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ day: i, current: true, dateStr: formatISO(new Date(year, month, i)) })
  const remaining = Math.ceil(days.length / 7) * 7 - days.length
  for (let i = 1; i <= remaining; i++)
    days.push({ day: i, current: false, dateStr: formatISO(new Date(year, month + 1, i)) })
  return days
}

const monthGridDays = computed(() => getMonthGridDays())
const weekRows = computed(() => {
  const days = monthGridDays.value
  const rows = []
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))
  return rows
})

// ── Filters ─────────────────────────────────────────────────────────
const activeStatuses = ref(new Set(['confirmada', 'pendiente', 'completada', 'en_curso', 'cancelada', 'no_show']))
const activePatients = ref(new Set())
const showAllPatients = ref(true)

const statusFilters = [
  { value: 'confirmada', label: 'Confirmada', dot: 'bg-medical-500' },
  { value: 'pendiente', label: 'Pendiente', dot: 'bg-amber-400' },
  { value: 'completada', label: 'Completada', dot: 'bg-emerald-500' },
  { value: 'cancelada', label: 'Cancelada', dot: 'bg-slate-400' },
  { value: 'no_show', label: 'No asistió', dot: 'bg-red-400' },
]

function toggleStatus(status) {
  const s = new Set(activeStatuses.value)
  if (s.has(status)) s.delete(status); else s.add(status)
  activeStatuses.value = s
}

const patientsList = computed(() => {
  const seen = new Set()
  const result = []
  for (const apt of appointmentsStore.appointments) {
    if (!seen.has(apt.patientId)) {
      seen.add(apt.patientId)
      const p = patientsStore.getPatientById(apt.patientId)
      if (p) result.push(p)
    }
  }
  return result.slice(0, 10)
})

function togglePatient(id) {
  showAllPatients.value = false
  const s = new Set(activePatients.value)
  if (s.has(id)) { s.delete(id); if (s.size === 0) showAllPatients.value = true }
  else s.add(id)
  activePatients.value = s
}

function clearPatientFilter() {
  showAllPatients.value = true
  activePatients.value = new Set()
}

function getAppointmentsForDay(dateStr) {
  return appointmentsStore.appointments
    .filter((a) => {
      if (a.date !== dateStr) return false
      if (!activeStatuses.value.has(a.status)) return false
      if (!showAllPatients.value && !activePatients.value.has(a.patientId)) return false
      return true
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

// ── Helpers ─────────────────────────────────────────────────────────
function formatISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function patientName(patientId) {
  const p = patientsStore.getPatientById(patientId)
  return p ? p.fullName : 'Desconocido'
}

function patientInitials(name) {
  const parts = name.split(' ')
  return parts.length >= 2 ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase() : parts[0].charAt(0).toUpperCase()
}

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

function statusDot(status) {
  return { confirmada: 'bg-medical-500', pendiente: 'bg-amber-400', completada: 'bg-emerald-500', en_curso: 'bg-sky-400', cancelada: 'bg-slate-400', no_show: 'bg-red-400' }[status] || 'bg-slate-400'
}

function getStatusInfo(status) {
  const map = {
    confirmada: { label: 'Confirmada', color: 'text-medical-600', dot: 'bg-medical-500', bg: 'bg-medical-50' },
    pendiente: { label: 'Pendiente', color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50' },
    completada: { label: 'Completada', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
    en_curso: { label: 'En curso', color: 'text-sky-600', dot: 'bg-sky-400', bg: 'bg-sky-50' },
    cancelada: { label: 'Cancelada', color: 'text-muted-foreground', dot: 'bg-slate-400', bg: 'bg-muted' },
    no_show: { label: 'No asistió', color: 'text-red-500', dot: 'bg-red-400', bg: 'bg-red-50' },
  }
  return map[status] || { label: status, color: 'text-muted-foreground', dot: 'bg-slate-400', bg: 'bg-muted' }
}

function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${monthNamesShort[parseInt(m) - 1]} ${y}`
}

function formatDayName(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][d.getDay()]
}

// ── Hover popover (with motion) ─────────────────────────────────────
const hoveredApt = ref(null)
const popoverPos = ref({ x: 0, y: 0, w: 0 })
const popoverRef = ref(null)
let hoverTimeout = null

function handleChipMouseEnter(apt, event) {
  if (selectedAppointment.value) return
  clearTimeout(hoverTimeout)
  const rect = event.currentTarget.getBoundingClientRect()
  popoverPos.value = {
    x: rect.left,
    y: rect.bottom + 6,
    w: Math.max(rect.width, 240),
  }
  hoveredApt.value = apt
  nextTick(() => {
    if (popoverRef.value) {
      animate(popoverRef.value, { opacity: [0, 1], y: [-8, 0], scale: [0.95, 1] }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] })
    }
  })
}

function handleChipMouseLeave() {
  hoverTimeout = setTimeout(() => {
    if (popoverRef.value) {
      animate(popoverRef.value, { opacity: 0, y: -4, scale: 0.97 }, { duration: 0.12 }).then(() => {
        hoveredApt.value = null
      })
    } else {
      hoveredApt.value = null
    }
  }, 120)
}

function handlePopoverEnter() {
  clearTimeout(hoverTimeout)
}

function handlePopoverLeave() {
  if (popoverRef.value) {
    animate(popoverRef.value, { opacity: 0, y: -4, scale: 0.97 }, { duration: 0.12 }).then(() => {
      hoveredApt.value = null
    })
  } else {
    hoveredApt.value = null
  }
}

// ── Expanding dialog (with motion, App Store style) ─────────────────
const selectedAppointment = ref(null)
const dialogOpen = ref(false)
const backdropRef = ref(null)
const dialogCardRef = ref(null)
const clickRect = ref({ x: 0, y: 0, w: 0, h: 0 })

function openDetail(apt, event) {
  // Dismiss popover
  hoveredApt.value = null
  clearTimeout(hoverTimeout)

  // Capture chip position
  const rect = event.currentTarget.getBoundingClientRect()
  clickRect.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    w: rect.width,
    h: rect.height,
  }

  selectedAppointment.value = apt
  dialogOpen.value = true

  nextTick(() => {
    // Calculate transform origin from click position
    const vw = window.innerWidth
    const vh = window.innerHeight
    const originX = (clickRect.value.x / vw) * 100
    const originY = (clickRect.value.y / vh) * 100

    if (backdropRef.value) {
      animate(backdropRef.value, { opacity: [0, 1] }, { duration: 0.25 })
    }

    if (dialogCardRef.value) {
      dialogCardRef.value.style.transformOrigin = `${originX}% ${originY}%`
      animate(
        dialogCardRef.value,
        {
          opacity: [0, 1],
          scale: [0.3, 1],
          y: [20, 0],
        },
        { duration: 0.4, easing: [0.16, 1, 0.3, 1] }
      )
    }
  })
}

function closeDetail() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const originX = (clickRect.value.x / vw) * 100
  const originY = (clickRect.value.y / vh) * 100

  if (backdropRef.value) {
    animate(backdropRef.value, { opacity: 0 }, { duration: 0.2 })
  }

  if (dialogCardRef.value) {
    dialogCardRef.value.style.transformOrigin = `${originX}% ${originY}%`
    animate(
      dialogCardRef.value,
      { opacity: 0, scale: 0.3, y: 10 },
      { duration: 0.25, easing: [0.4, 0, 1, 1] }
    ).then(() => {
      dialogOpen.value = false
      selectedAppointment.value = null
    })
  } else {
    dialogOpen.value = false
    selectedAppointment.value = null
  }
}

const terminalStatuses = ['completada', 'cancelada', 'no_show']
function isTerminal(status) { return terminalStatuses.includes(status) }

function updateStatus(newStatus) {
  if (selectedAppointment.value) {
    appointmentsStore.updateStatus(selectedAppointment.value.id, newStatus)
    selectedAppointment.value = { ...selectedAppointment.value, status: newStatus }
  }
}

onUnmounted(() => clearTimeout(hoverTimeout))
</script>

<template>
  <div class="h-full flex flex-col p-5 sm:p-6 lg:p-7">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 flex-shrink-0">
      <div class="flex items-center gap-3">
        <h1 class="text-[1.65rem] font-extrabold text-foreground tracking-tight">{{ headerTitle }}</h1>
        <div class="flex items-center gap-1">
          <button class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" @click="prevMonth"><ChevronLeft class="w-4 h-4" /></button>
          <button class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" @click="nextMonth"><ChevronRight class="w-4 h-4" /></button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" @click="goToToday">Hoy</button>
        <div class="flex items-center bg-muted/80 rounded-lg p-0.5">
          <button
            v-for="mode in [{ value: 'month', label: 'Mes' }, { value: 'week', label: 'Semana' }]"
            :key="mode.value"
            class="px-3 py-1.5 text-[12px] font-medium rounded-md transition-all"
            :class="viewMode === mode.value ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
            @click="viewMode = mode.value"
          >{{ mode.label }}</button>
        </div>
      </div>
    </div>

    <!-- Main layout -->
    <div class="flex-1 min-h-0 flex gap-5">

      <!-- ═══ LEFT SIDEBAR ═══ -->
      <div class="hidden lg:flex w-[220px] flex-col gap-5 flex-shrink-0 overflow-y-auto">
        <!-- Mini calendar -->
        <div class="bg-white border border-border rounded-2xl shadow-card p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-[13px] font-bold text-foreground">{{ monthNames[currentMonth] }} {{ currentYear }}</p>
            <div class="flex items-center gap-0.5">
              <button class="p-1 rounded-md hover:bg-muted text-muted-foreground" @click="prevMonth"><ChevronLeft class="w-3 h-3" /></button>
              <button class="p-1 rounded-md hover:bg-muted text-muted-foreground" @click="nextMonth"><ChevronRight class="w-3 h-3" /></button>
            </div>
          </div>
          <div class="grid grid-cols-7 mb-1">
            <div v-for="d in dayNamesShort" :key="d" class="text-center text-[9px] font-semibold text-muted-foreground uppercase py-1">{{ d }}</div>
          </div>
          <div class="grid grid-cols-7">
            <button
              v-for="(d, idx) in miniCalendarDays" :key="idx"
              class="w-full aspect-square flex items-center justify-center text-[11px] rounded-md transition-all"
              :class="[d.current ? 'text-foreground' : 'text-muted-foreground/40', isToday(d.date) ? 'bg-medical-600 text-white font-bold' : 'hover:bg-muted']"
              @click="selectMiniDate(d)"
            >{{ d.day }}</button>
          </div>
        </div>

        <!-- Status filters -->
        <div class="bg-white border border-border rounded-2xl shadow-card p-4">
          <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Estado</p>
          <div class="space-y-1.5">
            <button
              v-for="s in statusFilters" :key="s.value"
              class="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-[12px] font-medium transition-all"
              :class="activeStatuses.has(s.value) ? 'text-foreground' : 'text-muted-foreground/40'"
              @click="toggleStatus(s.value)"
            >
              <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-opacity" :class="[s.dot, activeStatuses.has(s.value) ? 'opacity-100' : 'opacity-30']"></span>
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Patient filters -->
        <div class="bg-white border border-border rounded-2xl shadow-card p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pacientes</p>
            <button v-if="!showAllPatients" class="text-[10px] font-medium text-medical-600 hover:text-medical-700" @click="clearPatientFilter">Todos</button>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="p in patientsList" :key="p.id"
              class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all"
              :class="showAllPatients || activePatients.has(p.id) ? 'bg-white border-border text-foreground hover:border-border' : 'bg-muted border-transparent text-muted-foreground/40'"
              @click="togglePatient(p.id)"
            >
              <div class="w-4 h-4 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[6px] font-bold flex-shrink-0" :class="!showAllPatients && !activePatients.has(p.id) ? 'opacity-30' : ''">{{ patientInitials(p.fullName) }}</div>
              <span class="truncate max-w-[70px]">{{ p.fullName.split(' ')[0] }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ MAIN CALENDAR GRID ═══ -->
      <div class="flex-1 min-w-0 bg-white border border-border rounded-2xl shadow-card flex flex-col overflow-hidden">
        <div class="grid grid-cols-7 border-b border-border/60 flex-shrink-0">
          <div v-for="d in dayNames" :key="d" class="text-center py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{{ d }}</div>
        </div>
        <div class="flex-1 min-h-0 flex flex-col">
          <div v-for="(week, wIdx) in weekRows" :key="wIdx" class="grid grid-cols-7 flex-1 min-h-0" :class="wIdx < weekRows.length - 1 ? 'border-b border-border/40' : ''">
            <div
              v-for="(day, dIdx) in week" :key="dIdx"
              class="p-1.5 overflow-hidden flex flex-col"
              :class="[dIdx < 6 ? 'border-r border-border/40' : '', day.current ? '' : 'bg-muted/40']"
            >
              <p class="text-[11px] font-medium mb-0.5 px-0.5" :class="day.current ? 'text-foreground' : 'text-muted-foreground/40'">{{ day.day }}</p>
              <div class="flex-1 min-h-0 overflow-hidden space-y-0.5">
                <button
                  v-for="apt in getAppointmentsForDay(day.dateStr).slice(0, 3)" :key="apt.id"
                  class="w-full flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-left truncate hover:opacity-80 transition-opacity"
                  :class="[
                    apt.status === 'confirmada' ? 'bg-medical-50 text-medical-700' :
                    apt.status === 'pendiente' ? 'bg-amber-50 text-amber-700' :
                    apt.status === 'completada' ? 'bg-emerald-50 text-emerald-700' :
                    apt.status === 'cancelada' ? 'bg-muted text-muted-foreground' :
                    apt.status === 'no_show' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'
                  ]"
                  @mouseenter="handleChipMouseEnter(apt, $event)"
                  @mouseleave="handleChipMouseLeave"
                  @click.stop="openDetail(apt, $event)"
                >
                  <span class="w-1 h-1 rounded-full flex-shrink-0" :class="statusDot(apt.status)"></span>
                  <span class="truncate">{{ serviceName(apt.serviceId) }}</span>
                </button>
                <p v-if="getAppointmentsForDay(day.dateStr).length > 3" class="text-[9px] text-medical-600 font-semibold px-1.5 cursor-pointer hover:text-medical-700">
                  +{{ getAppointmentsForDay(day.dateStr).length - 3 }} más
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ HOVER POPOVER (appears below chip, animated with motion) ═══ -->
    <Teleport to="body">
      <div
        v-if="hoveredApt && !selectedAppointment"
        ref="popoverRef"
        class="fixed z-50 pointer-events-auto"
        :style="{ left: `${popoverPos.x}px`, top: `${popoverPos.y}px`, width: `${popoverPos.w}px`, minWidth: '240px' }"
        @mouseenter="handlePopoverEnter"
        @mouseleave="handlePopoverLeave"
      >
        <!-- Arrow on top -->
        <div class="flex pl-4">
          <div class="w-2.5 h-2.5 bg-white border-l border-t border-border rotate-45 translate-y-[3px]"></div>
        </div>

        <div class="bg-white rounded-xl border border-border shadow-card shadow-border/40 p-4">
          <!-- Status pill -->
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold mb-3"
            :class="[getStatusInfo(hoveredApt.status).color, getStatusInfo(hoveredApt.status).bg]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(hoveredApt.status).dot"></span>
            {{ getStatusInfo(hoveredApt.status).label }}
          </span>

          <!-- Patient -->
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">
              {{ patientInitials(patientName(hoveredApt.patientId)) }}
            </div>
            <span class="text-[11px] text-muted-foreground">{{ patientName(hoveredApt.patientId) }}</span>
          </div>

          <!-- Service name (big) -->
          <p class="text-[14px] font-bold text-foreground leading-tight mb-1">{{ serviceName(hoveredApt.serviceId) }}</p>

          <!-- Date + time -->
          <p class="text-[11px] text-muted-foreground">
            {{ formatDayName(hoveredApt.date) }}, {{ formatDateDisplay(hoveredApt.date) }} · {{ hoveredApt.startTime }} - {{ hoveredApt.endTime }}
          </p>
        </div>
      </div>
    </Teleport>

    <!-- ═══ EXPANDING DIALOG (App Store style, animated with motion) ═══ -->
    <Teleport to="body">
      <div v-if="dialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div ref="backdropRef" class="absolute inset-0 bg-black/25 backdrop-blur-[3px]" @click="closeDetail"></div>

        <!-- Dialog card -->
        <div
          ref="dialogCardRef"
          class="relative bg-white rounded-2xl border border-border shadow-2xl shadow-border/20 w-full max-w-[420px] max-h-[85vh] overflow-y-auto z-10"
        >
          <!-- Close button -->
          <button class="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors z-20" @click="closeDetail">
            <X class="w-4 h-4" />
          </button>

          <!-- Header -->
          <div class="px-6 pt-6 pb-4">
            <h2 class="text-[17px] font-bold text-foreground">Detalle de cita</h2>
            <p class="text-[11px] text-muted-foreground mt-0.5">Información de la cita seleccionada</p>
          </div>

          <div class="px-6 pb-6 space-y-5">
            <!-- Patient card -->
            <div class="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md shadow-medical-500/20">
                {{ patientInitials(patientName(selectedAppointment.patientId)) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-semibold text-foreground">{{ patientName(selectedAppointment.patientId) }}</p>
                <p class="text-[11px] text-muted-foreground">Paciente</p>
              </div>
            </div>

            <!-- Info rows -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <Stethoscope class="w-3.5 h-3.5 text-medical-600" />
                </div>
                <div>
                  <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Servicio</p>
                  <p class="text-[13px] text-foreground font-medium">{{ serviceName(selectedAppointment.serviceId) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <CalendarDays class="w-3.5 h-3.5 text-medical-600" />
                </div>
                <div>
                  <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha</p>
                  <p class="text-[13px] text-foreground font-medium">{{ formatDayName(selectedAppointment.date) }}, {{ formatDateDisplay(selectedAppointment.date) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <Clock class="w-3.5 h-3.5 text-medical-600" />
                </div>
                <div>
                  <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Hora</p>
                  <p class="text-[13px] text-foreground font-medium">{{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</p>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Status -->
            <div>
              <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Estado actual</p>
              <span
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                :class="[getStatusInfo(selectedAppointment.status).color, getStatusInfo(selectedAppointment.status).bg]"
              >
                <span class="w-2 h-2 rounded-full" :class="getStatusInfo(selectedAppointment.status).dot" />
                {{ getStatusInfo(selectedAppointment.status).label }}
              </span>
            </div>

            <!-- Actions -->
            <div v-if="!isTerminal(selectedAppointment.status)">
              <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cambiar estado</p>
              <div class="flex flex-wrap gap-2">
                <template v-if="selectedAppointment.status === 'pendiente'">
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-medical-50 text-medical-700 border border-medical-200 hover:bg-medical-100 transition-colors" @click="updateStatus('confirmada')">Confirmar</button>
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted transition-colors" @click="updateStatus('cancelada')">Cancelar</button>
                </template>
                <template v-if="selectedAppointment.status === 'confirmada'">
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors" @click="updateStatus('en_curso')">Iniciar</button>
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted transition-colors" @click="updateStatus('cancelada')">Cancelar</button>
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors" @click="updateStatus('no_show')">No asistió</button>
                </template>
                <template v-if="selectedAppointment.status === 'en_curso'">
                  <button class="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors" @click="updateStatus('completada')">Completar</button>
                </template>
              </div>
            </div>

            <Separator />

            <!-- Patient link -->
            <router-link
              :to="`/demo/dashboard/pacientes/${selectedAppointment.patientId}`"
              @click="closeDetail"
              class="flex items-center gap-2 text-[13px] font-medium text-medical-600 hover:text-medical-700 transition-colors"
            >
              <User class="w-4 h-4" />
              Ver perfil del paciente
              <ArrowRight class="w-3.5 h-3.5 ml-auto" />
            </router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
