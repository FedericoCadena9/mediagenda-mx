<script setup>
import { ref, computed } from 'vue'
import { usePatientsStore } from '@/stores/patients'
import { callGemini } from '@/services/gemini'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import AIResponseCard from '@/components/ui/AIResponseCard.vue'

const patientsStore = usePatientsStore()

const selectedPatientId = ref('')
const userInput = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const aiNoKey = ref(false)
const showToast = ref(false)
const soapResult = ref(null)

const selectedPatient = computed(() => {
  if (!selectedPatientId.value) return null
  return patientsStore.getPatientById(selectedPatientId.value)
})

const canGenerate = computed(() => {
  return selectedPatientId.value && userInput.value.trim().length > 0
})

const savedNotes = computed(() => {
  if (!selectedPatientId.value) return []
  return patientsStore.getPatientNotes(selectedPatientId.value)
})

function parseSoapResponse(text) {
  const sections = { S: '', O: '', A: '', P: '' }

  const sMatch = text.match(/(?:\*{0,2})(?:Subjetivo\s*\(S\)|S\s*[-:)])\s*\*{0,2}\s*[:\-]?\s*([\s\S]*?)(?=(?:\*{0,2})(?:Objetivo\s*\(O\)|O\s*[-:)])\s*\*{0,2}\s*[:\-]|$)/i)
  const oMatch = text.match(/(?:\*{0,2})(?:Objetivo\s*\(O\)|O\s*[-:)])\s*\*{0,2}\s*[:\-]?\s*([\s\S]*?)(?=(?:\*{0,2})(?:Evaluaci[o\u00f3]n\s*\(A\)|A\s*[-:)])\s*\*{0,2}\s*[:\-]|$)/i)
  const aMatch = text.match(/(?:\*{0,2})(?:Evaluaci[o\u00f3]n\s*\(A\)|A\s*[-:)])\s*\*{0,2}\s*[:\-]?\s*([\s\S]*?)(?=(?:\*{0,2})(?:Plan\s*\(P\)|P\s*[-:)])\s*\*{0,2}\s*[:\-]|$)/i)
  const pMatch = text.match(/(?:\*{0,2})(?:Plan\s*\(P\)|P\s*[-:)])\s*\*{0,2}\s*[:\-]?\s*([\s\S]*?)$/i)

  if (sMatch) sections.S = sMatch[1].trim()
  if (oMatch) sections.O = oMatch[1].trim()
  if (aMatch) sections.A = aMatch[1].trim()
  if (pMatch) sections.P = pMatch[1].trim()

  if (!sections.S && !sections.O && !sections.A && !sections.P) {
    sections.S = text
  }

  return sections
}

