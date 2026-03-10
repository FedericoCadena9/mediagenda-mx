<script setup>
import { ref, computed, watch } from 'vue'
import { motion } from 'motion-v'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  MoreVertical,
  CalendarCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  Stethoscope,
  CalendarDays,
  MapPin,
  FileText,
  ArrowRight,
  X,
} from 'lucide-vue-next'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const servicesStore = useServicesStore()

// ── Filters ─────────────────────────────────────────────────────────
const statusFilter = ref('todos')
const dateRangeFilter = ref('esta_semana')
const searchQuery = ref('')

const statusOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'no_show', label: 'No asistió' },
]

const dateRangeOptions = [
  { value: 'esta_semana', label: 'Esta semana' },
  { value: 'este_mes', label: 'Este mes' },
  { value: 'ultimos_30', label: 'Últimos 30 días' },
  { value: 'todos', label: 'Todos' },
]

// ── Date helpers ────────────────────────────────────────────────────
function formatISO(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getMondayOfWeek(d) {
  const copy = new Date(d)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return copy
}

function addDays(d, n) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

// ── Lookup helpers ──────────────────────────────────────────────────
function patientName(patientId) {
  const p = patientsStore.getPatientById(patientId)
  return p ? p.fullName : 'Paciente desconocido'
}

function patientInitials(patientId) {
  const name = patientName(patientId)
  const parts = name.split(' ')
  return parts.length >= 2
    ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    : parts[0].charAt(0).toUpperCase()
}

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

// ── Filtered appointments ───────────────────────────────────────────
const filteredAppointments = computed(() => {
  let list = [...appointmentsStore.appointments]

  const now = new Date()
  if (dateRangeFilter.value === 'esta_semana') {
    const mon = getMondayOfWeek(now)
    const sun = addDays(mon, 6)
    const monStr = formatISO(mon)
    const sunStr = formatISO(sun)
    list = list.filter((a) => a.date >= monStr && a.date <= sunStr)
  } else if (dateRangeFilter.value === 'este_mes') {
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const prefix = `${yyyy}-${mm}`
    list = list.filter((a) => a.date.startsWith(prefix))
  } else if (dateRangeFilter.value === 'ultimos_30') {
    const cutoff = formatISO(addDays(now, -30))
    list = list.filter((a) => a.date >= cutoff)
  }

  if (statusFilter.value !== 'todos') {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((a) => {
      const name = patientName(a.patientId).toLowerCase()
      return name.includes(q)
    })
  }

  list.sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date)
    if (dateCmp !== 0) return dateCmp
    return b.startTime.localeCompare(a.startTime)
  })

  return list
})

// ── Stats ───────────────────────────────────────────────────────────
const stats = computed(() => {
  const all = filteredAppointments.value
  const confirmed = all.filter((a) => a.status === 'confirmada').length
  const pending = all.filter((a) => a.status === 'pendiente').length
  const completed = all.filter((a) => a.status === 'completada').length
  const cancelled = all.filter((a) => a.status === 'cancelada' || a.status === 'no_show').length
  return { confirmed, pending, completed, cancelled }
})

// ── Pagination ──────────────────────────────────────────────────────
const currentPage = ref(1)
const perPage = 8

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAppointments.value.length / perPage))
)

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredAppointments.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

