<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()
const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()

const search = ref('')

const filteredPatients = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return patientsStore.patients
  return patientsStore.patients.filter((p) =>
    p.fullName.toLowerCase().includes(q) ||
    p.phone.includes(q) ||
    p.email.toLowerCase().includes(q)
  )
})

function getPatientAppointments(patientId) {
  return appointmentsStore.appointments.filter((a) => a.patientId === patientId)
}

function lastAppointmentDate(patientId) {
  const apts = getPatientAppointments(patientId)
  if (apts.length === 0) return null
  const sorted = [...apts].sort((a, b) => b.date.localeCompare(a.date))
  return sorted[0].date
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function totalAppointments(patientId) {
  return getPatientAppointments(patientId).length
}

function goToPatient(id) {
  router.push(`/demo/dashboard/pacientes/${id}`)
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Pacientes</h1>
        <p class="text-sm text-slate-500 mt-1">{{ filteredPatients.length }} pacientes registrados</p>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, telefono o email..."
          class="pl-10"
        />
      </div>
    </div>

    <!-- Desktop Table -->
    <Card class="hidden md:block overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ultima cita</TableHead>
            <TableHead>Total citas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="cursor-pointer"
            @click="goToPatient(patient.id)"
          >
            <TableCell class="font-medium">{{ patient.fullName }}</TableCell>
            <TableCell>{{ patient.phone }}</TableCell>
            <TableCell>{{ patient.email }}</TableCell>
            <TableCell>{{ formatDate(lastAppointmentDate(patient.id)) }}</TableCell>
            <TableCell>
              <Badge variant="secondary">{{ totalAppointments(patient.id) }}</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Empty search -->
      <div v-if="filteredPatients.length === 0" class="py-12 text-center">
        <p class="text-slate-500 text-sm">No se encontraron pacientes con ese criterio de busqueda.</p>
      </div>
    </Card>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-3">
      <Card
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="cursor-pointer active:bg-slate-50 transition-colors"
        @click="goToPatient(patient.id)"
      >
        <CardContent class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-slate-900">{{ patient.fullName }}</h3>
            <Badge variant="secondary">{{ totalAppointments(patient.id) }} citas</Badge>
          </div>
          <div class="space-y-1">
            <p class="text-xs text-slate-500">
              <span class="font-medium text-slate-600">Tel:</span> {{ patient.phone }}
            </p>
            <p class="text-xs text-slate-500">
              <span class="font-medium text-slate-600">Email:</span> {{ patient.email }}
            </p>
            <p class="text-xs text-slate-500">
              <span class="font-medium text-slate-600">Ultima cita:</span> {{ formatDate(lastAppointmentDate(patient.id)) }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Empty search mobile -->
      <div v-if="filteredPatients.length === 0" class="py-12 text-center">
        <p class="text-slate-500 text-sm">No se encontraron pacientes.</p>
      </div>
    </div>
  </div>
</template>
