<script setup>
import { ref, computed } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { usePatientsStore } from '@/stores/patients'
import { callGemini } from '@/services/gemini'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  FileText,
  Save,
  ChevronDown,
  AlertCircle,
  Clock,
  User,
  Stethoscope,
  ClipboardList,
  Activity,
  CalendarCheck,
  Check,
  Mic,
  Camera,
  PenLine,
  Square,
  Trash2,
  ImageIcon,
} from 'lucide-vue-next'
import { useAudioRecorder } from '@/composables/useAudioRecorder'
import { callGeminiMultimodal } from '@/services/gemini'

const patientsStore = usePatientsStore()

const selectedPatientId = ref('')
const userInput = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const aiNoKey = ref(false)
const showToast = ref(false)
const soapResult = ref(null)
const patientDropdownOpen = ref(false)
const patientSearch = ref('')

// Input mode
const inputMode = ref('text') // 'text' | 'audio' | 'scan'

// Audio recorder
const {
  isRecording,
  formattedTime,
  audioBase64,
  audioMimeType,
  hasRecording,
  error: audioError,
  startRecording,
  stopRecording,
  discardRecording,
} = useAudioRecorder()

// Scan / photo
const scanImageBase64 = ref(null)
const scanImagePreview = ref(null)

const selectedPatient = computed(() => {
  if (!selectedPatientId.value) return null
  return patientsStore.getPatientById(selectedPatientId.value)
})

const canGenerate = computed(() => {
  if (!selectedPatientId.value) return false
  if (inputMode.value === 'text') return userInput.value.trim().length > 0
  if (inputMode.value === 'audio') return hasRecording.value
  if (inputMode.value === 'scan') return !!scanImageBase64.value
  return false
})

function handleScanFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  scanImagePreview.value = URL.createObjectURL(file)
  const reader = new FileReader()
  reader.onloadend = () => {
    scanImageBase64.value = reader.result.split(',')[1]
  }
  reader.readAsDataURL(file)
}

function discardScan() {
  scanImageBase64.value = null
  scanImagePreview.value = null
}

const savedNotes = computed(() => {
  if (!selectedPatientId.value) return []
  return patientsStore.getPatientNotes(selectedPatientId.value)
})

const filteredPatients = computed(() => {
  const q = patientSearch.value.toLowerCase().trim()
  if (!q) return patientsStore.patients
  return patientsStore.patients.filter((p) =>
    p.fullName.toLowerCase().includes(q)
  )
})

function patientInitials(name) {
  const parts = name.split(' ')
  return parts.length >= 2
    ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    : parts[0].charAt(0).toUpperCase()
}

function selectPatient(id) {
  selectedPatientId.value = id
  patientDropdownOpen.value = false
  patientSearch.value = ''
}

// ── SOAP ────────────────────────────────────────────────────────────

const soapSections = [
  { key: 'S', label: 'Síntomas del paciente', sublabel: 'Lo que el paciente reporta', icon: User, color: 'medical' },
  { key: 'O', label: 'Exploración clínica', sublabel: 'Hallazgos clínicos', icon: Activity, color: 'sky' },
  { key: 'A', label: 'Diagnóstico', sublabel: 'Evaluación médica', icon: ClipboardList, color: 'amber' },
  { key: 'P', label: 'Tratamiento', sublabel: 'Plan y seguimiento', icon: CalendarCheck, color: 'emerald' },
]

