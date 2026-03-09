<script setup>
import { computed } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import StatsCard from '@/components/ui/StatsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import RiskBadge from '@/components/ui/RiskBadge.vue'
import { useNoShowRisk } from '@/composables/useNoShowRisk'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const servicesStore = useServicesStore()

// ── Greeting based on current hour ──────────────────────────────────
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour <= 11) return 'Buenos dias'
  if (hour >= 12 && hour <= 19) return 'Buenas tardes'
  return 'Buenas noches'
})

// ── Formatted date in Spanish ───────────────────────────────────────
const formattedDate = computed(() => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  const now = new Date()
  const dayName = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  return `${dayName} ${day} de ${month}, ${year}`
})

// ── Today helpers ───────────────────────────────────────────────────
const todayAppointments = computed(() => {
  return appointmentsStore.todayAppointments
})

// ── Stats ───────────────────────────────────────────────────────────
const citasHoy = computed(() => todayAppointments.value.length)

const confirmadas = computed(() =>
  todayAppointments.value.filter((a) => a.status === 'confirmada').length
)

const pendientes = computed(() =>
  todayAppointments.value.filter((a) => a.status === 'pendiente').length
)

const completadasSemana = computed(() =>
  appointmentsStore.thisWeekAppointments.filter((a) => a.status === 'completada').length
)

// ── Lookup helpers ──────────────────────────────────────────────────
function patientName(patientId) {
  const p = patientsStore.getPatientById(patientId)
  return p ? p.fullName : 'Paciente desconocido'
}

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

// ── Status update handler ───────────────────────────────────────────
const terminalStatuses = ['completada', 'cancelada', 'no_show']

function isTerminal(status) {
  return terminalStatuses.includes(status)
}

function handleUpdateStatus(appointmentId, newStatus) {
  appointmentsStore.updateStatus(appointmentId, newStatus)
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Greeting -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
        {{ greeting }}, Dr. Mendoza
      </h1>
      <p class="mt-1 text-sm text-slate-500">{{ formattedDate }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard title="Citas hoy" :value="citasHoy" icon="&#x1F4C5;" color="cyan" />
      <StatsCard title="Confirmadas" :value="confirmadas" icon="&#x2705;" color="blue" />
      <StatsCard title="Pendientes" :value="pendientes" icon="&#x23F3;" color="amber" />
      <StatsCard title="Completadas esta semana" :value="completadasSemana" icon="&#x2714;&#xFE0F;" color="green" />
    </div>

    <!-- Today's Appointments -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Citas de hoy</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Appointment list -->
        <div v-if="todayAppointments.length > 0" class="space-y-3">
          <div
            v-for="apt in todayAppointments"
            :key="apt.id"
            class="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
          >
            <!-- Time -->
            <div class="flex-shrink-0 text-sm font-semibold text-slate-700 w-16">
              {{ apt.startTime }}
            </div>

            <!-- Patient & Service -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ patientName(apt.patientId) }}</p>
              <p class="text-xs text-slate-500 truncate">{{ serviceName(apt.serviceId) }}</p>
            </div>

            <!-- Badges -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <StatusBadge :status="apt.status" />
            </div>

            <!-- Action Buttons -->
            <div v-if="!isTerminal(apt.status)" class="flex items-center gap-2 flex-shrink-0">
              <template v-if="apt.status === 'pendiente'">
                <Button variant="outline" size="sm" class="text-xs h-7 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" @click="handleUpdateStatus(apt.id, 'confirmada')">
                  Confirmar
                </Button>
                <Button variant="outline" size="sm" class="text-xs h-7" @click="handleUpdateStatus(apt.id, 'cancelada')">
                  Cancelar
                </Button>
              </template>
              <template v-if="apt.status === 'confirmada'">
                <Button variant="outline" size="sm" class="text-xs h-7 bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" @click="handleUpdateStatus(apt.id, 'en_curso')">
                  Iniciar
                </Button>
                <Button variant="outline" size="sm" class="text-xs h-7" @click="handleUpdateStatus(apt.id, 'cancelada')">
                  Cancelar
                </Button>
                <Button variant="outline" size="sm" class="text-xs h-7 bg-red-50 text-red-700 border-red-200 hover:bg-red-100" @click="handleUpdateStatus(apt.id, 'no_show')">
                  No asistio
                </Button>
              </template>
              <template v-if="apt.status === 'en_curso'">
                <Button variant="outline" size="sm" class="text-xs h-7 bg-green-50 text-green-700 border-green-200 hover:bg-green-100" @click="handleUpdateStatus(apt.id, 'completada')">
                  Completar
                </Button>
              </template>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg
              class="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="text-slate-500 text-sm">No tienes citas programadas para hoy</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
