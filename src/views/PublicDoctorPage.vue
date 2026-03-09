<script setup>
import { ref, computed, watch } from 'vue'
import { useServicesStore } from '@/stores/services'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

const servicesStore = useServicesStore()
const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()

// ── Doctor info (hardcoded) ──────────────────────────────────────────
const doctor = {
  fullName: 'Dr. Carlos Mendoza',
  specialty: 'Medico General',
  bio: 'Medico General con 8 anos de experiencia. Egresado de la UAQ. Especializado en medicina preventiva y enfermedades cronicas.',
  clinicName: 'Consultorio Medico Dr. Mendoza',
  clinicAddress: 'Av. Universidad 150, Col. Centro',
  clinicCity: 'Queretaro, Qro.',
  phone: '4421234567',
}

// ── Booking state ────────────────────────────────────────────────────
const booking = ref(false)
const currentStep = ref(1)
const selectedServiceId = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const form = ref({
  nombre: '',
  telefono: '',
  email: '',
  notas: '',
})
const formErrors = ref({})
const bookingComplete = ref(false)

const stepLabels = ['Servicio', 'Fecha', 'Hora', 'Datos', 'Confirmacion']

const progressValue = computed(() => ((currentStep.value - 1) / 4) * 100)

// ── Services ─────────────────────────────────────────────────────────
const activeServices = computed(() =>
  servicesStore.services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
)

const selectedService = computed(() =>
  selectedServiceId.value ? servicesStore.getServiceById(selectedServiceId.value) : null
)

// ── Calendar state ───────────────────────────────────────────────────
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const calendarDays = computed(() => {
  const year = calendarYear.value
  const month = calendarMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  for (let i = 0; i < startDow; i++) {
    days.push({ day: null, date: null })
  }

  const todayStr = formatDateStr(new Date())

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(year, month, d)
    const dateStr = formatDateStr(dateObj)
    const dow = dateObj.getDay()
    const isWeekend = dow === 0 || dow === 6
    const isPast = dateStr < todayStr
    const isDisabled = isWeekend || isPast

    days.push({
      day: d,
      date: dateStr,
      isWeekend,
      isPast,
      isDisabled,
      isToday: dateStr === todayStr,
    })
  }

  return days
})

const canGoPrev = computed(() => {
  const now = new Date()
  return calendarYear.value > now.getFullYear() ||
    (calendarYear.value === now.getFullYear() && calendarMonth.value > now.getMonth())
})

// ── Time slots ───────────────────────────────────────────────────────
const allMorningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
const allAfternoonSlots = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

const availableSlots = computed(() => {
  if (!selectedDate.value) return []
  return appointmentsStore.getAvailableSlots(selectedDate.value)
})

const morningSlots = computed(() =>
  allMorningSlots.map((slot) => ({
    time: slot,
    available: availableSlots.value.includes(slot),
  }))
)

const afternoonSlots = computed(() =>
  allAfternoonSlots.map((slot) => ({
    time: slot,
    available: availableSlots.value.includes(slot),
  }))
)

// ── Formatted date ───────────────────────────────────────────────────
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return formatDisplayDate(selectedDate.value)
})

const notasCharCount = computed(() => form.value.notas.length)

const whatsappUrl = computed(() => {
  const serviceName = selectedService.value ? selectedService.value.name : ''
  const text = `Hola, quiero confirmar mi cita para ${serviceName} el ${formattedSelectedDate.value} a las ${selectedTime.value}. Mi nombre es ${form.value.nombre}.`
  return `https://wa.me/521${doctor.phone}?text=${encodeURIComponent(text)}`
})

// ── Helpers ──────────────────────────────────────────────────────────
function formatDateStr(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const monthNamesLong = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  return `${dayNames[date.getDay()]} ${d} de ${monthNamesLong[date.getMonth()]} de ${y}`
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(price)
}

// ── Booking flow ─────────────────────────────────────────────────────
function startBooking(serviceId = null) {
  booking.value = true
  bookingComplete.value = false
  currentStep.value = 1
  selectedServiceId.value = serviceId
  selectedDate.value = null
  selectedTime.value = null
  form.value = { nombre: '', telefono: '', email: '', notas: '' }
  formErrors.value = {}
  calendarMonth.value = new Date().getMonth()
  calendarYear.value = new Date().getFullYear()
}

function cancelBooking() {
  booking.value = false
  currentStep.value = 1
  bookingComplete.value = false
}

function prevMonth() {
  if (!canGoPrev.value) return
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else {
    calendarMonth.value--
  }
}

