# Clinical Notes: Audio Recording & Photo Scan Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add audio transcription (Notion-style) and photo/scan of handwritten notes as alternative input modes in ClinicalNotesView, both powered by Gemini multimodal API.

**Architecture:** Extend `gemini.js` with a multimodal function that accepts base64 `inlineData` parts. Add a composable `useAudioRecorder` for MediaRecorder logic. Refactor ClinicalNotesView to have 3 input mode tabs (text, audio, scan) sharing the same SOAP generation pipeline.

**Tech Stack:** Vue 3, MediaRecorder Web API (audio), `<input capture>` (camera), `@google/generative-ai` v0.24.1 (multimodal inlineData), Lucide icons.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/services/gemini.js` | Modify | Add `callGeminiMultimodal()` for inlineData parts |
| `src/composables/useAudioRecorder.js` | Create | MediaRecorder logic, timer, state management |
| `src/views/dashboard/ClinicalNotesView.vue` | Modify | Add 3-tab input modes, integrate audio + scan |

---

## Chunk 1: Gemini Multimodal Service

### Task 1: Add multimodal function to gemini.js

**Files:**
- Modify: `src/services/gemini.js`

- [ ] **Step 1: Add `callGeminiMultimodal` export to gemini.js**

Add this function after the existing `callGemini` function:

```javascript
/**
 * Send multimodal content (images, audio) to Gemini.
 * @param {Array<string | {inlineData: {mimeType: string, data: string}}>} parts
 * @param {string} systemPrompt - Prepended as first text part
 * @returns {Promise<string>}
 */
export async function callGeminiMultimodal(parts, systemPrompt = '') {
  if (!genAI) {
    throw new Error('NO_API_KEY')
  }

  const contentParts = []
  if (systemPrompt) {
    contentParts.push(systemPrompt)
  }
  contentParts.push(...parts)

  let lastError = null

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(contentParts)
      return result.response.text()
    } catch (error) {
      lastError = error
      if (isMissingModelError(error)) {
        console.warn(`Gemini model unavailable: ${modelName}`, error)
        continue
      }
      console.error('Gemini error:', error)
      throw error
    }
  }

  console.error('Gemini error:', lastError)
  throw lastError
}
```

- [ ] **Step 2: Verify gemini.js still exports correctly**

Run: `grep -n 'export' src/services/gemini.js`
Expected: Both `callGemini` and `callGeminiMultimodal` exported.

- [ ] **Step 3: Commit**

```bash
git add src/services/gemini.js
git commit -m "feat: add callGeminiMultimodal for audio/image inputs"
```

---

## Chunk 2: Audio Recorder Composable

### Task 2: Create useAudioRecorder composable

**Files:**
- Create: `src/composables/useAudioRecorder.js`

- [ ] **Step 1: Create the composable**

```javascript
import { ref, computed, onUnmounted } from 'vue'

