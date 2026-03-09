<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const servicesStore = useServicesStore()

// ── Slide-over state ────────────────────────────────────────────────
const selectedAppointment = ref(null)
const showSlideOver = ref(false)

function openSlideOver(apt) {
  selectedAppointment.value = apt
  showSlideOver.value = true
}

function closeSlideOver() {
  showSlideOver.value = false
  selectedAppointment.value = null
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

// ── Status colors ───────────────────────────────────────────────────
const statusColorMap = {
  pendiente: '#F59E0B',
  confirmada: '#3B82F6',
  en_curso: '#06B6D4',
  completada: '#16A34A',
  cancelada: '#9CA3AF',
  no_show: '#DC2626',
}

// ── Map appointments to FullCalendar events ─────────────────────────
const calendarEvents = computed(() => {
  return appointmentsStore.appointments.map((apt) => {
    const pName = patientName(apt.patientId)
    const sName = serviceName(apt.serviceId)
    const color = statusColorMap[apt.status] || '#6B7280'
    return {
      id: apt.id,
      title: `${pName} - ${sName}`,
      start: `${apt.date}T${apt.startTime}:00`,
      end: `${apt.date}T${apt.endTime}:00`,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        appointment: apt,
      },
    }
  })
})

// ── Responsive view toggle ──────────────────────────────────────────
const isMobile = ref(window.innerWidth < 768)
const calendarRef = ref(null)

function handleResize() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 768
  if (wasMobile !== isMobile.value && calendarRef.value) {
    const api = calendarRef.value.getApi()
    api.changeView(isMobile.value ? 'timeGridDay' : 'timeGridWeek')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// ── Event click handler ─────────────────────────────────────────────
function handleEventClick(info) {
  const apt = info.event.extendedProps.appointment
  openSlideOver(apt)
}

// ── Calendar options ────────────────────────────────────────────────
const calendarOptions = computed(() => ({
  plugins: [timeGridPlugin, dayGridPlugin],
  initialView: isMobile.value ? 'timeGridDay' : 'timeGridWeek',
  locale: 'es',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: isMobile.value ? 'timeGridDay,listWeek' : 'timeGridWeek,timeGridDay',
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  businessHours: [
    { daysOfWeek: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '14:00' },
    { daysOfWeek: [1, 2, 3, 4, 5], startTime: '16:00', endTime: '20:00' },
  ],
  events: calendarEvents.value,
  eventClick: handleEventClick,
  height: 'auto',
  allDaySlot: false,
  nowIndicator: true,
  slotDuration: '00:30:00',
  expandRows: true,
  dayHeaderFormat: { weekday: 'short', day: 'numeric', month: 'short' },
}))

// ── Status change for slide-over ────────────────────────────────────
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

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Calendario</h1>
      <p class="mt-1 text-sm text-slate-500">Vista semanal de tus citas</p>
    </div>

    <!-- Calendar -->
    <Card>
      <CardContent class="p-2 sm:p-4">
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
      </CardContent>
    </Card>

    <!-- Sheet slide-over -->
    <Sheet :open="showSlideOver" @update:open="(val) => { if (!val) closeSlideOver() }">
      <SheetContent side="right" class="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalle de cita</SheetTitle>
          <SheetDescription>Informacion de la cita seleccionada</SheetDescription>
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
              <p class="text-sm text-slate-700">{{ formatDate(selectedAppointment.date) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Hora</p>
              <p class="text-sm text-slate-700">
                {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}
              </p>
            </div>
          </div>

          <Separator />

          <!-- Status -->
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Estado</p>
            <StatusBadge :status="selectedAppointment.status" />
          </div>

          <!-- Actions -->
          <div v-if="!isTerminal(selectedAppointment.status)">
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Acciones</p>
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
              @click="closeSlideOver"
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
