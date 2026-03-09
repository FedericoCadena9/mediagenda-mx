<script setup>
import { ref, computed } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import StatusBadge from '@/components/ui/StatusBadge.vue'

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
  { value: 'no_show', label: 'No asistio' },
]

const dateRangeOptions = [
  { value: 'esta_semana', label: 'Esta semana' },
  { value: 'este_mes', label: 'Este mes' },
  { value: 'ultimos_30', label: 'Ultimos 30 dias' },
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

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

// ── Filtered appointments ───────────────────────────────────────────
const filteredAppointments = computed(() => {
  let list = [...appointmentsStore.appointments]

  // Date range
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

  // Status
  if (statusFilter.value !== 'todos') {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  // Search by patient name
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((a) => {
      const name = patientName(a.patientId).toLowerCase()
      return name.includes(q)
    })
  }

  // Sort by date descending, then time descending
  list.sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date)
    if (dateCmp !== 0) return dateCmp
    return b.startTime.localeCompare(a.startTime)
  })

  return list
})

// ── Pagination ──────────────────────────────────────────────────────
const currentPage = ref(1)
const perPage = 10

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAppointments.value.length / perPage))
)

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredAppointments.value.slice(start, start + perPage)
})

// Reset page when filters change
function resetPage() {
  currentPage.value = 1
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// ── Format helpers ──────────────────────────────────────────────────
function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
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

function updateStatus(newStatus) {
  if (selectedAppointment.value) {
    appointmentsStore.updateStatus(selectedAppointment.value.id, newStatus)
    selectedAppointment.value = {
      ...selectedAppointment.value,
      status: newStatus,
    }
  }
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">
        Citas
        <span class="text-base font-normal text-slate-500 ml-2">
          ({{ filteredAppointments.length }})
        </span>
      </h1>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Status filter -->
          <div class="flex-1 min-w-0">
            <Label class="text-xs text-slate-500 mb-1">Estado</Label>
            <Select v-model="statusFilter" @update:model-value="resetPage">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Date range filter -->
          <div class="flex-1 min-w-0">
            <Label class="text-xs text-slate-500 mb-1">Periodo</Label>
            <Select v-model="dateRangeFilter" @update:model-value="resetPage">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Esta semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in dateRangeOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-0">
            <Label class="text-xs text-slate-500 mb-1">Buscar paciente</Label>
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                v-model="searchQuery"
                type="text"
                placeholder="Nombre del paciente..."
                class="pl-9"
                @input="resetPage"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Table -->
    <Card class="overflow-hidden">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead class="hidden sm:table-cell">Servicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="apt in paginatedAppointments"
              :key="apt.id"
              class="cursor-pointer"
            >
              <TableCell class="whitespace-nowrap">
                {{ formatDateDisplay(apt.date) }}
              </TableCell>
              <TableCell class="whitespace-nowrap">
                {{ apt.startTime }}
              </TableCell>
              <TableCell class="font-medium truncate max-w-[180px]">
                {{ patientName(apt.patientId) }}
              </TableCell>
              <TableCell class="hidden sm:table-cell truncate max-w-[160px]">
                {{ serviceName(apt.serviceId) }}
              </TableCell>
              <TableCell>
                <StatusBadge :status="apt.status" />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" class="text-cyan-600 hover:text-cyan-700 text-xs" @click="openDetail(apt)">
                  Ver detalle
                </Button>
              </TableCell>
            </TableRow>
            <TableRow v-if="paginatedAppointments.length === 0">
              <TableCell colspan="6" class="text-center py-12 text-slate-400">
                No se encontraron citas con los filtros seleccionados.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50"
      >
        <p class="text-xs text-slate-500">
          Pagina {{ currentPage }} de {{ totalPages }}
          <span class="hidden sm:inline">
            &mdash; {{ filteredAppointments.length }} citas en total
          </span>
        </p>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages"
            @click="nextPage"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Card>

    <!-- Detail Sheet -->
    <Sheet :open="showDetail" @update:open="(val) => { if (!val) closeDetail() }">
      <SheetContent side="right" class="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalle de cita</SheetTitle>
          <SheetDescription>Informacion completa de la cita</SheetDescription>
        </SheetHeader>

        <div v-if="selectedAppointment" class="space-y-5 mt-6">
          <!-- Patient -->
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Paciente</p>
            <p class="text-sm font-semibold text-slate-900">
              {{ patientName(selectedAppointment.patientId) }}
            </p>
          </div>

          <!-- Service -->
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Servicio</p>
            <p class="text-sm text-slate-700">
              {{ serviceName(selectedAppointment.serviceId) }}
            </p>
          </div>

          <Separator />

          <!-- Date & time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Fecha</p>
              <p class="text-sm text-slate-700">{{ formatDateDisplay(selectedAppointment.date) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Hora</p>
              <p class="text-sm text-slate-700">
                {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}
              </p>
            </div>
          </div>

          <!-- Source -->
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Origen</p>
            <p class="text-sm text-slate-700 capitalize">{{ selectedAppointment.source }}</p>
          </div>

          <!-- Notes -->
          <div v-if="selectedAppointment.patientNotes">
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Notas</p>
            <p class="text-sm text-slate-700">{{ selectedAppointment.patientNotes }}</p>
          </div>

          <Separator />

          <!-- Status -->
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Estado</p>
            <StatusBadge :status="selectedAppointment.status" />
          </div>

          <!-- Actions -->
          <div v-if="!isTerminal(selectedAppointment.status)">
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Cambiar estado</p>
            <div class="flex flex-wrap gap-2">
              <template v-if="selectedAppointment.status === 'pendiente'">
                <Button variant="outline" size="sm" class="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" @click="updateStatus('confirmada')">
                  Confirmar
                </Button>
                <Button variant="outline" size="sm" @click="updateStatus('cancelada')">
                  Cancelar
                </Button>
              </template>
              <template v-if="selectedAppointment.status === 'confirmada'">
                <Button variant="outline" size="sm" class="bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" @click="updateStatus('en_curso')">
                  Iniciar
                </Button>
                <Button variant="outline" size="sm" @click="updateStatus('cancelada')">
                  Cancelar
                </Button>
                <Button variant="outline" size="sm" class="bg-red-50 text-red-700 border-red-200 hover:bg-red-100" @click="updateStatus('no_show')">
                  No asistio
                </Button>
              </template>
              <template v-if="selectedAppointment.status === 'en_curso'">
                <Button variant="outline" size="sm" class="bg-green-50 text-green-700 border-green-200 hover:bg-green-100" @click="updateStatus('completada')">
                  Completar
                </Button>
              </template>
            </div>
          </div>

          <Separator />

          <!-- Patient link -->
          <div>
            <router-link
              :to="`/demo/dashboard/pacientes/${selectedAppointment.patientId}`"
              @click="closeDetail"
            >
              <Button variant="ghost" size="sm" class="text-cyan-600 hover:text-cyan-700 gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ver perfil del paciente
              </Button>
            </router-link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
