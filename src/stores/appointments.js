import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useServicesStore } from './services'

// ── Date helpers ──────────────────────────────────────────────────────
function today() {
  const d = new Date()
  return formatDate(d)
}

function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getMondayOfWeek(d) {
  const copy = new Date(d)
  const day = copy.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return copy
}

function addDays(d, n) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function endTimeForSlot(start) {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + 30
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

// ── Slot pools ────────────────────────────────────────────────────────
const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
const afternoonSlots = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
const allSlots = [...morningSlots, ...afternoonSlots]

// ── Seed builder (runs once at store creation) ────────────────────────
function buildSeedAppointments() {
  const now = new Date()
  const monday = getMondayOfWeek(now)
  const appointments = []
  let idCounter = 1

  const serviceIds = ['srv-1', 'srv-2', 'srv-3']
  const patientIds = Array.from({ length: 25 }, (_, i) => `pat-${i + 1}`)

  function makeApt(overrides) {
    const startTime = overrides.startTime || randomItem(allSlots)
    const apt = {
      id: `apt-${idCounter++}`,
      patientId: overrides.patientId || randomItem(patientIds),
      serviceId: overrides.serviceId || randomItem(serviceIds),
      date: overrides.date,
      startTime,
      endTime: endTimeForSlot(startTime),
      status: overrides.status || 'completada',
      patientNotes: overrides.patientNotes || '',
      source: 'demo',
      createdAt: overrides.createdAt || new Date(new Date(overrides.date).getTime() - 86400000 * 2).toISOString(),
    }
    return apt
  }

  // ── 8 this-week appointments ──────────────────────────────────────
  // Spread across Mon-Fri of current week
  const thisWeekConfigs = [
    { dayOffset: 0, status: 'pendiente', startTime: '09:00', patientId: 'pat-1', serviceId: 'srv-1' },
    { dayOffset: 0, status: 'confirmada', startTime: '10:30', patientId: 'pat-3', serviceId: 'srv-2' },
    { dayOffset: 1, status: 'confirmada', startTime: '11:00', patientId: 'pat-5', serviceId: 'srv-1' },
    { dayOffset: 1, status: 'completada', startTime: '16:00', patientId: 'pat-8', serviceId: 'srv-2' },
    { dayOffset: 2, status: 'confirmada', startTime: '09:30', patientId: 'pat-10', serviceId: 'srv-3' },
    { dayOffset: 2, status: 'cancelada', startTime: '17:00', patientId: 'pat-12', serviceId: 'srv-1' },
    { dayOffset: 3, status: 'pendiente', startTime: '12:00', patientId: 'pat-14', serviceId: 'srv-2' },
    { dayOffset: 4, status: 'no_show', startTime: '10:00', patientId: 'pat-16', serviceId: 'srv-1' },
  ]

  for (const cfg of thisWeekConfigs) {
    const date = formatDate(addDays(monday, cfg.dayOffset))
    appointments.push(makeApt({
      date,
      status: cfg.status,
      startTime: cfg.startTime,
      patientId: cfg.patientId,
      serviceId: cfg.serviceId,
      patientNotes: '',
      createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    }))
  }

  // ── 30 historical appointments (past 60 days) ─────────────────────
  // Distribution: 70% completada (21), 15% cancelada (5), 10% no_show (3), 5% pendiente (1) = 30
  const historicalStatuses = [
    ...Array(21).fill('completada'),
    ...Array(5).fill('cancelada'),
    ...Array(3).fill('no_show'),
    ...Array(1).fill('pendiente'),
  ]

  // Shuffle statuses deterministically-ish
  const shuffled = historicalStatuses.slice().sort((a, b) => a.localeCompare(b))

  // Use a fixed seed approach based on index to be deterministic
  const usedPatients = [
    'pat-1', 'pat-2', 'pat-3', 'pat-4', 'pat-5', 'pat-6', 'pat-7', 'pat-8', 'pat-9', 'pat-10',
    'pat-11', 'pat-12', 'pat-13', 'pat-14', 'pat-15', 'pat-16', 'pat-17', 'pat-18', 'pat-19', 'pat-20',
    'pat-21', 'pat-22', 'pat-23', 'pat-24', 'pat-25', 'pat-1', 'pat-3', 'pat-5', 'pat-8', 'pat-10',
  ]

  const usedSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '16:00', '16:30', '17:00', '09:00', '10:00', '11:00', '12:00', '16:00', '17:00',
  ]

  const usedServices = [
    'srv-1', 'srv-2', 'srv-1', 'srv-3', 'srv-2', 'srv-1', 'srv-1', 'srv-2', 'srv-3', 'srv-1',
    'srv-2', 'srv-1', 'srv-3', 'srv-2', 'srv-1', 'srv-1', 'srv-2', 'srv-1', 'srv-3', 'srv-2',
    'srv-1', 'srv-2', 'srv-1', 'srv-3', 'srv-2', 'srv-1', 'srv-2', 'srv-3', 'srv-1', 'srv-2',
  ]

  for (let i = 0; i < 30; i++) {
    // Distribute across past 60 days, only weekdays
    const daysBack = 2 + Math.floor((i / 30) * 58) // spread from -2 to -60 days
    let histDate = addDays(now, -daysBack)
    // Ensure it's a weekday (1-5)
    const dow = histDate.getDay()
    if (dow === 0) histDate = addDays(histDate, -2) // Sun -> Fri
    if (dow === 6) histDate = addDays(histDate, -1) // Sat -> Fri

    appointments.push(makeApt({
      date: formatDate(histDate),
      status: shuffled[i],
      startTime: usedSlots[i],
      patientId: usedPatients[i],
      serviceId: usedServices[i],
      createdAt: new Date(histDate.getTime() - 86400000 * 3).toISOString(),
    }))
  }

  // ── 3 next-week appointments (all pendiente) ─────────────────────
  const nextMonday = addDays(monday, 7)
  const nextWeekConfigs = [
    { dayOffset: 0, startTime: '09:30', patientId: 'pat-2', serviceId: 'srv-1' },
    { dayOffset: 2, startTime: '11:00', patientId: 'pat-7', serviceId: 'srv-2' },
    { dayOffset: 4, startTime: '16:30', patientId: 'pat-19', serviceId: 'srv-3' },
  ]

  for (const cfg of nextWeekConfigs) {
    const date = formatDate(addDays(nextMonday, cfg.dayOffset))
    appointments.push(makeApt({
      date,
      status: 'pendiente',
      startTime: cfg.startTime,
      patientId: cfg.patientId,
      serviceId: cfg.serviceId,
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
    }))
  }

  return appointments
}