watch([statusFilter, dateRangeFilter, searchQuery], () => {
  currentPage.value = 1
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(p) {
  if (typeof p === 'number') currentPage.value = p
}

// ── Format helpers ──────────────────────────────────────────────────
function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function formatDayName(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
  return days[d.getDay()]
}

function getStatusInfo(status) {
  const map = {
    confirmada: { label: 'Confirmada', color: 'text-medical-600', dot: 'bg-medical-500', bg: 'bg-medical-50' },
    pendiente: { label: 'Pendiente', color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50' },
    completada: { label: 'Completada', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
    en_curso: { label: 'En curso', color: 'text-sky-600', dot: 'bg-sky-400', bg: 'bg-sky-50' },
    cancelada: { label: 'Cancelada', color: 'text-muted-foreground', dot: 'bg-muted-foreground/60', bg: 'bg-muted' },
    no_show: { label: 'No asistió', color: 'text-red-500', dot: 'bg-red-400', bg: 'bg-red-50' },
  }
  return map[status] || { label: status, color: 'text-muted-foreground', dot: 'bg-muted-foreground/60', bg: 'bg-muted' }
}

// ── Detail drawer ───────────────────────────────────────────────────
const selectedAppointment = ref(null)
const showDetail = ref(false)

function openDetail(apt) {
  selectedAppointment.value = apt
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  selectedAppointment.value = null
}

const terminalStatuses = ['completada', 'cancelada', 'no_show']

function isTerminal(status) {
  return terminalStatuses.includes(status)
}

const statusConfirmLabels = {
  confirmada: 'confirmar',
  en_curso: 'iniciar',
  completada: 'completar',
  cancelada: 'cancelar',
  no_show: 'marcar como no asistió',
}

function updateStatus(newStatus) {
  if (!selectedAppointment.value) return
  const label = statusConfirmLabels[newStatus] || newStatus
  if (!window.confirm(`¿Seguro que deseas ${label} esta cita?`)) return
  appointmentsStore.updateStatus(selectedAppointment.value.id, newStatus)
  selectedAppointment.value = {
    ...selectedAppointment.value,
    status: newStatus,
  }
}

</script>

<template>
  <div class="md:h-full md:flex md:flex-col p-4 sm:p-6 lg:p-7 space-y-4 md:space-y-0">

    <!-- Header -->
    <motion.div
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 md:mb-5 flex-shrink-0"
    >
      <div>
        <h1 class="text-[1.4rem] sm:text-[1.65rem] font-extrabold text-foreground tracking-tight">Citas</h1>
        <p class="mt-0.5 text-[12px] sm:text-[13px] text-muted-foreground">{{ filteredAppointments.length }} citas encontradas</p>
      </div>

      <!-- Quick stats (inline) -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 text-[12px]">
          <span class="w-1.5 h-1.5 rounded-full bg-medical-500"></span>
          <span class="text-muted-foreground">{{ stats.confirmed }}</span>
          <span class="text-muted-foreground/60">conf.</span>
        </div>
        <div class="flex items-center gap-1.5 text-[12px]">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span class="text-muted-foreground">{{ stats.pending }}</span>
          <span class="text-muted-foreground/60">pend.</span>
        </div>
        <div class="flex items-center gap-1.5 text-[12px]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-muted-foreground">{{ stats.completed }}</span>
          <span class="text-muted-foreground/60">comp.</span>
        </div>
      </div>
    </motion.div>

    <!-- Inline filters bar -->
    <motion.div
      :initial="{ opacity: 0, y: 6 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }"
      class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 md:mb-5 flex-shrink-0"
    >
      <!-- Period pills -->
      <div class="flex items-center bg-muted rounded-lg p-0.5 flex-shrink-0">
        <button
          v-for="opt in dateRangeOptions"
          :key="opt.value"
          class="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-medium rounded-md transition-all whitespace-nowrap"
          :class="dateRangeFilter === opt.value
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'"
          @click="dateRangeFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Status chip filters — horizontal scroll on mobile -->
      <div class="flex items-center gap-1.5 sm:ml-1 overflow-x-auto scrollbar-hide pb-0.5">
        <button
          v-for="opt in statusOptions.filter(o => o.value !== 'todos')"
          :key="opt.value"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-[12px] font-medium rounded-lg border transition-all whitespace-nowrap flex-shrink-0"
          :class="statusFilter === opt.value
            ? 'bg-foreground text-white border-foreground'
            : 'bg-white text-muted-foreground border-border hover:border-border hover:text-foreground'"
          @click="statusFilter = statusFilter === opt.value ? 'todos' : opt.value"
        >
          {{ opt.label }}
          <X v-if="statusFilter === opt.value" class="w-3 h-3" />
        </button>
      </div>
    </motion.div>

    <!-- Table card -->
    <motion.div
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }"
      class="md:flex-1 md:min-h-0 bg-white border border-border rounded-xl sm:rounded-2xl shadow-card flex flex-col"
    >

      <!-- Table header bar -->
      <div class="flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3 flex-shrink-0">
        <h3 class="text-[14px] sm:text-[15px] font-bold text-foreground">Lista de citas</h3>
        <div class="flex items-center gap-2">
          <div class="relative">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar paciente..."
              class="h-8 pl-8 pr-3 text-xs bg-muted border border-border rounded-lg outline-none focus:border-medical-400 focus:ring-1 focus:ring-medical-400/20 transition-all w-36 sm:w-48"
            />
          </div>
          <button class="text-muted-foreground/40 hover:text-muted-foreground p-1 transition-colors hidden sm:block">
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="md:flex-1 md:min-h-0 md:overflow-auto px-5 hidden md:block">
        <table class="w-full text-[13px]">
          <thead class="sticky top-0 bg-white z-10">
            <tr class="border-b border-border/60">
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Paciente</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Fecha</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Hora</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Servicio</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Estado</th>
              <th class="py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="apt in paginatedAppointments"
              :key="apt.id"
              class="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors cursor-pointer group"
              @click="openDetail(apt)"
            >
              <!-- Patient with avatar -->
              <td class="py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {{ patientInitials(apt.patientId) }}
                  </div>
                  <span class="font-semibold text-foreground">{{ patientName(apt.patientId) }}</span>
                </div>
              </td>

              <!-- Date -->
              <td class="py-3">
                <p class="text-foreground font-medium text-xs">{{ formatDateDisplay(apt.date) }}</p>
                <p class="text-muted-foreground text-[11px] capitalize">{{ formatDayName(apt.date) }}</p>
              </td>

              <!-- Time -->
              <td class="py-3">
                <span class="text-foreground font-medium text-xs">{{ apt.startTime }}</span>
                <span class="text-muted-foreground text-[11px] ml-1">- {{ apt.endTime }}</span>
              </td>

              <!-- Service -->
              <td class="py-3 text-muted-foreground text-xs">
                {{ serviceName(apt.serviceId) }}
              </td>

              <!-- Status -->
              <td class="py-3">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold" :class="getStatusInfo(apt.status).color">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(apt.status).dot" />
                  {{ getStatusInfo(apt.status).label }}
                </span>
              </td>

              <!-- Action -->
              <td class="py-3">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-1.5 rounded-lg text-muted-foreground/70 hover:text-medical-600 hover:bg-medical-50 transition-colors" @click.stop="openDetail(apt)">
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty -->
        <div v-if="filteredAppointments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-4">
            <CalendarCheck class="w-6 h-6 text-medical-500" />
          </div>
          <p class="text-sm font-medium text-foreground">Sin resultados</p>
          <p class="text-xs text-muted-foreground mt-0.5">No se encontraron citas con los filtros seleccionados</p>
        </div>
      </div>

      <!-- Mobile card list -->
      <div class="px-4 sm:px-5 md:hidden space-y-2 pb-4">
        <div
          v-for="apt in paginatedAppointments"
          :key="apt.id"
          class="rounded-xl border border-border/60 shadow-card p-3 active:bg-muted transition-colors cursor-pointer overflow-hidden"
          @click="openDetail(apt)"
        >
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {{ patientInitials(apt.patientId) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-foreground truncate">{{ patientName(apt.patientId) }}</p>
              <p class="text-[11px] text-muted-foreground">{{ serviceName(apt.serviceId) }}</p>
            </div>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold flex-shrink-0" :class="getStatusInfo(apt.status).color">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(apt.status).dot" />
              {{ getStatusInfo(apt.status).label }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-[11px] text-muted-foreground pl-11">
            <span>{{ formatDateDisplay(apt.date) }}</span>
            <span>{{ apt.startTime }} - {{ apt.endTime }}</span>
          </div>
        </div>

        <div v-if="filteredAppointments.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <p class="text-sm text-muted-foreground">Sin resultados</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 px-5 py-3 border-t border-border/60 flex-shrink-0">
        <button
          class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
          Anterior
        </button>

        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === '...'" class="px-1 text-xs text-muted-foreground">...</span>
          <button
            v-else
            class="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors"
            :class="page === currentPage
              ? 'bg-medical-600 text-white'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Siguiente
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>

    <!-- Detail Sheet -->
    <Sheet :open="showDetail" @update:open="(val) => { if (!val) closeDetail() }">
      <SheetContent side="right" class="w-full max-w-md overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle class="text-lg font-bold text-foreground">Detalle de cita</SheetTitle>
          <SheetDescription class="text-xs text-muted-foreground">Información completa de la cita seleccionada</SheetDescription>
        </SheetHeader>

        <div v-if="selectedAppointment" class="space-y-5 mt-6">
          <!-- Patient card -->
          <div class="flex items-center gap-3 p-4 bg-muted rounded-xl">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ patientInitials(selectedAppointment.patientId) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-foreground">{{ patientName(selectedAppointment.patientId) }}</p>
              <p class="text-[11px] text-muted-foreground">Paciente</p>
            </div>
          </div>

          <!-- Info grid -->
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Stethoscope class="w-3.5 h-3.5 text-medical-600" />
              </div>
              <div>
                <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Servicio</p>
                <p class="text-[13px] text-foreground font-medium">{{ serviceName(selectedAppointment.serviceId) }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CalendarDays class="w-3.5 h-3.5 text-medical-600" />
              </div>
              <div>
                <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha</p>
                <p class="text-[13px] text-foreground font-medium">{{ formatDateDisplay(selectedAppointment.date) }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock class="w-3.5 h-3.5 text-medical-600" />
              </div>
              <div>
                <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Hora</p>
                <p class="text-[13px] text-foreground font-medium">{{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin class="w-3.5 h-3.5 text-medical-600" />
              </div>
              <div>
                <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Origen</p>
                <p class="text-[13px] text-foreground font-medium capitalize">{{ selectedAppointment.source }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedAppointment.patientNotes" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText class="w-3.5 h-3.5 text-medical-600" />
            </div>
            <div>
              <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Notas</p>
              <p class="text-[13px] text-foreground">{{ selectedAppointment.patientNotes }}</p>
            </div>
          </div>

          <Separator />

          <!-- Status -->
          <div>
            <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Estado actual</p>
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
            <p class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cambiar estado</p>
            <div class="flex flex-wrap gap-2">
              <template v-if="selectedAppointment.status === 'pendiente'">
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-medical-50 text-medical-700 border border-medical-200 hover:bg-medical-100 transition-colors"
                  @click="updateStatus('confirmada')"
                >
                  Confirmar
                </button>
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted transition-colors"
                  @click="updateStatus('cancelada')"
                >
                  Cancelar
                </button>
              </template>
              <template v-if="selectedAppointment.status === 'confirmada'">
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                  @click="updateStatus('en_curso')"
                >
                  Iniciar
                </button>
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted transition-colors"
                  @click="updateStatus('cancelada')"
                >
                  Cancelar
                </button>
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                  @click="updateStatus('no_show')"
                >
                  No asistió
                </button>
              </template>
              <template v-if="selectedAppointment.status === 'en_curso'">
                <button
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  @click="updateStatus('completada')"
                >
                  Completar
                </button>
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
      </SheetContent>
    </Sheet>
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
</style>
