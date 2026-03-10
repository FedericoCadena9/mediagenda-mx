<script setup>
import { animate, stagger } from 'motion'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Mail,
  MessageCircleMore,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-vue-next'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { callGemini } from '@/services/gemini'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()

const rootRef = ref(null)
const phoneShellRef = ref(null)
const phoneBubbleRef = ref(null)

const patientQuery = ref('')
const selectedPatientId = ref('')
const messageType = ref('recordatorio')
const messageTone = ref('calido')
const includeService = ref(true)
const includeSchedule = ref(true)
const includeReplyCTA = ref(true)
const mentionVisitCount = ref(false)

const aiLoading = ref(false)
const aiError = ref('')
const aiNoKey = ref(false)
const generatedMessage = ref('')
const copied = ref(false)

const loadingStages = [
  'Leyendo historial clinico',
  'Ajustando tono del mensaje',
  'Construyendo cierre de WhatsApp',
]
const loadingStageIndex = ref(0)

let loadingInterval = null
let loadingAnimations = []

const messageTypes = [
  {
    value: 'recordatorio',
    label: 'Recordatorio de cita',
    eyebrow: 'Confirmacion amable',
    icon: CalendarDays,
    helper: 'Enfatiza horario, claridad y facilidad para confirmar asistencia.',
    promptHint: 'Redacta un recordatorio cordial que reduzca ausencias sin sonar robotico.',
  },
  {
    value: 'seguimiento',
    label: 'Seguimiento post-consulta',
    eyebrow: 'Acompanamiento',
    icon: Stethoscope,
    helper: 'Pregunta como se siente el paciente y refuerza disponibilidad del consultorio.',
    promptHint: 'Haz seguimiento posterior a una consulta con tono cercano y profesional.',
  },
  {
    value: 'no_show',
    label: 'Cita no atendida',
    eyebrow: 'Reactivacion',
    icon: MessageCircleMore,
    helper: 'Retoma el contacto con respeto y ofrece reagendar sin friccion.',
    promptHint: 'Busca reactivar la conversacion despues de una cita no atendida con tacto.',
  },
]

const toneOptions = [
  {
    value: 'calido',
    label: 'Calido',
    helper: 'Amable, humano y sereno.',
    promptHint: 'Mantén un tono calido, empatico y muy cercano.',
  },
  {
    value: 'ejecutivo',
    label: 'Ejecutivo',
    helper: 'Directo, claro y breve.',
    promptHint: 'Mantén un tono ejecutivo, concreto y confiable.',
  },
  {
    value: 'preventivo',
    label: 'Preventivo',
    helper: 'Subraya seguimiento y cuidado.',
    promptHint: 'Refuerza prevencion, continuidad y acompañamiento medico.',
  },
]

function normalizeText(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getTodayKey() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatDateLabel(date) {
  if (!date) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function formatLongDate(date) {
  if (!date) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function formatPhone(phone = '') {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone || 'Sin telefono'
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

function formatGeminiError(error) {
  const message = error?.message ?? ''

  if (message.includes('API key not valid')) {
    return 'La API key de Gemini no es valida.'
  }

  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return 'Se alcanzo el limite actual de Gemini. Intenta de nuevo en unos minutos.'
  }

  if (message.includes('404') || message.includes('not supported for generateContent')) {
    return 'El modelo configurado no esta disponible. Revisa VITE_GEMINI_MODEL.'
  }

  return 'No fue posible generar el mensaje en este momento.'
}

const selectedType = computed(() => {
  return messageTypes.find((type) => type.value === messageType.value) ?? messageTypes[0]
})

const selectedTone = computed(() => {
  return toneOptions.find((tone) => tone.value === messageTone.value) ?? toneOptions[0]
})

const patientSummaries = computed(() => {
  const todayKey = getTodayKey()

  return patientsStore.patients
    .map((patient) => {
      const appointments = appointmentsStore.appointments
        .filter((appointment) => appointment.patientId === patient.id)
        .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))

      const lastAppointment = appointments[0] ?? null
      const upcomingAppointment = appointments
        .filter((appointment) => appointment.date >= todayKey)
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))[0] ?? null

      const relatedService = lastAppointment
        ? servicesStore.getServiceById(lastAppointment.serviceId)
        : null

      return {
        ...patient,
        initials: getInitials(patient.fullName),
        appointments,
        appointmentsCount: appointments.length,
        lastAppointment,
        upcomingAppointment,
        lastServiceName: relatedService?.name ?? 'Consulta General',
        lastVisitLabel: lastAppointment ? formatDateLabel(lastAppointment.date) : 'Sin historial',
      }
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'es-MX'))
})