export function useAudioRecorder() {
  const isRecording = ref(false)
  const isPaused = ref(false)
  const elapsedSeconds = ref(0)
  const audioBase64 = ref(null)
  const audioMimeType = ref(null)
  const error = ref('')

  let mediaRecorder = null
  let audioChunks = []
  let timerInterval = null

  const formattedTime = computed(() => {
    const mins = Math.floor(elapsedSeconds.value / 60)
    const secs = elapsedSeconds.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  const hasRecording = computed(() => !!audioBase64.value)

  function startTimer() {
    elapsedSeconds.value = 0
    timerInterval = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  async function startRecording() {
    error.value = ''
    audioBase64.value = null
    audioChunks = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Prefer webm (Chrome/Firefox), fall back to mp4 (Safari)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/webm'

      mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioMimeType.value = mimeType.split(';')[0] // e.g. "audio/webm"

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mimeType })
        const reader = new FileReader()
        reader.onloadend = () => {
          // Strip "data:audio/webm;base64," prefix
          audioBase64.value = reader.result.split(',')[1]
        }
        reader.readAsDataURL(blob)

        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start(1000) // collect data every second
      isRecording.value = true
      isPaused.value = false
      startTimer()
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        error.value = 'Permiso de micrófono denegado. Actívalo en la configuración del navegador.'
      } else if (err.name === 'NotFoundError') {
        error.value = 'No se encontró un micrófono conectado.'
      } else {
        error.value = 'No se pudo iniciar la grabación.'
      }
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    isRecording.value = false
    isPaused.value = false
    stopTimer()
  }

  function discardRecording() {
    audioBase64.value = null
    audioMimeType.value = null
    elapsedSeconds.value = 0
    error.value = ''
  }

  onUnmounted(() => {
    stopTimer()
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
  })

  return {
    isRecording,
    isPaused,
    elapsedSeconds,
    formattedTime,
    audioBase64,
    audioMimeType,
    hasRecording,
    error,
    startRecording,
    stopRecording,
    discardRecording,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useAudioRecorder.js
git commit -m "feat: add useAudioRecorder composable for mic recording"
```

---

## Chunk 3: ClinicalNotesView — Input Mode Tabs + Audio + Scan

### Task 3: Refactor ClinicalNotesView with 3 input modes

This is the main UI change. The existing textarea becomes mode "text". Two new modes are added: "audio" and "scan".

**Files:**
- Modify: `src/views/dashboard/ClinicalNotesView.vue`

**Key design decisions:**
- Tab bar sits between patient selector and input area
- All 3 modes feed into the same SOAP generation pipeline
- Audio mode uses Notion-style UI (consent note, start button, timer, stop)
- Scan mode uses file input with camera capture + image preview
- The "Generar Nota SOAP" button adapts its behavior per mode

- [ ] **Step 1: Add new imports and state**

At the top of `<script setup>`, add these imports and state variables:

```javascript
// Add to existing imports from lucide-vue-next:
import { Mic, MicOff, Camera, PenLine, Square, Trash2, ImageIcon } from 'lucide-vue-next'

// Add new imports:
import { useAudioRecorder } from '@/composables/useAudioRecorder'
import { callGeminiMultimodal } from '@/services/gemini'

// Input mode state
const inputMode = ref('text') // 'text' | 'audio' | 'scan'

// Audio
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

// Scan
const scanImageBase64 = ref(null)
const scanImagePreview = ref(null)
const scanFileInput = ref(null)
```

- [ ] **Step 2: Update `canGenerate` computed and add scan handlers**

```javascript
// Replace existing canGenerate:
const canGenerate = computed(() => {
  if (!selectedPatientId.value) return false
  if (inputMode.value === 'text') return userInput.value.trim().length > 0
  if (inputMode.value === 'audio') return hasRecording.value
  if (inputMode.value === 'scan') return !!scanImageBase64.value
  return false
})

// Add scan file handler:
function handleScanFile(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Preview
  scanImagePreview.value = URL.createObjectURL(file)

  // Base64
  const reader = new FileReader()
  reader.onloadend = () => {
    scanImageBase64.value = reader.result.split(',')[1]
  }
  reader.readAsDataURL(file)
}

function discardScan() {
  scanImageBase64.value = null
  scanImagePreview.value = null
  if (scanFileInput.value) scanFileInput.value.value = ''
}
```

- [ ] **Step 3: Update `generateSOAP` to handle all 3 modes**

Replace the existing `generateSOAP` function:

```javascript
async function generateSOAP() {
  if (!canGenerate.value) return

  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  soapResult.value = null

  const soapSystemPrompt = `Eres un asistente médico profesional. Genera una nota clínica estructurada en formato SOAP en español mexicano. Sé claro, profesional y conciso.

Genera la nota SOAP con 4 secciones:
- Subjetivo (S): Lo que el paciente reporta
- Objetivo (O): Hallazgos del examen físico y signos vitales
- Evaluación (A): Diagnóstico o diagnósticos diferenciales
- Plan (P): Tratamiento, medicamentos, seguimiento`

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
```

- [ ] **Step 4: Update `saveNote` to store the input source**

```javascript
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

  // Reset all inputs
  soapResult.value = null
  userInput.value = ''
  discardRecording()
  discardScan()

  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
```

- [ ] **Step 5: Replace the Textarea section in the template**

Replace the `<!-- Textarea -->` div (the `<div class="px-5 pb-4 flex-1 ...">` block containing the label and textarea) with:

```html
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

            <!-- MODE: Text (existing) -->
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
                    <p class="text-[12px] text-muted-foreground mt-1 max-w-[280px]">La IA transcribirá el audio y generará la nota SOAP automáticamente</p>
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
                    <!-- Pulsing indicator -->
                    <div class="relative">
                      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                          <Mic class="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div class="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-30"></div>
                    </div>

                    <!-- Timer -->
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span class="text-[20px] font-mono font-bold text-foreground tabular-nums">{{ formattedTime }}</span>
                    </div>

                    <p class="text-[12px] text-muted-foreground">Grabando consulta...</p>

                    <!-- Stop button -->
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
                    <p class="text-[12px] text-muted-foreground mt-1 max-w-[280px]">Toma una foto de tus notas manuscritas y la IA las leerá para generar la nota SOAP</p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="scanFileInput?.click()"
                      class="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-md shadow-medical-600/20"
                    >
                      <Camera class="w-4 h-4" />
                      Tomar foto
                    </button>
                    <label class="flex items-center gap-2 px-5 py-2.5 bg-white border border-border text-foreground text-[13px] font-semibold rounded-xl transition-colors hover:bg-muted cursor-pointer">
                      <ImageIcon class="w-4 h-4" />
                      Subir imagen
                      <input
                        ref="scanFileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleScanFile"
                      />
                    </label>
                  </div>
                  <!-- Hidden camera input -->
                  <input
                    ref="scanFileInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    class="hidden"
                    @change="handleScanFile"
                  />
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
```

- [ ] **Step 6: Update the generate button label**

Replace the generate button text to be contextual:

```html
<span v-if="aiLoading">Generando nota SOAP...</span>
<span v-else-if="inputMode === 'audio'">Transcribir y Generar Nota SOAP</span>
<span v-else-if="inputMode === 'scan'">Analizar y Generar Nota SOAP</span>
<span v-else>Generar Nota SOAP con IA</span>
```

- [ ] **Step 7: Fix duplicate scanFileInput ref**

Note: The scan template has two file inputs. Remove the hidden camera one and update the "Tomar foto" button to also use the label/input pattern but with `capture="environment"`:

```html
<!-- Replace the Tomar foto button + hidden input with: -->
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
```

And remove the standalone `ref="scanFileInput"` hidden input at the bottom.

- [ ] **Step 8: Verify the app compiles**

Run: `cd /Users/federico/Documents/GitHub/mediagenda-mx && npm run dev`
Expected: Compiles without errors, all 3 tabs visible on `/demo/dashboard/notas`

- [ ] **Step 9: Commit**

```bash
git add src/views/dashboard/ClinicalNotesView.vue
git commit -m "feat: add audio recording and photo scan input modes to clinical notes"
```

---

## Summary of Changes

1. **gemini.js** — New `callGeminiMultimodal()` function that sends `inlineData` parts (base64 audio/images) alongside text prompts. Same model fallback logic as existing `callGemini`.

2. **useAudioRecorder.js** — New composable handling `MediaRecorder` API: start/stop recording, timer, base64 encoding, mic permission errors, cleanup on unmount.

3. **ClinicalNotesView.vue** — 3-tab interface:
   - **Notas** (existing text input, unchanged)
   - **Grabar Consulta** (Notion-style: consent → record → review → generate SOAP)
   - **Escanear Notas** (camera/upload → preview → generate SOAP)
   - All modes share the same SOAP result display and save pipeline.
