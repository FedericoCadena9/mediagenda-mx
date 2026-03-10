<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-vue-next'

const router = useRouter()
const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()

const search = ref('')
const currentPage = ref(1)
const perPage = 8

const filteredPatients = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return patientsStore.patients
  return patientsStore.patients.filter((p) =>
    p.fullName.toLowerCase().includes(q) ||
    p.phone.includes(q) ||
    p.email.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredPatients.value.length / perPage))

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPatients.value.slice(start, start + perPage)
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

function getPatientAppointments(patientId) {
  return appointmentsStore.appointments.filter((a) => a.patientId === patientId)
}

function lastAppointmentInfo(patientId) {
  const apts = getPatientAppointments(patientId)
  if (apts.length === 0) return null
  const sorted = [...apts].sort((a, b) => b.date.localeCompare(a.date))
  return sorted[0]
}

function formatDateTime(apt) {
  if (!apt) return { time: '—', date: '—' }
  const [y, m, d] = apt.date.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return {
    time: apt.startTime || '—',
    date: `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`,
  }
}

function getServiceName(apt) {
  if (!apt) return '—'
  const s = servicesStore.getServiceById(apt.serviceId)
  return s ? s.name : 'Consulta'
}

function totalAppointments(patientId) {
  return getPatientAppointments(patientId).length
}

function getStatus(patientId) {
  const apt = lastAppointmentInfo(patientId)
  if (!apt) return { label: 'Sin citas', color: 'text-muted-foreground/70', dot: 'bg-muted-foreground/40' }
  const map = {
    confirmada: { label: 'Confirmada', color: 'text-medical-600', dot: 'bg-medical-500' },
    pendiente: { label: 'Pendiente', color: 'text-amber-600', dot: 'bg-amber-400' },
    completada: { label: 'Completada', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    en_curso: { label: 'En curso', color: 'text-sky-600', dot: 'bg-sky-400' },
    cancelada: { label: 'Cancelada', color: 'text-red-500', dot: 'bg-red-400' },
    no_show: { label: 'No asistió', color: 'text-red-500', dot: 'bg-red-400' },
  }
  return map[apt.status] || { label: apt.status, color: 'text-muted-foreground', dot: 'bg-muted-foreground/70' }
}

function patientInitials(name) {
  const parts = name.split(' ')
  return parts.length >= 2
    ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    : parts[0].charAt(0).toUpperCase()
}

function goToPatient(id) {
  router.push(`/demo/dashboard/pacientes/${id}`)
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(p) {
  if (typeof p === 'number') currentPage.value = p
}
</script>

<template>
  <div class="h-full flex flex-col p-5 sm:p-6 lg:p-7">

    <!-- Header -->
    <motion.div
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5 flex-shrink-0"
    >
      <div>
        <h1 class="text-[1.65rem] font-extrabold text-foreground tracking-tight">Pacientes</h1>
        <p class="mt-0.5 text-[13px] text-muted-foreground">{{ filteredPatients.length }} pacientes registrados</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="gap-1.5 text-foreground border-border h-9 text-xs font-semibold">
          <Filter class="w-3.5 h-3.5" />
          Filtrar
        </Button>
      </div>
    </motion.div>

    <!-- Table card -->
    <motion.div
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }"
      class="flex-1 min-h-0 bg-white border border-border rounded-2xl flex flex-col shadow-card"
    >

      <!-- Table header bar -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
        <h3 class="text-[15px] font-bold text-foreground">Lista de pacientes</h3>
        <div class="flex items-center gap-2">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="h-8 pl-8 pr-3 text-xs bg-muted border border-border rounded-lg outline-none focus:border-medical-400 focus:ring-1 focus:ring-medical-400/20 transition-all w-48"
            />
          </div>
          <button class="text-muted-foreground/40 hover:text-muted-foreground p-1 transition-colors">
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="flex-1 min-h-0 overflow-auto px-5 hidden md:block">
        <table class="w-full text-[13px]">
          <thead class="sticky top-0 bg-white z-10">
            <tr class="border-b border-border/60">
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Nombre</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Fecha</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Citas</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Servicio</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Email</th>
              <th class="text-left py-2.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Estado</th>
              <th class="py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in paginatedPatients"
              :key="patient.id"
              class="border-b border-border/40 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group"
              @click="goToPatient(patient.id)"
            >
              <!-- Name + avatar -->
              <td class="py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {{ patientInitials(patient.fullName) }}
                  </div>
                  <span class="font-semibold text-foreground">{{ patient.fullName }}</span>
                </div>
              </td>

              <!-- Date -->
              <td class="py-3">
                <div v-if="lastAppointmentInfo(patient.id)">
                  <p class="text-foreground font-medium text-xs">{{ formatDateTime(lastAppointmentInfo(patient.id)).time }}</p>
                  <p class="text-muted-foreground text-[11px]">{{ formatDateTime(lastAppointmentInfo(patient.id)).date }}</p>
                </div>
                <span v-else class="text-muted-foreground text-xs">—</span>
              </td>

              <!-- Total appointments -->
              <td class="py-3">
                <span class="font-bold text-foreground">{{ totalAppointments(patient.id) }}</span>
              </td>

              <!-- Service -->
              <td class="py-3 text-muted-foreground text-xs">
                {{ getServiceName(lastAppointmentInfo(patient.id)) }}
              </td>

              <!-- Email -->
              <td class="py-3 text-muted-foreground text-xs">
                {{ patient.email }}
              </td>

              <!-- Status -->
              <td class="py-3">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold" :class="getStatus(patient.id).color">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatus(patient.id).dot" />
                  {{ getStatus(patient.id).label }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-1.5 rounded-lg text-muted-foreground/70 hover:text-medical-600 hover:bg-medical-50 transition-colors" @click.stop>
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button class="p-1.5 rounded-lg text-muted-foreground/70 hover:text-red-500 hover:bg-red-50 transition-colors" @click.stop>
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty -->
        <div v-if="filteredPatients.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-4">
            <Users class="w-6 h-6 text-medical-500" />
          </div>
          <p class="text-sm font-medium text-foreground">Sin resultados</p>
          <p class="text-xs text-muted-foreground mt-0.5">No se encontraron pacientes con ese criterio</p>
        </div>
      </div>

      <!-- Mobile card list -->
      <div class="flex-1 min-h-0 overflow-auto px-5 md:hidden space-y-2 pb-4">
        <div
          v-for="patient in paginatedPatients"
          :key="patient.id"
          class="rounded-xl border border-border/60 p-3.5 active:bg-muted transition-colors cursor-pointer"
          @click="goToPatient(patient.id)"
        >
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {{ patientInitials(patient.fullName) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-foreground truncate">{{ patient.fullName }}</p>
              <p class="text-[11px] text-muted-foreground">{{ patient.email }}</p>
            </div>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold flex-shrink-0" :class="getStatus(patient.id).color">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatus(patient.id).dot" />
              {{ getStatus(patient.id).label }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-[11px] text-muted-foreground pl-11">
            <span>{{ totalAppointments(patient.id) }} citas</span>
            <span>{{ patient.phone }}</span>
          </div>
        </div>

        <div v-if="filteredPatients.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
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
  </div>
</template>