const filteredPatients = computed(() => {
  const query = normalizeText(patientQuery.value.trim())

  if (!query) return patientSummaries.value

  return patientSummaries.value.filter((patient) => {
    return [patient.fullName, patient.email, patient.phone].some((value) =>
      normalizeText(value).includes(query)
    )
  })
})

const selectedPatient = computed(() => {
  return patientSummaries.value.find((patient) => patient.id === selectedPatientId.value) ?? null
})

const patientAppointments = computed(() => selectedPatient.value?.appointments ?? [])

const mostRecentAppointment = computed(() => selectedPatient.value?.lastAppointment ?? null)

const upcomingAppointment = computed(() => selectedPatient.value?.upcomingAppointment ?? null)

const recentServiceName = computed(() => {
  if (!mostRecentAppointment.value) return 'Consulta General'
  const service = servicesStore.getServiceById(mostRecentAppointment.value.serviceId)
  return service?.name ?? 'Consulta General'
})

const activeContextAppointment = computed(() => {
  if (messageType.value === 'recordatorio') {
    return upcomingAppointment.value ?? mostRecentAppointment.value
  }
  return mostRecentAppointment.value ?? upcomingAppointment.value
})

const contextDateLabel = computed(() => {
  return activeContextAppointment.value
    ? formatLongDate(activeContextAppointment.value.date)
    : 'Sin contexto clinico reciente'
})

const contextTimeLabel = computed(() => activeContextAppointment.value?.startTime ?? 'Por definir')

const previewTimestamp = computed(() => {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
})

const loadingStageLabel = computed(() => loadingStages[loadingStageIndex.value])

function stopLoadingCycle() {
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
}

function startLoadingCycle() {
  stopLoadingCycle()
  loadingStageIndex.value = 0
  loadingInterval = window.setInterval(() => {
    loadingStageIndex.value = (loadingStageIndex.value + 1) % loadingStages.length
  }, 1200)
}

function stopLoadingAnimations() {
  loadingAnimations.forEach((control) => {
    control?.stop?.()
    control?.cancel?.()
  })
  loadingAnimations = []
}

function runEntranceAnimations() {
  const elements = rootRef.value?.querySelectorAll('[data-motion="reveal"]')
  const floaters = rootRef.value?.querySelectorAll('[data-motion="float"]')

  if (elements?.length) {
    animate(
      elements,
      { opacity: [0, 1], y: [26, 0], scale: [0.985, 1] },
      {
        delay: stagger(0.05),
        duration: 0.72,
        easing: [0.22, 1, 0.36, 1],
      }
    )
  }

  if (floaters?.length) {
    animate(
      floaters,
      { y: [0, -14, 0], x: [0, 5, 0] },
      {
        delay: stagger(0.4),
        duration: 7,
        repeat: Infinity,
        easing: 'ease-in-out',
      }
    )
  }
}

function animatePatientCards() {
  const cards = rootRef.value?.querySelectorAll('[data-patient-card]')

  if (!cards?.length) return

  animate(
    cards,
    { opacity: [0.55, 1], y: [18, 0], scale: [0.985, 1] },
    {
      delay: stagger(0.025),
      duration: 0.42,
      easing: [0.22, 1, 0.36, 1],
    }
  )
}

