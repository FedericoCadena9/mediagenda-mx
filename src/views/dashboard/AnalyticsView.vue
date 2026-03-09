<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { usePatientsStore } from '@/stores/patients'
import { callGemini } from '@/services/gemini'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import StatsCard from '@/components/ui/StatsCard.vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()
const patientsStore = usePatientsStore()

// Stats
const totalCitasMes = computed(() => appointmentsStore.thisMonthAppointments.length)

const noShowRate = computed(() => appointmentsStore.noShowRate)

const topServiceName = computed(() => {
  const id = appointmentsStore.topService
  if (!id) return '\u2014'
  const s = servicesStore.getServiceById(id)
  return s ? s.name : '\u2014'
})

const estimatedRevenue = computed(() => {
  const val = appointmentsStore.estimatedRevenue
  return `$${val.toLocaleString('es-MX')} MXN`
})

// Bar chart: appointments per day of week (Mon-Fri)
const dayLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie']

const appointmentsPerDay = computed(() => {
  const counts = [0, 0, 0, 0, 0]
  for (const apt of appointmentsStore.appointments) {
    const d = new Date(apt.date + 'T12:00:00')
    const dow = d.getDay()
    if (dow >= 1 && dow <= 5) {
      counts[dow - 1]++
    }
  }
  return counts
})

const barChartData = computed(() => ({
  labels: dayLabels,
  datasets: [
    {
      label: 'Citas',
      data: appointmentsPerDay.value,
      backgroundColor: '#0891b2',
      borderRadius: 6,
    },
  ],
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      grid: { color: '#f1f5f9' },
    },
    x: {
      grid: { display: false },
    },
  },
}

// Doughnut chart: service distribution
const serviceDistribution = computed(() => {
  const counts = {}
  for (const apt of appointmentsStore.appointments) {
    if (apt.status !== 'cancelada') {
      const s = servicesStore.getServiceById(apt.serviceId)
      const name = s ? s.name : 'Otro'
      counts[name] = (counts[name] || 0) + 1
    }
  }
  return counts
})

const doughnutChartData = computed(() => {
  const labels = Object.keys(serviceDistribution.value)
  const data = Object.values(serviceDistribution.value)
  const colors = ['#0891b2', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981']
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }
})

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 10,
        font: { size: 12 },
      },
    },
  },
}

// AI Insight
const aiLoading = ref(false)
const aiInsight = ref('')
const aiError = ref('')
const aiNoKey = ref(false)

async function fetchInsight() {
  aiLoading.value = true
  aiError.value = ''
  aiNoKey.value = false
  aiInsight.value = ''

  const breakdown = Object.entries(serviceDistribution.value)
    .map(([name, count]) => `${name}: ${count}`)
    .join(', ')

  const systemPrompt = `Eres un analista de datos medico. Analiza estas estadisticas de un consultorio en Queretaro y da 2-3 insights accionables en espanol mexicano. Estadisticas: ${totalCitasMes.value} citas este mes, ${noShowRate.value}% tasa de no-shows, servicio mas popular: ${topServiceName.value}, ingresos estimados: ${appointmentsStore.estimatedRevenue} MXN. Distribucion: ${breakdown}.`

  try {
    const result = await callGemini('Genera los insights.', systemPrompt)
    aiInsight.value = result
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      aiNoKey.value = true
    } else {
      aiError.value = 'Error al generar insights. Intenta de nuevo.'
    }
  } finally {
    aiLoading.value = false
  }
}

onMounted(() => {
  fetchInsight()
})
</script>

<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Analitica</h1>
      <p class="text-sm text-slate-500 mt-1">Resumen de rendimiento del consultorio</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard title="Citas este mes" :value="totalCitasMes" icon="&#x1F4C5;" color="cyan" />
      <StatsCard title="Tasa de no-shows" :value="`${noShowRate}%`" icon="&#x26A0;&#xFE0F;" color="red" />
      <StatsCard title="Servicio mas solicitado" :value="topServiceName" icon="&#x2B50;" color="amber" />
      <StatsCard title="Ingresos estimados" :value="estimatedRevenue" icon="&#x1F4B0;" color="green" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Bar Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Citas por dia de la semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64">
            <Bar :data="barChartData" :options="barChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Doughnut Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Distribucion de servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64">
            <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- AI Insight -->
    <Card class="bg-violet-50 border-violet-200">
      <CardContent class="p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">&#x2728;</span>
            <h3 class="text-sm font-semibold text-violet-800">Insight IA</h3>
          </div>
          <Button
            v-if="aiInsight && !aiLoading"
            variant="link"
            size="sm"
            class="text-violet-600 hover:text-violet-700"
            @click="fetchInsight"
          >
            Regenerar
          </Button>
        </div>

        <!-- No API key -->
        <Alert v-if="aiNoKey" class="bg-amber-50 border-amber-200">
          <AlertTitle class="text-amber-800">API Key no configurada</AlertTitle>
          <AlertDescription class="text-amber-800">
            Agrega tu clave de Gemini en la variable de entorno VITE_GEMINI_API_KEY.
          </AlertDescription>
        </Alert>

        <!-- Error -->
        <Alert v-else-if="aiError" variant="destructive">
          <AlertDescription class="flex items-center justify-between">
            <span>{{ aiError }}</span>
            <Button variant="link" size="sm" class="text-red-600 hover:text-red-700" @click="fetchInsight">Reintentar</Button>
          </AlertDescription>
        </Alert>

        <!-- Loading -->
        <div v-else-if="aiLoading" class="space-y-3">
          <Skeleton class="h-4 w-full bg-violet-200" />
          <Skeleton class="h-4 w-5/6 bg-violet-200" />
          <Skeleton class="h-4 w-4/6 bg-violet-200" />
        </div>

        <!-- Result -->
        <div v-else-if="aiInsight" class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {{ aiInsight }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