async function generateSOAP() {
  if (!canGenerate.value) return

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  soapResult.value = null

  const systemPrompt = `Eres un asistente medico profesional. El medico te proporciona notas informales de una consulta y tu generas una nota clinica estructurada en formato SOAP en espanol mexicano. Se claro, profesional y conciso.

Notas del medico: ${userInput.value}

Genera la nota SOAP con 4 secciones:
- Subjetivo (S): Lo que el paciente reporta
- Objetivo (O): Hallazgos del examen fisico y signos vitales
- Evaluacion (A): Diagnostico o diagnosticos diferenciales
- Plan (P): Tratamiento, medicamentos, seguimiento`

  try {
    const result = await callGemini('Genera la nota SOAP.', systemPrompt)
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

  patientsStore.addClinicalNote({
    patientId: selectedPatientId.value,
    rawInput: userInput.value,
    soapS: soapResult.value.S,
    soapO: soapResult.value.O,
    soapA: soapResult.value.A,
    soapP: soapResult.value.P,
    aiGenerated: true,
  })

  soapResult.value = null
  userInput.value = ''

  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function formatDate(isoStr) {
  if (!isoStr) return '\u2014'
  const d = new Date(isoStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
        Notas Clinicas IA
        <span class="text-2xl">&#x2728;</span>
      </h1>
      <p class="text-sm text-slate-500 mt-1">Genera notas SOAP estructuradas con inteligencia artificial</p>
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

    <!-- Textarea -->
    <div class="mb-4">
      <Label class="mb-2">Notas de la consulta</Label>
      <Textarea
        v-model="userInput"
        :rows="6"
        placeholder="Describe la consulta de hoy en tus palabras... Por ejemplo: Paciente femenina de 45 anos, viene por dolor de cabeza frecuente desde hace 2 semanas. Presion arterial 130/85. Le receto paracetamol 500mg cada 8 horas y cita de seguimiento en 2 semanas."
        class="resize-y"
      />
    </div>

    <!-- Generate Button -->
    <Button
      @click="generateSOAP"
      :disabled="!canGenerate || aiLoading"
      class="bg-violet-600 hover:bg-violet-700 mb-6"
    >
      &#x2728; Generar Nota SOAP con IA
    </Button>

    <!-- Error states -->
    <Alert v-if="aiNoKey" class="bg-amber-50 border-amber-200 mb-6">
      <AlertTitle class="text-amber-800">API Key no configurada</AlertTitle>
      <AlertDescription class="text-amber-800">
        Agrega tu clave de Gemini en la variable de entorno VITE_GEMINI_API_KEY.
      </AlertDescription>
    </Alert>

    <Alert v-if="aiError" variant="destructive" class="mb-6">
      <AlertDescription class="flex items-center justify-between">
        <span>{{ aiError }}</span>
        <Button variant="link" size="sm" class="text-red-600 hover:text-red-700" @click="generateSOAP">Reintentar</Button>
      </AlertDescription>
    </Alert>

    <!-- Loading -->
    <div v-if="aiLoading" class="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-lg">&#x2728;</span>
        <h3 class="text-sm font-semibold text-violet-800">Generando Nota SOAP</h3>
      </div>
      <div class="space-y-3">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
        <Skeleton class="h-4 w-4/6" />
        <Skeleton class="h-4 w-3/6" />
      </div>
    </div>

    <!-- SOAP Result -->
    <Card v-if="soapResult && !aiLoading" class="mb-6">
      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
            &#x2728; Nota SOAP Generada
          </h3>
          <Badge variant="outline" class="bg-violet-100 text-violet-700 border-violet-200">
            IA
          </Badge>
        </div>

        <div class="space-y-4">
          <div class="border-l-4 border-cyan-400 pl-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subjetivo (S)</p>
            <p class="text-sm text-slate-700 whitespace-pre-line">{{ soapResult.S }}</p>
          </div>
          <div class="border-l-4 border-blue-400 pl-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Objetivo (O)</p>
            <p class="text-sm text-slate-700 whitespace-pre-line">{{ soapResult.O }}</p>
          </div>
          <div class="border-l-4 border-amber-400 pl-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Evaluacion (A)</p>
            <p class="text-sm text-slate-700 whitespace-pre-line">{{ soapResult.A }}</p>
          </div>
          <div class="border-l-4 border-green-400 pl-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Plan (P)</p>
            <p class="text-sm text-slate-700 whitespace-pre-line">{{ soapResult.P }}</p>
          </div>
        </div>

        <Separator class="my-5" />

        <Button @click="saveNote" class="bg-cyan-600 hover:bg-cyan-700 gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Guardar nota
        </Button>
      </CardContent>
    </Card>

    <!-- Saved Notes -->
    <div v-if="selectedPatientId">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">Notas guardadas</h2>

      <div v-if="savedNotes.length > 0" class="space-y-4">
        <Card
          v-for="note in savedNotes"
          :key="note.id"
        >
          <CardContent class="p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-medium text-slate-900">{{ formatDate(note.createdAt) }}</p>
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
          <p class="text-sm text-slate-500">No hay notas guardadas para este paciente.</p>
        </CardContent>
      </Card>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
      >
        Nota clinica guardada &#x2713;
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