function animatePreviewPulse() {
  if (!phoneShellRef.value) return

  animate(
    phoneShellRef.value,
    { scale: [1, 1.018, 1], rotate: [0, -0.35, 0.25, 0] },
    {
      duration: 0.58,
      easing: [0.22, 1, 0.36, 1],
    }
  )
}

function animateMessageReveal() {
  if (!phoneBubbleRef.value) return

  animate(
    phoneBubbleRef.value,
    { opacity: [0, 1], y: [24, 0], scale: [0.96, 1] },
    {
      duration: 0.56,
      easing: [0.22, 1, 0.36, 1],
    }
  )
}

function startLoadingAnimations() {
  stopLoadingAnimations()

  const dots = rootRef.value?.querySelectorAll('[data-loading-dot]')
  const bars = rootRef.value?.querySelectorAll('[data-loading-bar]')

  if (dots?.length) {
    loadingAnimations.push(
      animate(
        dots,
        { y: [0, -5, 0], opacity: [0.35, 1, 0.35] },
        {
          delay: stagger(0.14),
          duration: 0.9,
          repeat: Infinity,
          easing: 'ease-in-out',
        }
      )
    )
  }

  if (bars?.length) {
    loadingAnimations.push(
      animate(
        bars,
        { scaleX: [0.35, 1, 0.45], opacity: [0.45, 1, 0.55] },
        {
          delay: stagger(0.12),
          duration: 1.2,
          repeat: Infinity,
          easing: 'ease-in-out',
        }
      )
    )
  }

  if (phoneShellRef.value) {
    loadingAnimations.push(
      animate(
        phoneShellRef.value,
        { y: [0, -4, 0], boxShadow: ['0 30px 90px rgba(10, 48, 64, 0.20)', '0 42px 120px rgba(12, 173, 212, 0.28)', '0 30px 90px rgba(10, 48, 64, 0.20)'] },
        {
          duration: 2.4,
          repeat: Infinity,
          easing: 'ease-in-out',
        }
      )
    )
  }
}

function resetGenerationState() {
  generatedMessage.value = ''
  aiError.value = ''
  aiNoKey.value = false
  copied.value = false
}

watch([selectedPatientId, messageType, messageTone, includeService, includeSchedule, includeReplyCTA, mentionVisitCount], async () => {
  resetGenerationState()
  await nextTick()
  animatePreviewPulse()
})

watch(filteredPatients, async () => {
  await nextTick()
  animatePatientCards()
})

watch(aiLoading, async (isLoading) => {
  if (isLoading) {
    startLoadingCycle()
    await nextTick()
    startLoadingAnimations()
    animatePreviewPulse()
    return
  }

  stopLoadingCycle()
  stopLoadingAnimations()
})

watch(generatedMessage, async (message) => {
  if (!message) return
  await nextTick()
  animateMessageReveal()
})

onMounted(async () => {
  await nextTick()
  runEntranceAnimations()
  animatePatientCards()
})

onUnmounted(() => {
  stopLoadingCycle()
  stopLoadingAnimations()
})

