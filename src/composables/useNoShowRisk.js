import { computed } from 'vue'

export function useNoShowRisk(patientId, appointmentsStore) {
  const risk = computed(() => {
    const allAppointments = appointmentsStore.appointments.filter(
      (a) => a.patientId === patientId
    )

    // First-time patient: 0 or 1 total appointments
    if (allAppointments.length <= 1) {
      return { level: 'medio', color: 'yellow' }
    }

    const noShows = allAppointments.filter(
      (a) => a.status === 'no-show'
    ).length

    if (noShows >= 2) {
      return { level: 'alto', color: 'red' }
    }
    if (noShows === 1) {
      return { level: 'medio', color: 'yellow' }
    }
    return { level: 'bajo', color: 'green' }
  })

  return risk
}