function nextMonth() {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else {
    calendarMonth.value++
  }
}

function selectDate(day) {
  if (day.isDisabled || !day.date) return
  selectedDate.value = day.date
  selectedTime.value = null
}

function validateForm() {
  const errors = {}
  if (!form.value.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
  }
  if (!form.value.telefono.trim()) {
    errors.telefono = 'El telefono es requerido'
  } else if (!/^\d{10}$/.test(form.value.telefono.trim())) {
    errors.telefono = 'El telefono debe tener 10 digitos'
  }
  if (!form.value.email.trim()) {
    errors.email = 'El email es requerido'
  }
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (currentStep.value === 1 && !selectedServiceId.value) return
  if (currentStep.value === 2 && !selectedDate.value) return
  if (currentStep.value === 3 && !selectedTime.value) return
  if (currentStep.value === 4) {
    if (!validateForm()) return
  }
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function confirmAppointment() {
  const phone = form.value.telefono.trim()
  let patient = patientsStore.patients.find((p) => p.phone === phone)

  if (!patient) {
    patient = patientsStore.addPatient({
      fullName: form.value.nombre.trim(),
      phone,
      email: form.value.email.trim(),
      notes: '',
    })
  }

  appointmentsStore.addAppointment({
    patientId: patient.id,
    serviceId: selectedServiceId.value,
    date: selectedDate.value,
    startTime: selectedTime.value,
    status: 'pendiente',
    patientNotes: form.value.notas.trim(),
    source: 'web',
  })

  bookingComplete.value = true
}

function resetBooking() {
  startBooking()
}

watch(selectedDate, () => {
  selectedTime.value = null
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Demo Banner -->
    <div class="bg-cyan-600 text-white text-center py-2 px-4 text-sm">
      <router-link to="/" class="hover:underline">
        &#128269; Estas viendo la demo &mdash; Ver precios
      </router-link>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Doctor Hero Section -->
      <Card class="mb-8 shadow-lg">
        <CardContent class="p-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <!-- Initials Avatar -->
            <div
              class="w-20 h-20 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0"
            >
              CM
            </div>

            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-bold text-slate-800">{{ doctor.fullName }}</h1>
              <p class="text-cyan-600 font-medium mt-0.5">{{ doctor.specialty }}</p>
              <p class="text-slate-500 text-sm mt-1">&#128205; {{ doctor.clinicCity }}</p>
              <p class="text-slate-600 text-sm mt-3 leading-relaxed">{{ doctor.bio }}</p>

              <Separator class="my-4" />
              <div class="text-sm text-slate-500 space-y-1">
                <p class="font-medium text-slate-700">{{ doctor.clinicName }}</p>
                <p>{{ doctor.clinicAddress }}</p>
                <p>{{ doctor.clinicCity }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Services Section -->
      <div v-if="!booking">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Servicios</h2>
        <div class="space-y-3">
          <Card
            v-for="service in activeServices"
            :key="service.id"
            class="shadow"
          >
            <CardContent class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 class="font-semibold text-slate-800">{{ service.name }}</h3>
                <div class="flex items-center gap-3 mt-1.5">
                  <Badge variant="secondary">30 min</Badge>
                  <span class="text-sm font-bold text-slate-800">{{ formatPrice(service.priceMxn) }} MXN</span>
                </div>
              </div>
              <Button @click="startBooking(service.id)" class="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700">
                Agendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Booking Widget -->
      <Card v-if="booking" class="shadow-lg">
        <CardContent class="p-6">
          <!-- Step Indicator -->
          <div v-if="!bookingComplete" class="mb-8">
            <div class="flex items-center justify-between">
              <div
                v-for="(label, idx) in stepLabels"
                :key="idx"
                class="flex flex-col items-center flex-1"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 transition-colors"
                  :class="
                    idx + 1 <= currentStep
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  "
                >
                  {{ idx + 1 }}
                </div>
                <span
                  class="text-xs hidden sm:block"
                  :class="idx + 1 <= currentStep ? 'text-cyan-600 font-medium' : 'text-slate-400'"
                >
                  {{ label }}
                </span>
              </div>
            </div>
            <!-- Progress bar -->
            <Progress :model-value="progressValue" class="mt-3 h-1" />
          </div>

          <!-- Step 1: Servicio -->
          <div v-if="currentStep === 1 && !bookingComplete">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Selecciona un servicio</h3>
            <div class="space-y-3">
              <button
                v-for="service in activeServices"
                :key="service.id"
                @click="selectedServiceId = service.id"
                class="w-full text-left p-4 rounded-xl border-2 transition-colors"
                :class="
                  selectedServiceId === service.id
                    ? 'border-cyan-600 bg-cyan-50'
                    : 'border-slate-200 hover:border-slate-300'
                "
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-slate-800">{{ service.name }}</p>
                    <p class="text-sm text-slate-500 mt-0.5">{{ service.description }}</p>
                  </div>
                  <div class="text-right flex-shrink-0 ml-4">
                    <p class="font-semibold text-slate-800">{{ formatPrice(service.priceMxn) }} MXN</p>
                    <p class="text-xs text-slate-500">30 min</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Step 2: Fecha -->
          <div v-if="currentStep === 2 && !bookingComplete">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Selecciona una fecha</h3>

            <!-- Month navigation -->
            <div class="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                :disabled="!canGoPrev"
                @click="prevMonth"
              >
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <span class="font-semibold text-slate-700">
                {{ monthNames[calendarMonth] }} {{ calendarYear }}
              </span>
              <Button variant="ghost" size="icon" @click="nextMonth">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            <!-- Day names header -->
            <div class="grid grid-cols-7 gap-1 mb-1">
              <div
                v-for="name in ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']"
                :key="name"
                class="text-center text-xs font-medium text-slate-400 py-1"
              >
                {{ name }}
              </div>
            </div>

            <!-- Calendar grid -->
            <div class="grid grid-cols-7 gap-1">
              <div v-for="(day, idx) in calendarDays" :key="idx" class="aspect-square flex items-center justify-center">
                <button
                  v-if="day.day !== null"
                  @click="selectDate(day)"
                  :disabled="day.isDisabled"
                  class="w-full h-full rounded-lg text-sm font-medium transition-colors"
                  :class="[
                    day.isDisabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : selectedDate === day.date
                        ? 'bg-cyan-600 text-white'
                        : day.isToday
                          ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                          : 'text-slate-700 hover:bg-slate-100',
                  ]"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>

            <p v-if="selectedDate" class="text-sm text-cyan-600 font-medium mt-4 text-center capitalize">
              {{ formattedSelectedDate }}
            </p>
          </div>

          <!-- Step 3: Hora -->
          <div v-if="currentStep === 3 && !bookingComplete">
            <h3 class="text-lg font-semibold text-slate-800 mb-1">Selecciona un horario</h3>
            <p class="text-sm text-slate-500 mb-5 capitalize">{{ formattedSelectedDate }}</p>

            <!-- Morning slots -->
            <div class="mb-5">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Manana</p>
              <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                <Button
                  v-for="slot in morningSlots"
                  :key="slot.time"
                  :variant="selectedTime === slot.time ? 'default' : 'outline'"
                  :disabled="!slot.available"
                  size="sm"
                  :class="[
                    !slot.available
                      ? 'opacity-40 cursor-not-allowed'
                      : selectedTime === slot.time
                        ? 'bg-cyan-600 hover:bg-cyan-700'
                        : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50',
                  ]"
                  @click="slot.available && (selectedTime = slot.time)"
                >
                  {{ slot.time }}
                </Button>
              </div>
            </div>

            <!-- Afternoon slots -->
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tarde</p>
              <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                <Button
                  v-for="slot in afternoonSlots"
                  :key="slot.time"
                  :variant="selectedTime === slot.time ? 'default' : 'outline'"
                  :disabled="!slot.available"
                  size="sm"
                  :class="[
                    !slot.available
                      ? 'opacity-40 cursor-not-allowed'
                      : selectedTime === slot.time
                        ? 'bg-cyan-600 hover:bg-cyan-700'
                        : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50',
                  ]"
                  @click="slot.available && (selectedTime = slot.time)"
                >
                  {{ slot.time }}
                </Button>
              </div>
            </div>

            <div v-if="availableSlots.length === 0" class="text-center text-slate-500 text-sm mt-4">
              No hay horarios disponibles para esta fecha. Intenta otro dia.
            </div>
          </div>

          <!-- Step 4: Datos -->
          <div v-if="currentStep === 4 && !bookingComplete">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Tus datos</h3>

            <div class="space-y-4">
              <div>
                <Label class="mb-1">
                  Nombre completo <span class="text-red-500">*</span>
                </Label>
                <Input
                  v-model="form.nombre"
                  type="text"
                  :class="formErrors.nombre ? 'border-red-400' : ''"
                  placeholder="Tu nombre completo"
                />
                <p v-if="formErrors.nombre" class="text-xs text-red-500 mt-1">{{ formErrors.nombre }}</p>
              </div>

              <div>
                <Label class="mb-1">
                  Telefono (10 digitos) <span class="text-red-500">*</span>
                </Label>
                <Input
                  v-model="form.telefono"
                  type="tel"
                  maxlength="10"
                  :class="formErrors.telefono ? 'border-red-400' : ''"
                  placeholder="4421234567"
                />
                <p v-if="formErrors.telefono" class="text-xs text-red-500 mt-1">{{ formErrors.telefono }}</p>
              </div>

              <div>
                <Label class="mb-1">
                  Correo electronico <span class="text-red-500">*</span>
                </Label>
                <Input
                  v-model="form.email"
                  type="email"
                  :class="formErrors.email ? 'border-red-400' : ''"
                  placeholder="tu@email.com"
                />
                <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">{{ formErrors.email }}</p>
              </div>

              <div>
                <Label class="mb-1">
                  Notas para el doctor <span class="text-slate-400 font-normal">(opcional, max. 300 caracteres)</span>
                </Label>
                <Textarea
                  v-model="form.notas"
                  maxlength="300"
                  :rows="3"
                  class="resize-none"
                  placeholder="Describe brevemente el motivo de tu consulta..."
                />
                <p class="text-xs text-slate-400 text-right">{{ notasCharCount }}/300</p>
              </div>
            </div>
          </div>

          <!-- Step 5: Confirmacion -->
          <div v-if="currentStep === 5 && !bookingComplete">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Confirma tu cita</h3>

            <div class="bg-slate-50 rounded-xl p-5 space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">Servicio</span>
                <span class="font-medium text-slate-800">{{ selectedService?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Precio</span>
                <span class="font-medium text-slate-800">{{ formatPrice(selectedService?.priceMxn ?? 0) }} MXN</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Fecha</span>
                <span class="font-medium text-slate-800 capitalize">{{ formattedSelectedDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Hora</span>
                <span class="font-medium text-slate-800">{{ selectedTime }}</span>
              </div>
              <Separator />
              <div class="flex justify-between">
                <span class="text-slate-500">Paciente</span>
                <span class="font-medium text-slate-800">{{ form.nombre }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Telefono</span>
                <span class="font-medium text-slate-800">{{ form.telefono }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Email</span>
                <span class="font-medium text-slate-800">{{ form.email }}</span>
              </div>
              <div v-if="form.notas.trim()" class="flex justify-between">
                <span class="text-slate-500">Notas</span>
                <span class="font-medium text-slate-700 text-right max-w-[60%]">{{ form.notas }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <Button @click="confirmAppointment" class="w-full bg-cyan-600 hover:bg-cyan-700">
                Confirmar cita
              </Button>
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">
                <Button variant="default" class="w-full bg-green-600 hover:bg-green-700 mt-2">
                  Confirmar por WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <!-- Booking Complete -->
          <div v-if="bookingComplete" class="text-center py-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">
              Cita agendada exitosamente! &#127881;
            </h3>
            <p class="text-slate-600 mb-2">
              Tu cita para <span class="font-medium">{{ selectedService?.name }}</span> ha sido registrada.
            </p>
            <p class="text-sm text-slate-500 mb-6 capitalize">
              {{ formattedSelectedDate }} a las {{ selectedTime }}
            </p>

            <div class="space-y-3">
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">
                <Button variant="default" class="w-full bg-green-600 hover:bg-green-700">
                  Confirmar por WhatsApp
                </Button>
              </a>
              <Button variant="outline" class="w-full" @click="resetBooking">
                Agendar otra cita
              </Button>
            </div>
          </div>

          <!-- Navigation -->
          <div
            v-if="!bookingComplete"
            class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200"
          >
            <div>
              <Button
                v-if="currentStep > 1"
                variant="ghost"
                size="sm"
                @click="prevStep"
              >
                &larr; Anterior
              </Button>
            </div>

            <div class="flex items-center gap-3">
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600" @click="cancelBooking">
                Cancelar
              </Button>
              <Button
                v-if="currentStep < 5"
                @click="nextStep"
                class="bg-cyan-600 hover:bg-cyan-700"
                :disabled="
                  (currentStep === 1 && !selectedServiceId) ||
                  (currentStep === 2 && !selectedDate) ||
                  (currentStep === 3 && !selectedTime)
                "
              >
                Siguiente &rarr;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
