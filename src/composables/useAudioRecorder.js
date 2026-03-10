import { ref, computed, onUnmounted } from 'vue'

export function useAudioRecorder() {
  const isRecording = ref(false)
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
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/webm'

      mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioMimeType.value = mimeType.split(';')[0]

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mimeType })
        const reader = new FileReader()
        reader.onloadend = () => {
          audioBase64.value = reader.result.split(',')[1]
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start(1000)
      isRecording.value = true
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
