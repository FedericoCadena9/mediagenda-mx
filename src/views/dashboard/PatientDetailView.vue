<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { callGemini } from '@/services/gemini'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import AIResponseCard from '@/components/ui/AIResponseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import RiskBadge from '@/components/ui/RiskBadge.vue'

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

const noShowRisk = computed(() => {
  if (!patient.value) return 'medio'
  const apts = patientAppointments.value
  if (apts.length <= 1) return 'medio'
  const noShows = apts.filter((a) => a.status === 'no_show').length
  if (noShows >= 2) return 'alto'
  if (noShows === 1) return 'medio'
  return 'bajo'
})

function serviceName(serviceId) {
  const s = servicesStore.getServiceById(serviceId)
  return s ? s.name : 'Servicio'
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function formatCreatedAt(isoStr) {
  if (!isoStr) return '\u2014'
  const d = new Date(isoStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

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
    .map((n) => `${formatCreatedAt(n.createdAt)}: S:${n.soapS} A:${n.soapA} P:${n.soapP}`)
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

function goBack() {
  router.push('/demo/dashboard/pacientes')
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <Button variant="ghost" size="sm" class="text-cyan-600 hover:text-cyan-700 gap-1 mb-6" @click="goBack">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Pacientes
    </Button>

    <div v-if="!patient" class="flex flex-col items-center justify-center py-20">
      <Alert variant="destructive" class="max-w-md">
        <AlertTitle>No encontrado</AlertTitle>
        <AlertDescription>Paciente no encontrado.</AlertDescription>
      </Alert>
    </div>

    <template v-else>
      <!-- Patient Info Card -->
      <Card class="mb-6">
        <CardContent class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900">{{ patient.fullName }}</h1>
                <RiskBadge :level="noShowRisk" />
              </div>
              <div class="space-y-1 text-sm text-slate-600">
                <p><span class="font-medium text-slate-700">Telefono:</span> {{ patient.phone }}</p>
                <p><span class="font-medium text-slate-700">Email:</span> {{ patient.email }}</p>
                <p><span class="font-medium text-slate-700">Registrado:</span> {{ formatCreatedAt(patient.createdAt) }}</p>
              </div>
            </div>

            <Button
              @click="generateSummary"
              :disabled="aiLoading"
              class="bg-violet-600 hover:bg-violet-700 flex-shrink-0"
            >
              &#x2728; Resumen IA
            </Button>
          </div>

          <div v-if="aiLoading || aiSummary || aiError || aiNoKey" class="mt-4">
            <Alert v-if="aiNoKey" class="bg-amber-50 border-amber-200">
              <AlertTitle class="text-amber-800">API Key no configurada</AlertTitle>
              <AlertDescription class="text-amber-800">
                Agrega tu clave de Gemini en la variable de entorno VITE_GEMINI_API_KEY.
              </AlertDescription>
            </Alert>

            <Alert v-else-if="aiError" variant="destructive">
              <AlertDescription class="flex items-center justify-between">
                <span>{{ aiError }}</span>
                <Button variant="link" size="sm" class="text-red-600 hover:text-red-700" @click="generateSummary">Reintentar</Button>
              </AlertDescription>
            </Alert>

            <div v-else-if="aiLoading" class="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-3">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-lg">&#x2728;</span>
                <h3 class="text-sm font-semibold text-violet-800">Resumen del Paciente</h3>
              </div>
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-5/6" />
              <Skeleton class="h-4 w-4/6" />
            </div>

            <AIResponseCard v-else :loading="false" title="Resumen del Paciente">
              <p class="whitespace-pre-line">{{ aiSummary }}</p>
            </AIResponseCard>
          </div>
        </CardContent>
      </Card>

      <Separator class="my-6" />

      <!-- Appointment History -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Historial de Citas</h2>

        <div v-if="patientAppointments.length > 0" class="space-y-3">
          <Card
            v-for="apt in patientAppointments"
            :key="apt.id"
          >
            <CardContent class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex items-center gap-4">
                <div>
                  <p class="text-sm font-medium text-slate-900">{{ formatDate(apt.date) }}</p>
                  <p class="text-xs text-slate-500">{{ apt.startTime }} - {{ apt.endTime }}</p>
                </div>
                <p class="text-sm text-slate-600">{{ serviceName(apt.serviceId) }}</p>
              </div>
              <StatusBadge :status="apt.status" />
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="p-8 text-center">
            <p class="text-sm text-slate-500">No hay citas registradas para este paciente.</p>
          </CardContent>
        </Card>
      </div>

      <Separator class="my-6" />

      <!-- Clinical Notes -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Notas Clinicas</h2>

        <div v-if="patientNotes.length > 0" class="space-y-4">
          <Card
            v-for="note in patientNotes"
            :key="note.id"
          >
            <CardContent class="p-5">
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-medium text-slate-900">{{ formatCreatedAt(note.createdAt) }}</p>
                <Badge
                  v-if="note.aiGenerated"
                  variant="outline"
                  class="bg-violet-100 text-violet-700 border-violet-200"
                >
                  &#x2728; Generada con IA
                </Badge>
              </div>

              <div class="space-y-3">
                <div class="border-l-4 border-cyan-400 pl-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subjetivo (S)</p>
                  <p class="text-sm text-slate-700">{{ note.soapS }}</p>
                </div>
                <div class="border-l-4 border-blue-400 pl-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Objetivo (O)</p>
                  <p class="text-sm text-slate-700">{{ note.soapO }}</p>
                </div>
                <div class="border-l-4 border-amber-400 pl-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Evaluacion (A)</p>
                  <p class="text-sm text-slate-700">{{ note.soapA }}</p>
                </div>
                <div class="border-l-4 border-green-400 pl-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Plan (P)</p>
                  <p class="text-sm text-slate-700">{{ note.soapP }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="p-8 text-center">
            <p class="text-sm text-slate-500">No hay notas clinicas registradas para este paciente.</p>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