async function generateMessage() {
  if (!selectedPatient.value) return

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  generatedMessage.value = ''
  copied.value = false

  const contextService = includeService.value ? recentServiceName.value : 'consulta reciente'
  const contextDate = includeSchedule.value
    ? `${contextDateLabel.value}${contextTimeLabel.value ? ` a las ${contextTimeLabel.value}` : ''}`
    : 'sin mencionar fecha u horario exactos'

  const systemPrompt = `Eres el asistente de WhatsApp del Dr. Carlos Mendoza, medico general en Queretaro. Redacta un mensaje personalizado y profesional en espanol mexicano para ${selectedPatient.value.fullName}.

Tipo de mensaje: ${selectedType.value.label}
Objetivo del mensaje: ${selectedType.value.promptHint}
Tono: ${selectedTone.value.promptHint}
Servicio relacionado: ${contextService}
Contexto temporal: ${contextDate}
Paciente: ${selectedPatient.value.fullName}
Telefono del paciente: ${formatPhone(selectedPatient.value.phone)}
Correo del paciente: ${selectedPatient.value.email}
Historial clinico registrado: ${patientAppointments.value.length} visitas

Instrucciones:
- Usa tratamiento de "usted".
- Mantenga un estilo breve, claro y natural.
- ${includeService.value ? 'Mencione el servicio o tipo de consulta cuando ayude a dar contexto.' : 'No mencione el servicio por nombre.'}
- ${includeSchedule.value ? 'Incluya fecha y hora si existe contexto suficiente.' : 'Evite mencionar fecha y hora exactas.'}
- ${includeReplyCTA.value ? 'Invite a responder para confirmar, reagendar o resolver dudas.' : 'No pida respuesta explicita.'}
- ${mentionVisitCount.value ? `Puede aprovechar que es un paciente con ${patientAppointments.value.length} visitas registradas para sonar cercano.` : 'No mencione el numero de visitas previas.'}
- Cierre con: Consultorio Dr. Mendoza, Av. Universidad 150, Queretaro. Tel: 442 123 4567.
- Entregue solo el mensaje final, listo para copiar en WhatsApp.`

  try {
    const result = await callGemini('Genera el mensaje de WhatsApp.', systemPrompt)
    generatedMessage.value = result
  } catch (error) {
    if (error.message === 'NO_API_KEY') {
      aiNoKey.value = true
    } else {
      aiError.value = formatGeminiError(error)
    }
  } finally {
    aiLoading.value = false
  }
}

function openWhatsApp() {
  if (!selectedPatient.value || !generatedMessage.value) return
  const phone = selectedPatient.value.phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(generatedMessage.value)
  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
}