const soapColors = {
  medical: { border: 'border-l-medical-500', bg: 'bg-medical-50', text: 'text-medical-700', icon: 'text-medical-600' },
  sky: { border: 'border-l-sky-400', bg: 'bg-sky-50', text: 'text-sky-700', icon: 'text-sky-600' },
  amber: { border: 'border-l-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600' },
  emerald: { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600' },
}

function stripMarkdown(text) {
  return text
    .replace(/\*{2,3}(.*?)\*{2,3}/g, '$1')   // **bold** / ***bold***
    .replace(/^\s*#{1,6}\s+/gm, '')            // # headings
    .replace(/^\s*[\*\-]\s+/gm, '• ')          // * or - bullets → •
    .replace(/^\s*\d+\.\s+/gm, (m) => m.trim() + ' ') // numbered lists
    .replace(/\n{3,}/g, '\n\n')                // excess blank lines
    .trim()
}

function parseSoapResponse(text) {
  const sections = { S: '', O: '', A: '', P: '' }

  // Build a more flexible header pattern that matches various Gemini formats:
  // "**S (Subjetivo):**", "**Subjetivo (S):**", "S:", "## S (Subjetivo)", "Subjetivo:", etc.
  const hdr = (letter, ...names) => {
    const nameAlt = names.join('|')
    return `(?:#{1,3}\\s*)?\\*{0,2}(?:${letter}\\s*[\\(\\-:]\\s*(?:${nameAlt})[\\)\\s]*|(?:${nameAlt})\\s*[\\(\\-:]?\\s*${letter}?[\\)\\s]*)\\*{0,2}\\s*[:\\-]?`
  }

  const sHdr = hdr('S', 'Subjetivo', 'S[iu]bjetivo', 'Síntomas')
  const oHdr = hdr('O', 'Objetivo', 'Hallazgos', 'Exploración')
  const aHdr = hdr('A', 'Evaluaci[oó]n', 'An[aá]lisis', 'Diagnóstico', 'Assessment')
  const pHdr = hdr('P', 'Plan', 'Tratamiento')

  const sMatch = text.match(new RegExp(`${sHdr}\\s*([\\s\\S]*?)(?=${oHdr}|$)`, 'i'))
  const oMatch = text.match(new RegExp(`${oHdr}\\s*([\\s\\S]*?)(?=${aHdr}|$)`, 'i'))
  const aMatch = text.match(new RegExp(`${aHdr}\\s*([\\s\\S]*?)(?=${pHdr}|$)`, 'i'))
  const pMatch = text.match(new RegExp(`${pHdr}\\s*([\\s\\S]*?)$`, 'i'))

  if (sMatch) sections.S = stripMarkdown(sMatch[1])
  if (oMatch) sections.O = stripMarkdown(oMatch[1])
  if (aMatch) sections.A = stripMarkdown(aMatch[1])
  if (pMatch) sections.P = stripMarkdown(pMatch[1])

  if (!sections.S && !sections.O && !sections.A && !sections.P) {
    sections.S = stripMarkdown(text)
  }

  return sections
}

async function generateSOAP() {
  if (!canGenerate.value) return

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  soapResult.value = null

  const soapSystemPrompt = `Eres un asistente médico profesional. Genera una nota clínica estructurada en formato SOAP en español mexicano. Sé claro, profesional y conciso.

IMPORTANTE: Usa EXACTAMENTE estos encabezados de sección (sin markdown, sin negritas, sin asteriscos):

S (Subjetivo):
[Lo que el paciente reporta]

O (Objetivo):
[Hallazgos del examen físico y signos vitales]

A (Evaluación):
[Diagnóstico o diagnósticos diferenciales]

P (Plan):
[Tratamiento, medicamentos, seguimiento]

NO uses markdown, asteriscos (**), viñetas (*), ni encabezados (#). Escribe en texto plano con oraciones completas.`

  try {
    let result

    if (inputMode.value === 'text') {
      const prompt = `Notas del médico: ${userInput.value}\n\nGenera la nota SOAP.`
      result = await callGemini(prompt, soapSystemPrompt)
    } else if (inputMode.value === 'audio') {
      result = await callGeminiMultimodal(
        [
          {
            inlineData: {
              mimeType: audioMimeType.value,
              data: audioBase64.value,
            },
          },
          'Este audio es una grabación de una consulta médica. Transcribe el contenido relevante y genera la nota SOAP.',
        ],
        soapSystemPrompt
      )
    } else if (inputMode.value === 'scan') {
      result = await callGeminiMultimodal(
        [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: scanImageBase64.value,
            },
          },
          'Esta imagen contiene notas médicas manuscritas de una consulta. Lee el contenido y genera la nota SOAP.',
        ],
        soapSystemPrompt
      )
    }

    soapResult.value = parseSoapResponse(result)
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      aiNoKey.value = true
    } else {
      aiError.value = 'Error al generar la nota. Intenta de nuevo.'
    }
  } finally {
    aiLoading.value = false
  }
}

