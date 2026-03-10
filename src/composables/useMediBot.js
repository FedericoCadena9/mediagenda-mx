import { ref } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { useServicesStore } from '@/stores/services'
import { useScheduleStore } from '@/stores/schedule'
import { callGemini } from '@/services/gemini'

export function useMediBot() {
  const messages = ref([
    {
      id: 'welcome',
      role: 'bot',
      text: '¡Hola! Soy MediBot, tu asistente clínico. Puedo ayudarte con información sobre citas, pacientes, servicios y más. ¿En qué puedo ayudarte?',
    },
  ])
  const loading = ref(false)

  function getDataContext() {
    const appointments = useAppointmentsStore()
    const patients = usePatientsStore()
    const services = useServicesStore()
    const schedule = useScheduleStore()

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const todayApts = appointments.todayAppointments
    const weekApts = appointments.thisWeekAppointments
    const monthApts = appointments.thisMonthAppointments

    const statusCounts = {}
    for (const apt of appointments.appointments) {
      statusCounts[apt.status] = (statusCounts[apt.status] || 0) + 1
    }

    const todayDetail = todayApts.map((a) => {
      const p = patients.getPatientById(a.patientId)
      const s = services.getServiceById(a.serviceId)
      return `- ${a.startTime}-${a.endTime}: ${p?.fullName || 'Desconocido'} — ${s?.name || 'Servicio'} (${a.status})`
    }).join('\n')

    const upcomingPending = appointments.appointments
      .filter((a) => a.date >= todayStr && (a.status === 'pendiente' || a.status === 'confirmada'))
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 10)
      .map((a) => {
        const p = patients.getPatientById(a.patientId)
        const s = services.getServiceById(a.serviceId)
        return `- ${a.date} ${a.startTime}: ${p?.fullName || 'Desconocido'} — ${s?.name || 'Servicio'} (${a.status})`
      }).join('\n')

    const servicesList = services.services.map((s) =>
      `- ${s.name}: $${s.priceMxn} MXN, ${s.durationMinutes} min`
    ).join('\n')

    const recentPatients = [...patients.patients]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((p) => `- ${p.fullName} (${p.phone}, ${p.email})`)
      .join('\n')

    const notesOverview = patients.clinicalNotes.slice(0, 5).map((n) => {
      const p = patients.getPatientById(n.patientId)
      return `- ${p?.fullName || 'Desconocido'}: ${n.soapA?.split('.')[0] || 'Sin diagnóstico'}`
    }).join('\n')

    const scheduleInfo = schedule.schedule
      .filter((s) => s.isActive)
      .map((s) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        return `- ${days[s.dayOfWeek]}: ${s.startTime} - ${s.endTime}`
      }).join('\n')

    return `
DATOS DEL CONSULTORIO DEL DR. CARLOS MENDOZA (Querétaro):

FECHA DE HOY: ${todayStr}

CITAS DE HOY (${todayApts.length}):
${todayDetail || '(Sin citas hoy)'}

PRÓXIMAS CITAS PENDIENTES/CONFIRMADAS:
${upcomingPending || '(Ninguna)'}

ESTADÍSTICAS GENERALES:
- Total pacientes registrados: ${patients.patients.length}
- Total citas: ${appointments.appointments.length}
- Citas este mes: ${monthApts.length}
- Citas esta semana: ${weekApts.length}
- Tasa de no-shows: ${appointments.noShowRate}%
- Ingresos estimados del mes: $${appointments.estimatedRevenue.toLocaleString('es-MX')} MXN
- Servicio más solicitado: ${services.getServiceById(appointments.topService)?.name || 'N/A'}
- Desglose por status: ${Object.entries(statusCounts).map(([k, v]) => `${k}: ${v}`).join(', ')}

SERVICIOS:
${servicesList}

ÚLTIMOS PACIENTES REGISTRADOS:
${recentPatients}

NOTAS CLÍNICAS RECIENTES:
${notesOverview || '(Sin notas)'}

HORARIO DEL CONSULTORIO:
${scheduleInfo}
`.trim()
  }

  async function sendMessage(text) {
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    }
    messages.value.push(userMsg)
    loading.value = true

    try {
      const context = getDataContext()
      const systemPrompt = `Eres MediBot, el asistente clínico inteligente del consultorio del Dr. Carlos Mendoza en Querétaro, México. Respondes en español mexicano, de forma breve, clara y profesional.

Tienes acceso a los datos reales del consultorio. Usa SOLO la información proporcionada abajo para responder. No inventes datos.

${context}

INSTRUCCIONES:
- Responde de forma concisa (máximo 3-4 oraciones o una lista breve).
- Si te piden datos que no están en el contexto, dilo honestamente.
- Usa formato simple, sin markdown complejo. Puedes usar guiones para listas.
- Sé amable pero profesional.
- Si preguntan algo que no es sobre el consultorio, redirige amablemente.`

      const response = await callGemini(text, systemPrompt)
      messages.value.push({
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: response,
      })
    } catch (err) {
      let errorText
      if (err.message === 'NO_API_KEY') {
        errorText = 'No tengo acceso a IA en este momento (falta configurar VITE_GEMINI_API_KEY). Configúrala para activar respuestas inteligentes.'
      } else if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
        errorText = 'He alcanzado el límite de consultas por ahora. Intenta de nuevo en unos minutos.'
      } else {
        errorText = 'Hubo un problema al procesar tu consulta. Intenta de nuevo.'
      }
      messages.value.push({
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: errorText,
        isError: true,
      })
    } finally {
      loading.value = false
    }
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}