// ── Store ─────────────────────────────────────────────────────────────
export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref(buildSeedAppointments())
  let nextId = appointments.value.length + 1

  // ── Actions ─────────────────────────────────────────────────────────
  function addAppointment(data) {
    const startTime = data.startTime
    const appointment = {
      id: `apt-${nextId++}`,
      patientId: data.patientId,
      serviceId: data.serviceId,
      date: data.date,
      startTime,
      endTime: endTimeForSlot(startTime),
      status: data.status || 'pendiente',
      patientNotes: data.patientNotes || '',
      source: data.source || 'manual',
      createdAt: new Date().toISOString(),
    }
    appointments.value.push(appointment)
    return appointment
  }

  function updateStatus(id, newStatus) {
    const apt = appointments.value.find((a) => a.id === id)
    if (apt) {
      apt.status = newStatus
    }
    return apt
  }

  function getTodayAppointments() {
    const t = today()
    return appointments.value
      .filter((a) => a.date === t)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  function getAvailableSlots(date) {
    const d = new Date(date + 'T12:00:00')
    const dow = d.getDay()

    // Check if day is active (1-5)
    if (dow === 0 || dow === 6) return []

    const booked = appointments.value
      .filter((a) => a.date === date && a.status !== 'cancelada')
      .map((a) => a.startTime)

    return allSlots.filter((slot) => !booked.includes(slot))
  }

  // ── Getters ─────────────────────────────────────────────────────────
  const todayAppointments = computed(() => {
    const t = today()
    return appointments.value
      .filter((a) => a.date === t)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  })

  const thisWeekAppointments = computed(() => {
    const now = new Date()
    const mon = getMondayOfWeek(now)
    const sun = addDays(mon, 6)
    const monStr = formatDate(mon)
    const sunStr = formatDate(sun)
    return appointments.value
      .filter((a) => a.date >= monStr && a.date <= sunStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  })

  const thisMonthAppointments = computed(() => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const prefix = `${yyyy}-${mm}`
    return appointments.value
      .filter((a) => a.date.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  })

  const noShowRate = computed(() => {
    const relevant = appointments.value.filter(
      (a) => a.status === 'completada' || a.status === 'no_show'
    )
    if (relevant.length === 0) return 0
    const noShows = relevant.filter((a) => a.status === 'no_show').length
    return Math.round((noShows / relevant.length) * 100 * 10) / 10
  })

  const topService = computed(() => {
    const counts = {}
    for (const a of appointments.value) {
      if (a.status !== 'cancelada') {
        counts[a.serviceId] = (counts[a.serviceId] || 0) + 1
      }
    }
    let maxId = null
    let maxCount = 0
    for (const [id, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count
        maxId = id
      }
    }
    return maxId
  })

  const estimatedRevenue = computed(() => {
    const servicesStore = useServicesStore()
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const prefix = `${yyyy}-${mm}`

    return appointments.value
      .filter((a) => a.date.startsWith(prefix) && a.status === 'completada')
      .reduce((sum, a) => {
        const service = servicesStore.getServiceById(a.serviceId)
        return sum + (service ? service.priceMxn : 0)
      }, 0)
  })

  return {
    appointments,
    addAppointment,
    updateStatus,
    getTodayAppointments,
    getAvailableSlots,
    todayAppointments,
    thisWeekAppointments,
    thisMonthAppointments,
    noShowRate,
    topService,
    estimatedRevenue,
  }
})