function saveNote() {
  if (!soapResult.value || !selectedPatientId.value) return

  const rawInputMap = {
    text: userInput.value,
    audio: '[Transcripción de audio]',
    scan: '[Notas escaneadas]',
  }

  patientsStore.addClinicalNote({
    patientId: selectedPatientId.value,
    rawInput: rawInputMap[inputMode.value],
    soapS: soapResult.value.S,
    soapO: soapResult.value.O,
    soapA: soapResult.value.A,
    soapP: soapResult.value.P,
    aiGenerated: true,
  })

  soapResult.value = null
  userInput.value = ''
  discardRecording()
  discardScan()

  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

function formatDate(isoStr) {
  if (!isoStr) return '\u2014'
  const d = new Date(isoStr)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
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
        <h1 class="text-[1.65rem] font-extrabold text-foreground tracking-tight">Notas Clínicas</h1>
        <p class="mt-0.5 text-[13px] text-muted-foreground">Genera notas clínicas estructuradas con inteligencia artificial</p>
      </div>
      <div class="flex items-center gap-2 text-[12px] text-muted-foreground">
        <FileText class="w-3.5 h-3.5" />
        <span>{{ savedNotes.length }} notas guardadas</span>
      </div>
    </motion.div>

    <!-- Main content -->
    <div class="flex-1 min-h-0 flex gap-5">

      <!-- ═══ LEFT: Composer ═══ -->
      <motion.div
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }"
        class="flex-1 min-w-0 flex flex-col"
      >
        <div class="bg-white border border-border rounded-2xl shadow-card flex flex-col flex-1 min-h-0">

          <!-- Patient selector -->
          <div class="px-5 pt-5 pb-4 flex-shrink-0">
            <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Paciente</label>
            <div class="relative">
              <button
                class="w-full flex items-center gap-3 px-3.5 py-2.5 bg-muted border border-border rounded-xl text-left hover:border-border transition-colors"
                @click="patientDropdownOpen = !patientDropdownOpen"
              >
                <template v-if="selectedPatient">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                    {{ patientInitials(selectedPatient.fullName) }}
                  </div>
                  <span class="text-[13px] font-medium text-foreground flex-1 truncate">{{ selectedPatient.fullName }}</span>
                </template>
                <template v-else>
                  <div class="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User class="w-3.5 h-3.5 text-muted-foreground/70" />
                  </div>
                  <span class="text-[13px] text-muted-foreground/70 flex-1">Seleccionar paciente...</span>
                </template>
                <ChevronDown class="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0 transition-transform" :class="patientDropdownOpen ? 'rotate-180' : ''" />
              </button>

              <!-- Dropdown -->
              <div
                v-if="patientDropdownOpen"
                class="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white border border-border rounded-xl shadow-md shadow-border/50 max-h-64 overflow-hidden flex flex-col"
              >
                <div class="p-2 flex-shrink-0">
                  <input
                    v-model="patientSearch"
                    type="text"
                    placeholder="Buscar paciente..."
                    class="w-full h-8 px-3 text-xs bg-muted border border-border rounded-lg outline-none focus:border-medical-400 focus:ring-1 focus:ring-medical-400/20"
                    @click.stop
                  />
                </div>
                <div class="overflow-y-auto flex-1">
                  <button
                    v-for="p in filteredPatients"
                    :key="p.id"
                    class="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/60 transition-colors"
                    :class="selectedPatientId === p.id ? 'bg-medical-50' : ''"
                    @click="selectPatient(p.id)"
                  >
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                      {{ patientInitials(p.fullName) }}
                    </div>
                    <span class="text-[12px] font-medium text-foreground truncate">{{ p.fullName }}</span>
                    <Check v-if="selectedPatientId === p.id" class="w-3.5 h-3.5 text-medical-600 ml-auto flex-shrink-0" />
                  </button>
                  <div v-if="filteredPatients.length === 0" class="px-3 py-4 text-center text-[12px] text-muted-foreground">
                    Sin resultados
                  </div>
                </div>
              </div>

              <!-- Backdrop to close -->
              <div v-if="patientDropdownOpen" class="fixed inset-0 z-20" @click="patientDropdownOpen = false"></div>
            </div>
          </div>

          <!-- Input Mode Tabs -->
          <div class="px-5 pb-2 flex-shrink-0">
            <div class="flex gap-1 p-1 bg-muted rounded-xl">
              <button
                v-for="mode in [
                  { id: 'text', label: 'Notas', icon: PenLine },
                  { id: 'audio', label: 'Grabar Consulta', icon: Mic },
                  { id: 'scan', label: 'Escanear Notas', icon: Camera },
                ]"
                :key="mode.id"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
                :class="inputMode === mode.id
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'"
                @click="inputMode = mode.id"
              >
                <component :is="mode.icon" class="w-3.5 h-3.5" />
                {{ mode.label }}
              </button>
            </div>
          </div>

          <!-- Input Area -->
          <div class="px-5 pb-4 flex-1 min-h-0 flex flex-col">

            <!-- MODE: Text -->
            <template v-if="inputMode === 'text'">
              <label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Notas de la consulta</label>
              <textarea
                v-model="userInput"
                placeholder="Describe la consulta en tus palabras... Ej: Paciente femenina de 45 años, dolor de cabeza frecuente desde hace 2 semanas. PA 130/85. Receto paracetamol 500mg c/8h y seguimiento en 2 semanas."
                class="flex-1 min-h-[120px] w-full px-3.5 py-3 text-[13px] text-foreground bg-muted border border-border rounded-xl resize-none outline-none focus:border-medical-400 focus:ring-1 focus:ring-medical-400/20 transition-all placeholder:text-muted-foreground/70 leading-relaxed"
              />
            </template>

            <!-- MODE: Audio Recording (Notion-style) -->
            <template v-if="inputMode === 'audio'">
              <div class="flex-1 flex flex-col items-center justify-center gap-4">

                <!-- Not recording, no recording saved -->
                <template v-if="!isRecording && !hasRecording">
                  <div class="w-16 h-16 rounded-2xl bg-medical-50 flex items-center justify-center mb-1">
                    <Mic class="w-7 h-7 text-medical-600" />
                  </div>
                  <div class="text-center">
                    <p class="text-[14px] font-semibold text-foreground">Grabar consulta</p>
                    <p class="text-[12px] text-muted-foreground mt-1 max-w-[280px]">La IA transcribirá el audio y generará la nota clínica automáticamente</p>
                  </div>
                  <button
                    @click="startRecording"
                    class="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-md shadow-medical-600/20"
                  >
                    <Mic class="w-4 h-4" />
                    Iniciar transcripción
                  </button>
                  <p class="text-[11px] text-muted-foreground/70 text-center max-w-[300px]">Al iniciar, confirmas que todos los participantes han dado su consentimiento para ser grabados.</p>
                </template>

                <!-- Recording in progress -->
                <template v-if="isRecording">
                  <div class="flex flex-col items-center gap-4">
                    <div class="relative">
                      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                          <Mic class="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div class="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-30"></div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span class="text-[20px] font-mono font-bold text-foreground tabular-nums">{{ formattedTime }}</span>
                    </div>
                    <p class="text-[12px] text-muted-foreground">Grabando consulta...</p>
                    <button
                      @click="stopRecording"
                      class="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl transition-colors"
                    >
                      <Square class="w-3.5 h-3.5 fill-current" />
                      Detener grabación
                    </button>
                  </div>
                </template>

                <!-- Recording complete -->
                <template v-if="!isRecording && hasRecording">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Check class="w-6 h-6 text-emerald-600" />
                    </div>
                    <div class="text-center">
                      <p class="text-[14px] font-semibold text-foreground">Grabación lista</p>
                      <p class="text-[12px] text-muted-foreground mt-0.5">Duración: {{ formattedTime }}</p>
                    </div>
                    <button
                      @click="discardRecording"
                      class="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                      Descartar y grabar de nuevo
                    </button>
                  </div>
                </template>

                <!-- Audio error -->
                <div v-if="audioError" class="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl mt-2 max-w-[340px]">
                  <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p class="text-[12px] text-red-700">{{ audioError }}</p>
                </div>
              </div>
            </template>

            <!-- MODE: Scan / Photo -->
            <template v-if="inputMode === 'scan'">
              <div class="flex-1 flex flex-col items-center justify-center gap-4">

                <!-- No image yet -->
                <template v-if="!scanImageBase64">
                  <div class="w-16 h-16 rounded-2xl bg-medical-50 flex items-center justify-center mb-1">
                    <Camera class="w-7 h-7 text-medical-600" />
                  </div>
                  <div class="text-center">
                    <p class="text-[14px] font-semibold text-foreground">Escanear notas</p>
                    <p class="text-[12px] text-muted-foreground mt-1 max-w-[280px]">Toma una foto de tus notas manuscritas y la IA las leerá para generar la nota clínica</p>
                  </div>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-md shadow-medical-600/20 cursor-pointer">
                      <Camera class="w-4 h-4" />
                      Tomar foto
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        class="hidden"
                        @change="handleScanFile"
                      />
                    </label>
                    <label class="flex items-center gap-2 px-5 py-2.5 bg-white border border-border text-foreground text-[13px] font-semibold rounded-xl transition-colors hover:bg-muted cursor-pointer">
                      <ImageIcon class="w-4 h-4" />
                      Subir imagen
                      <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleScanFile"
                      />
                    </label>
                  </div>
                </template>

                <!-- Image preview -->
                <template v-if="scanImageBase64">
                  <div class="w-full max-w-[320px]">
                    <div class="relative rounded-xl overflow-hidden border border-border shadow-sm">
                      <img :src="scanImagePreview" class="w-full h-auto max-h-[240px] object-contain bg-muted" alt="Notas escaneadas" />
                    </div>
                    <button
                      @click="discardScan"
                      class="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-red-600 transition-colors mt-3 mx-auto"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                      Descartar imagen
                    </button>
                  </div>
                </template>
              </div>
            </template>
          </div>

          <!-- Generate button + errors -->
          <div class="px-5 pb-5 flex-shrink-0">
            <!-- Error states -->
            <div v-if="aiNoKey" class="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
              <AlertCircle class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-[12px] font-semibold text-amber-800">API Key no configurada</p>
                <p class="text-[11px] text-amber-600 mt-0.5">Agrega VITE_GEMINI_API_KEY en tus variables de entorno.</p>
              </div>
            </div>

            <div v-if="aiError" class="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
              <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
              <p class="text-[12px] text-red-700 flex-1">{{ aiError }}</p>
              <button class="text-[11px] font-semibold text-red-600 hover:text-red-700" @click="generateSOAP">Reintentar</button>
            </div>

            <motion.button
              @click="generateSOAP"
              :disabled="!canGenerate || aiLoading"
              :whilePress="{ scale: 0.98 }"
              class="ai-generate-btn w-full relative overflow-hidden flex items-center justify-center gap-2 py-3 text-white text-[13px] font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              :class="aiLoading ? 'ai-card-glow' : ''"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 transition-all"></div>
              <div v-if="aiLoading" class="absolute inset-0 ai-shimmer-bar opacity-30"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <Sparkles class="w-4 h-4 relative z-10" :class="aiLoading ? 'ai-sparkle' : ''" />
              <span class="relative z-10" v-if="aiLoading">Generando nota clínica...</span>
              <span class="relative z-10" v-else-if="inputMode === 'audio'">Transcribir y generar nota clínica</span>
              <span class="relative z-10" v-else-if="inputMode === 'scan'">Analizar y generar nota clínica</span>
              <span class="relative z-10" v-else>Generar nota clínica con IA</span>
            </motion.button>
          </div>
        </div>

        <!-- SOAP Result (below composer) -->
        <AnimatePresence>
        <motion.div
          v-if="aiLoading"
          :initial="{ opacity: 0, y: 16, scale: 0.98 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: -8 }"
          :transition="{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }"
          class="mt-4 relative overflow-hidden border border-emerald-200/60 rounded-2xl shadow-ai p-5 ai-card-glow"
        >
          <!-- Gradient background -->
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50"></div>
          <!-- Shimmer overlay -->
          <div class="absolute inset-0 ai-shimmer-bar opacity-20"></div>
          <!-- Floating particles -->
          <div class="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-300/40" style="animation: ai-float 3s ease-in-out infinite"></div>
          <div class="absolute bottom-3 right-8 w-1.5 h-1.5 rounded-full bg-emerald-400/30" style="animation: ai-float-delayed 4s ease-in-out 0.5s infinite"></div>

          <div class="relative z-10 flex items-center gap-2 mb-4">
            <div class="relative w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Sparkles class="w-3.5 h-3.5 text-white ai-sparkle" />
              <div class="absolute inset-0 rounded-lg bg-emerald-400/30 animate-ping"></div>
            </div>
            <p class="text-[13px] font-bold text-ai-gradient">Generando nota clínica...</p>
          </div>
          <div class="relative z-10 space-y-2.5">
            <div v-for="i in 4" :key="i" class="flex gap-3">
              <div class="w-1 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-400 animate-pulse"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 ai-shimmer-bar rounded-md" :style="{ width: `${30 + i * 10}%` }"></div>
                <div class="h-3 ai-shimmer-bar rounded-md" :style="{ width: `${50 + i * 8}%`, animationDelay: `${i * 0.2}s` }"></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          v-if="soapResult && !aiLoading"
          :initial="{ opacity: 0, y: 16, scale: 0.98 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
          class="mt-4 relative overflow-hidden border border-emerald-200/60 rounded-2xl shadow-ai p-5"
        >
          <!-- Subtle gradient bg -->
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 pointer-events-none"></div>
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500"></div>

          <div class="relative z-10 flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                <Sparkles class="w-3.5 h-3.5 text-white" />
              </div>
              <p class="text-[13px] font-bold text-ai-gradient">Nota Clínica Generada</p>
            </div>
            <span class="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200/60">AI</span>
          </div>

          <div class="relative z-10 space-y-3">
            <div
              v-for="section in soapSections"
              :key="section.key"
              class="border-l-[3px] pl-3.5 py-1"
              :class="soapColors[section.color].border"
            >
              <div class="flex items-center gap-1.5 mb-1">
                <component :is="section.icon" class="w-3 h-3" :class="soapColors[section.color].icon" />
                <p class="text-[10px] font-semibold uppercase tracking-wider" :class="soapColors[section.color].text">{{ section.label }}</p>
              </div>
              <p class="text-[12.5px] text-foreground/80 leading-relaxed whitespace-pre-line">{{ soapResult[section.key] }}</p>
            </div>
          </div>

          <div class="relative z-10 mt-5 pt-4 border-t border-emerald-100/60">
            <button
              @click="saveNote"
              class="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-[13px] font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              <Save class="w-3.5 h-3.5" />
              Guardar nota clínica
            </button>
          </div>
        </motion.div>
        </AnimatePresence>
      </motion.div>

      <!-- ═══ RIGHT: Saved notes timeline ═══ -->
      <motion.div
        :initial="{ opacity: 0, x: 16 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }"
        class="hidden lg:flex w-[340px] flex-col flex-shrink-0"
      >
        <div class="bg-white border border-border rounded-2xl shadow-card flex flex-col flex-1 min-h-0">

          <!-- Header -->
          <div class="px-5 pt-5 pb-3 flex-shrink-0">
            <h3 class="text-[15px] font-bold text-foreground">Historial</h3>
            <p v-if="selectedPatient" class="text-[11px] text-muted-foreground mt-0.5">
              Notas de {{ selectedPatient.fullName }}
            </p>
            <p v-else class="text-[11px] text-muted-foreground mt-0.5">
              Selecciona un paciente para ver su historial
            </p>
          </div>

          <!-- Notes list -->
          <div class="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
            <template v-if="selectedPatientId">
              <div v-if="savedNotes.length > 0" class="space-y-3">
                <div
                  v-for="note in savedNotes"
                  :key="note.id"
                  class="rounded-xl border border-border/60 p-3.5 hover:border-border transition-colors"
                >
                  <!-- Note header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock class="w-3 h-3" />
                      <span>{{ formatDate(note.createdAt) }}</span>
                      <span class="text-muted-foreground/40">·</span>
                      <span>{{ formatTime(note.createdAt) }}</span>
                    </div>
                    <span
                      v-if="note.aiGenerated"
                      class="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60"
                    >AI</span>
                  </div>

                  <!-- Compact SOAP sections -->
                  <div class="space-y-2">
                    <div
                      v-for="section in soapSections"
                      :key="section.key"
                      class="border-l-2 pl-2.5"
                      :class="soapColors[section.color].border"
                    >
                      <p class="text-[9px] font-bold uppercase tracking-wider mb-0.5" :class="soapColors[section.color].text">{{ section.label }}</p>
                      <p class="text-[11px] text-foreground/70 leading-snug line-clamp-2">
                        {{ note[`soap${section.key}`] }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty -->
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-12 h-12 bg-medical-50 rounded-2xl flex items-center justify-center mb-3">
                  <FileText class="w-5 h-5 text-medical-500" />
                </div>
                <p class="text-[13px] font-medium text-foreground">Sin notas</p>
                <p class="text-[11px] text-muted-foreground mt-0.5">Genera tu primera nota clínica</p>
              </div>
            </template>

            <!-- No patient selected -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-3">
                <User class="w-5 h-5 text-muted-foreground/70" />
              </div>
              <p class="text-[13px] font-medium text-foreground">Selecciona un paciente</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">El historial de notas aparecerá aquí</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 flex items-center gap-2.5 bg-medical-950 text-white px-4 py-3 rounded-xl shadow-md shadow-medical-950/20 text-[13px] font-medium z-50"
      >
        <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Check class="w-3 h-3 text-white" />
        </div>
        Nota clínica guardada
      </div>
    </Transition>
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
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.95);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
