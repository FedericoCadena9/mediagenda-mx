<script setup>
import { ref, computed, watch } from 'vue'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { callGemini } from '@/services/gemini'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import WhatsAppBubble from '@/components/ui/WhatsAppBubble.vue'

const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()

const selectedPatientId = ref('')
const messageType = ref('recordatorio')
const aiLoading = ref(false)
const aiError = ref('')
const aiNoKey = ref(false)
const generatedMessage = ref('')
const copied = ref(false)

const messageTypes = [
  { value: 'recordatorio', label: 'Recordatorio de cita', icon: '\uD83D\uDCC5' },
  { value: 'seguimiento', label: 'Seguimiento post-consulta', icon: '\uD83C\uDFE5' },
  { value: 'no_show', label: 'Cita no atendida', icon: '\u274C' },
]

const selectedPatient = computed(() => {
  if (!selectedPatientId.value) return null
  return patientsStore.getPatientById(selectedPatientId.value)
})

const patientAppointments = computed(() => {
  if (!selectedPatient.value) return []
  return appointmentsStore.appointments
    .filter((a) => a.patientId === selectedPatient.value.id)
    .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))
})

const mostRecentAppointment = computed(() => {
  return patientAppointments.value.length > 0 ? patientAppointments.value[0] : null
})

const recentServiceName = computed(() => {
  if (!mostRecentAppointment.value) return 'Consulta General'
  const s = servicesStore.getServiceById(mostRecentAppointment.value.serviceId)
  return s ? s.name : 'Consulta'
})

const recentDate = computed(() => {
  if (!mostRecentAppointment.value) return '\u2014'
  const [y, m, d] = mostRecentAppointment.value.date.split('-')
  return `${d}/${m}/${y}`
})

const typeLabel = computed(() => {
  const t = messageTypes.find((mt) => mt.value === messageType.value)
  return t ? t.label : messageType.value
})

// Reset message when patient or type changes
watch([selectedPatientId, messageType], () => {
  generatedMessage.value = ''
  aiError.value = ''
  aiNoKey.value = false
})

async function generateMessage() {
  if (!selectedPatient.value) return

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  generatedMessage.value = ''
  copied.value = false

  const systemPrompt = `Eres el asistente de Dr. Carlos Mendoza, medico general en Queretaro. Redacta un mensaje de WhatsApp personalizado y profesional en espanol mexicano para el/la paciente ${selectedPatient.value.fullName}.

Tipo: ${typeLabel.value}
Servicio: ${recentServiceName.value}
Fecha: ${recentDate.value}
Historial: ${patientAppointments.value.length} visitas previas

Requisitos:
- Calido y profesional (usar "usted")
- Breve (maximo 3 parrafos)
- Terminar con datos del consultorio: Consultorio Dr. Mendoza, Av. Universidad 150, Queretaro. Tel: 442 123 4567`

  try {
    const result = await callGemini('Genera el mensaje de WhatsApp.', systemPrompt)
    generatedMessage.value = result
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      aiNoKey.value = true
    } else {
      aiError.value = 'Error al generar el mensaje. Intenta de nuevo.'
    }
  } finally {
    aiLoading.value = false
  }
}

function openWhatsApp() {
  if (!selectedPatient.value || !generatedMessage.value) return
  const phone = selectedPatient.value.phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(generatedMessage.value)
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
}

async function copyMessage() {
  if (!generatedMessage.value) return
  try {
    await navigator.clipboard.writeText(generatedMessage.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = generatedMessage.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
        Mensajes IA
        <span class="text-2xl">&#x2728;</span>
      </h1>
      <p class="text-sm text-slate-500 mt-1">Genera mensajes de WhatsApp personalizados para tus pacientes</p>
    </div>

    <!-- Patient Selector -->
    <div class="mb-6 max-w-md">
      <Label class="mb-2">Paciente</Label>
      <Select v-model="selectedPatientId">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Seleccionar paciente..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="p in patientsStore.patients" :key="p.id" :value="p.id">
            {{ p.fullName }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Message Type Selector -->
    <div class="mb-6">
      <Label class="mb-3">Tipo de mensaje</Label>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
        <Card
          v-for="mt in messageTypes"
          :key="mt.value"
          class="cursor-pointer transition-all"
          :class="messageType === mt.value
            ? 'border-2 border-cyan-600 bg-cyan-50'
            : 'border-2 border-slate-200 hover:border-slate-300'"
          @click="messageType = mt.value"
        >
          <CardContent class="p-4 flex items-center gap-3">
            <span class="text-xl">{{ mt.icon }}</span>
            <span class="text-sm font-medium" :class="messageType === mt.value ? 'text-cyan-700' : 'text-slate-700'">
              {{ mt.label }}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Context info -->
    <Card v-if="selectedPatient && mostRecentAppointment" class="mb-6 max-w-md">
      <CardContent class="p-4">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contexto</p>
        <div class="space-y-1 text-sm text-slate-600">
          <p><span class="font-medium text-slate-700">Paciente:</span> {{ selectedPatient.fullName }}</p>
          <p><span class="font-medium text-slate-700">Servicio:</span> {{ recentServiceName }}</p>
          <p><span class="font-medium text-slate-700">Fecha:</span> {{ recentDate }}</p>
          <p><span class="font-medium text-slate-700">Visitas previas:</span> {{ patientAppointments.length }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Generate Button -->
    <Button
      @click="generateMessage"
      :disabled="!selectedPatientId || aiLoading"
      class="bg-violet-600 hover:bg-violet-700 mb-6"
    >
      &#x2728; Generar mensaje con IA
    </Button>

    <!-- Error states -->
    <Alert v-if="aiNoKey" class="bg-amber-50 border-amber-200 mb-6 max-w-lg">
      <AlertTitle class="text-amber-800">API Key no configurada</AlertTitle>
      <AlertDescription class="text-amber-800">
        Agrega tu clave de Gemini en la variable de entorno VITE_GEMINI_API_KEY.
      </AlertDescription>
    </Alert>

    <Alert v-if="aiError" variant="destructive" class="mb-6 max-w-lg">
      <AlertDescription class="flex items-center justify-between">
        <span>{{ aiError }}</span>
        <Button variant="link" size="sm" class="text-red-600 hover:text-red-700" @click="generateMessage">Reintentar</Button>
      </AlertDescription>
    </Alert>

    <!-- Loading -->
    <div v-if="aiLoading" class="mb-6 max-w-md">
      <div class="bg-green-50 rounded-2xl rounded-bl-sm p-4 space-y-3">
        <Skeleton class="h-4 w-full bg-green-200" />
        <Skeleton class="h-4 w-5/6 bg-green-200" />
        <Skeleton class="h-4 w-4/6 bg-green-200" />
        <Skeleton class="h-4 w-3/6 bg-green-200" />
      </div>
    </div>

    <!-- Generated Message -->
    <div v-if="generatedMessage && !aiLoading" class="mb-6">
      <WhatsAppBubble :message="generatedMessage" />

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-3 mt-4">
        <Button @click="openWhatsApp" class="bg-green-600 hover:bg-green-700 gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Abrir en WhatsApp
        </Button>

        <Button variant="outline" @click="generateMessage" class="gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerar
        </Button>

        <Button variant="outline" @click="copyMessage" class="gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ copied ? 'Copiado!' : 'Copiar mensaje' }}
        </Button>
      </div>
    </div>
  </div>
</template>