async function copyMessage() {
  if (!generatedMessage.value) return

  try {
    await navigator.clipboard.writeText(generatedMessage.value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = generatedMessage.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <div ref="rootRef" class="h-full flex flex-col p-5 sm:p-6 lg:p-7">

    <!-- Header -->
    <div data-motion="reveal" class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5 flex-shrink-0">
      <div>
        <h1 class="text-[1.65rem] font-extrabold text-foreground tracking-tight">Mensajes</h1>
        <p class="mt-0.5 text-[13px] text-muted-foreground">Genera mensajes personalizados para WhatsApp con IA</p>
      </div>
      <div class="flex items-center gap-2 text-[12px] text-muted-foreground">
        <MessageCircleMore class="w-3.5 h-3.5" />
        <span>{{ filteredPatients.length }} pacientes</span>
        <span class="text-muted-foreground/40">·</span>
        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WhatsApp</span>
      </div>
    </div>

    <!-- Main layout -->
    <div class="flex-1 min-h-0 flex gap-5">

      <!-- ═══ LEFT: Config panel ═══ -->
      <div data-motion="reveal" class="flex-1 min-w-0 flex flex-col gap-5 overflow-y-auto">

        <!-- Patient selector -->
        <div class="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[15px] font-bold text-foreground">Seleccionar paciente</h3>
            <div class="relative">
              <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
              <input
                v-model="patientQuery"
                type="text"
                placeholder="Buscar..."
                class="h-8 pl-8 pr-3 text-xs bg-muted border border-border rounded-lg outline-none focus:border-medical-400 focus:ring-1 focus:ring-medical-400/20 transition-all w-48"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-1">
            <button
              v-for="patient in filteredPatients"
              :key="patient.id"
              type="button"
              data-patient-card
              class="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
              :class="selectedPatientId === patient.id
                ? 'border-medical-300 bg-medical-50'
                : 'border-border/60 hover:border-border hover:bg-muted/40'"
              @click="selectedPatientId = patient.id"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {{ patient.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-foreground truncate">{{ patient.fullName }}</p>
                <p class="text-[10px] text-muted-foreground truncate">{{ patient.lastServiceName }} · {{ patient.lastVisitLabel }}</p>
              </div>
              <span class="text-[10px] font-semibold text-muted-foreground flex-shrink-0">{{ patient.appointmentsCount }}</span>
            </button>

            <div v-if="!filteredPatients.length" class="col-span-full flex flex-col items-center py-8 text-center">
              <Search class="w-5 h-5 text-muted-foreground/40 mb-2" />
              <p class="text-xs text-muted-foreground">Sin resultados</p>
            </div>
          </div>
        </div>

        <!-- Message type -->
        <div class="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-[15px] font-bold text-foreground mb-4">Tipo de mensaje</h3>
          <div class="grid gap-2 lg:grid-cols-3">
            <button
              v-for="type in messageTypes"
              :key="type.value"
              type="button"
              class="p-3.5 rounded-xl border text-left transition-all"
              :class="messageType === type.value
                ? 'border-medical-300 bg-medical-50'
                : 'border-border/60 hover:border-border'"
              @click="messageType = type.value"
            >
              <div class="flex items-center justify-between mb-2">
                <component :is="type.icon" class="w-4 h-4" :class="messageType === type.value ? 'text-medical-600' : 'text-muted-foreground/70'" />
                <span class="text-[9px] font-bold uppercase tracking-wider" :class="messageType === type.value ? 'text-medical-600' : 'text-muted-foreground/70'">{{ type.eyebrow }}</span>
              </div>
              <p class="text-[13px] font-semibold text-foreground">{{ type.label }}</p>
              <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">{{ type.helper }}</p>
            </button>
          </div>
        </div>

        <!-- Tone + options -->
        <div class="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-[15px] font-bold text-foreground mb-3">Tono y opciones</h3>

          <!-- Tone pills -->
          <div class="flex items-center gap-1.5 mb-4">
            <button
              v-for="tone in toneOptions"
              :key="tone.value"
              type="button"
              class="px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all"
              :class="messageTone === tone.value
                ? 'bg-foreground text-white border-foreground'
                : 'bg-white text-muted-foreground border-border hover:border-border hover:text-foreground'"
              @click="messageTone = tone.value"
            >
              {{ tone.label }}
            </button>
          </div>

          <!-- Toggles -->
          <div class="grid sm:grid-cols-2 gap-2">
            <label class="flex items-start gap-3 p-3 rounded-xl border border-border/60 cursor-pointer hover:bg-muted/40 transition-colors">
              <Checkbox v-model="includeService" class="mt-0.5 border-medical-300 data-[state=checked]:bg-medical-600 data-[state=checked]:border-medical-600" />
              <div>
                <p class="text-[12px] font-semibold text-foreground">Mencionar servicio</p>
                <p class="text-[10px] text-muted-foreground">Incluye el tipo de consulta.</p>
              </div>
            </label>
            <label class="flex items-start gap-3 p-3 rounded-xl border border-border/60 cursor-pointer hover:bg-muted/40 transition-colors">
              <Checkbox v-model="includeSchedule" class="mt-0.5 border-medical-300 data-[state=checked]:bg-medical-600 data-[state=checked]:border-medical-600" />
              <div>
                <p class="text-[12px] font-semibold text-foreground">Incluir fecha y hora</p>
                <p class="text-[10px] text-muted-foreground">Ideal para recordatorios.</p>
              </div>
            </label>
            <label class="flex items-start gap-3 p-3 rounded-xl border border-border/60 cursor-pointer hover:bg-muted/40 transition-colors">
              <Checkbox v-model="includeReplyCTA" class="mt-0.5 border-medical-300 data-[state=checked]:bg-medical-600 data-[state=checked]:border-medical-600" />
              <div>
                <p class="text-[12px] font-semibold text-foreground">Invitar a responder</p>
                <p class="text-[10px] text-muted-foreground">CTA para confirmar o reagendar.</p>
              </div>
            </label>
            <label class="flex items-start gap-3 p-3 rounded-xl border border-border/60 cursor-pointer hover:bg-muted/40 transition-colors">
              <Checkbox v-model="mentionVisitCount" class="mt-0.5 border-medical-300 data-[state=checked]:bg-medical-600 data-[state=checked]:border-medical-600" />
              <div>
                <p class="text-[12px] font-semibold text-foreground">Historial de visitas</p>
                <p class="text-[10px] text-muted-foreground">Mensaje más cercano.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- ═══ RIGHT: Preview panel ═══ -->
      <div data-motion="reveal" class="hidden lg:block w-[320px] flex-shrink-0">
        <div class="sticky top-0 flex flex-col gap-3">

          <!-- Context + generate -->
          <div class="relative overflow-hidden border border-emerald-200/60 rounded-2xl p-4 shadow-ai">
            <!-- Subtle gradient bg -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 pointer-events-none"></div>
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500"></div>

            <!-- Floating particles -->
            <div class="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-300/40" style="animation: ai-float 4s ease-in-out infinite"></div>
            <div class="absolute bottom-6 right-6 w-1 h-1 rounded-full bg-emerald-400/30" style="animation: ai-float-delayed 5s ease-in-out 1s infinite"></div>

            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles class="w-2.5 h-2.5 text-white" />
                </div>
                <p class="text-[10px] font-bold text-ai-gradient uppercase tracking-wider">Contexto IA</p>
              </div>

              <template v-if="selectedPatient">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {{ selectedPatient.initials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[12.5px] font-semibold text-foreground truncate">{{ selectedPatient.fullName }}</p>
                    <p class="text-[10.5px] text-muted-foreground">{{ formatPhone(selectedPatient.phone) }}</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-[10.5px] text-muted-foreground">
                  <span class="flex items-center gap-1.5"><CalendarDays class="w-3 h-3 text-emerald-500/70" />{{ contextDateLabel }}</span>
                  <span class="flex items-center gap-1.5"><Clock3 class="w-3 h-3 text-emerald-500/70" />{{ contextTimeLabel }}</span>
                  <span class="flex items-center gap-1.5"><Stethoscope class="w-3 h-3 text-emerald-500/70" />{{ recentServiceName }}</span>
                </div>
              </template>

              <div v-else class="flex items-center gap-3 py-4 justify-center mb-3">
                <Sparkles class="w-4 h-4 text-emerald-300 ai-sparkle" />
                <p class="text-[12px] text-muted-foreground">Selecciona un paciente para comenzar</p>
              </div>

              <button
                @click="generateMessage"
                :disabled="!selectedPatientId || aiLoading"
                class="ai-generate-btn w-full relative overflow-hidden flex items-center justify-center gap-2 py-2.5 text-white text-[12.5px] font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="aiLoading ? 'ai-card-glow' : ''"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600"></div>
                <div v-if="aiLoading" class="absolute inset-0 ai-shimmer-bar opacity-30"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <RefreshCw v-if="aiLoading" class="w-3.5 h-3.5 relative z-10 animate-spin" />
                <Sparkles v-else class="w-3.5 h-3.5 relative z-10" />
                <span class="relative z-10">{{ aiLoading ? 'Generando...' : 'Generar mensaje con IA' }}</span>
              </button>

              <div v-if="aiNoKey" class="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg mt-2.5">
                <Sparkles class="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p class="text-[10.5px] text-amber-700">Configura VITE_GEMINI_API_KEY para activar.</p>
              </div>
              <div v-if="aiError" class="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg mt-2.5">
                <p class="text-[10.5px] text-red-700">{{ aiError }}</p>
              </div>
            </div>
          </div>

          <!-- Phone mockup (WhatsApp style) -->
          <div ref="phoneShellRef" class="phone-shell mx-auto w-full">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div class="relative z-10 flex flex-col min-h-[540px]">

                <!-- WA Header bar -->
                <div class="wa-header">
                  <div class="flex items-center gap-2.5">
                    <div class="phone-contact-avatar">
                      {{ selectedPatient ? selectedPatient.initials : 'IA' }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-[11.5px] font-semibold text-white">
                        {{ selectedPatient ? selectedPatient.fullName : 'Consultia' }}
                      </p>
                      <p class="truncate text-[9px] text-white/60">
                        {{ aiLoading ? 'escribiendo...' : selectedPatient ? 'en línea' : 'Selecciona paciente' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-white/50">
                    <Phone class="w-3.5 h-3.5" />
                    <Search class="w-3.5 h-3.5" />
                  </div>
                </div>

                <!-- Chat area (WA wallpaper) -->
                <div class="wa-chat flex-1 px-3 pt-3 pb-2 flex flex-col">

                  <!-- Date chip -->
                  <div class="self-center mb-3">
                    <span class="text-[9px] font-medium text-muted-foreground bg-white rounded-md px-2.5 py-1 shadow-sm">HOY</span>
                  </div>

                  <!-- Loading state -->
                  <template v-if="selectedPatient && aiLoading">
                    <div class="wa-bubble-out mb-2">
                      <p class="text-[11px] leading-relaxed text-foreground">Preparando un texto {{ selectedTone.label.toLowerCase() }} para {{ selectedPatient.fullName }}...</p>
                      <span class="wa-timestamp">{{ previewTimestamp }}</span>
                    </div>
                    <div class="wa-bubble-out max-w-[75%]">
                      <div class="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-700 mb-2">
                        <Bot class="h-2.5 w-2.5 text-emerald-600" /> {{ loadingStageLabel }}
                      </div>
                      <div class="space-y-1.5">
                        <div data-loading-bar class="h-1 rounded-full ai-shimmer-bar"></div>
                        <div data-loading-bar class="h-1 w-[80%] rounded-full ai-shimmer-bar" style="animation-delay: 0.2s"></div>
                        <div data-loading-bar class="h-1 w-[60%] rounded-full ai-shimmer-bar" style="animation-delay: 0.4s"></div>
                      </div>
                      <div class="mt-2 flex gap-1">
                        <span data-loading-dot class="w-[5px] h-[5px] rounded-full bg-emerald-400 ai-dot-1"></span>
                        <span data-loading-dot class="w-[5px] h-[5px] rounded-full bg-emerald-400 ai-dot-2"></span>
                        <span data-loading-dot class="w-[5px] h-[5px] rounded-full bg-emerald-400 ai-dot-3"></span>
                      </div>
                    </div>
                  </template>

                  <!-- Generated message -->
                  <template v-else-if="generatedMessage">
                    <div ref="phoneBubbleRef" class="wa-bubble-out">
                      <p class="whitespace-pre-line text-[11px] leading-relaxed text-foreground">{{ generatedMessage }}</p>
                      <span class="wa-timestamp">{{ previewTimestamp }} <CheckCircle2 class="w-2.5 h-2.5 inline text-sky-500" /></span>
                    </div>
                  </template>

                  <!-- Ready state -->
                  <template v-else-if="selectedPatient">
                    <div class="wa-bubble-in mb-2">
                      <p class="text-[11px] leading-relaxed text-foreground">
                        Generaré un mensaje de tipo <strong>{{ selectedType.label.toLowerCase() }}</strong> con tono
                        <strong>{{ selectedTone.label.toLowerCase() }}</strong>.
                      </p>
                      <span class="wa-timestamp">{{ previewTimestamp }}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span class="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" :class="includeService ? 'bg-white text-medical-700' : 'bg-white/50 text-muted-foreground/70'">Servicio</span>
                      <span class="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" :class="includeSchedule ? 'bg-white text-medical-700' : 'bg-white/50 text-muted-foreground/70'">Fecha</span>
                      <span class="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" :class="includeReplyCTA ? 'bg-white text-medical-700' : 'bg-white/50 text-muted-foreground/70'">CTA</span>
                      <span class="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" :class="mentionVisitCount ? 'bg-white text-medical-700' : 'bg-white/50 text-muted-foreground/70'">Historial</span>
                    </div>
                  </template>

                  <!-- Empty state -->
                  <template v-else>
                    <div class="my-auto text-center">
                      <div class="inline-flex items-center gap-2 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
                        <ShieldCheck class="w-3.5 h-3.5 text-amber-500" />
                        <p class="text-[10px] text-muted-foreground">Los mensajes están cifrados de extremo a extremo</p>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- WA Input bar -->
                <div class="flex items-center gap-1.5 px-2 pb-2 mt-auto">
                  <div class="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm">
                    <Sparkles class="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                    <span class="text-[10px] text-muted-foreground/70 truncate">
                      {{ aiLoading ? 'Escribiendo...' : generatedMessage ? 'Listo para enviar' : 'Mensaje' }}
                    </span>
                  </div>
                  <button type="button" class="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm disabled:opacity-40 transition-opacity" :disabled="!generatedMessage" @click="openWhatsApp">
                    <Send class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2">
            <button
              @click="copyMessage"
              :disabled="!generatedMessage"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl border border-border text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40"
            >
              <CheckCircle2 v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              {{ copied ? 'Copiado' : 'Copiar' }}
            </button>
            <button
              @click="generateMessage"
              :disabled="!selectedPatientId || aiLoading"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl border border-border text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="aiLoading ? 'animate-spin' : ''" />
              Regenerar
            </button>
            <button
              @click="openWhatsApp"
              :disabled="!generatedMessage"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40"
            >
              <Send class="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-generate-btn {
  box-shadow: 0 4px 14px -2px rgba(16, 185, 129, 0.35), 0 2px 6px -1px rgba(5, 150, 105, 0.2);
}
.ai-generate-btn:hover:not(:disabled) {
  box-shadow: 0 8px 20px -2px rgba(16, 185, 129, 0.4), 0 4px 10px -2px rgba(5, 150, 105, 0.25);
  transform: translateY(-1px);
}
.phone-shell {
  position: relative;
  border-radius: 36px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
  padding: 10px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.phone-notch {
  position: absolute;
  left: 50%;
  top: 8px;
  z-index: 20;
  height: 20px;
  width: 100px;
  transform: translateX(-50%);
  border-radius: 0 0 14px 14px;
  background: #0d0d0d;
}

.phone-screen {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background: #efeae2;
}

/* WhatsApp header */
.wa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 12px 10px;
  background: linear-gradient(180deg, #075E54 0%, #064E47 100%);
}

/* WhatsApp chat wallpaper */
.wa-chat {
  background-color: #efeae2;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4cfc6' fill-opacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='25' r='1'/%3E%3Ccircle cx='55' cy='12' r='1.2'/%3E%3Ccircle cx='70' cy='40' r='1'/%3E%3Ccircle cx='20' cy='55' r='1.3'/%3E%3Ccircle cx='45' cy='65' r='1'/%3E%3Ccircle cx='65' cy='70' r='1.5'/%3E%3C/g%3E%3C/svg%3E");
}

/* Outgoing bubble (green, right-aligned) */
.wa-bubble-out {
  align-self: flex-end;
  max-width: 88%;
  background: #d9fdd3;
  border-radius: 10px 10px 4px 10px;
  padding: 6px 8px 4px;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
}

/* Incoming bubble (white, left-aligned) */
.wa-bubble-in {
  align-self: flex-start;
  max-width: 85%;
  background: white;
  border-radius: 10px 10px 10px 4px;
  padding: 6px 8px 4px;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
}

.wa-timestamp {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 2px;
  font-size: 9px;
  color: #667781;
}

.phone-contact-avatar {
  display: grid;
  place-items: center;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  font-size: 0.6rem;
  background: linear-gradient(145deg, #0a3040, #0cadd4);
  color: white;
  font-weight: 700;
}
</style>
