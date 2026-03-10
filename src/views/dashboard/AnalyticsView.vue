<script setup>
import { ref, computed, onMounted } from 'vue'
import { motion } from 'motion-v'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'
import { usePatientsStore } from '@/stores/patients'
import { callGemini } from '@/services/gemini'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import {
  CalendarDays,
  UserX,
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()
const patientsStore = usePatientsStore()

onMounted(() => {
  fetchInsight()
})

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
  return `$${val.toLocaleString('es-MX')}`
})

const statsCards = computed(() => [
  {
    title: 'Citas este mes',
    value: totalCitasMes.value,
    icon: CalendarDays,
    accent: 'medical',
    trend: '+12%',
    positive: true,
    progress: Math.min(100, (totalCitasMes.value / 30) * 100),
  },
  {
    title: 'Tasa de no-shows',
    value: `${noShowRate.value}%`,
    icon: UserX,
    accent: 'rose',
    trend: noShowRate.value > 10 ? '+2.1%' : '-1.3%',
    positive: noShowRate.value <= 10,
    progress: 100 - noShowRate.value,
  },
  {
    title: 'Servicio mas solicitado',
    value: topServiceName.value,
    icon: Star,
    accent: 'amber',
    trend: null,
    positive: true,
    progress: 85,
  },
  {
    title: 'Ingresos estimados',
    value: estimatedRevenue.value,
    subtitle: 'MXN',
    icon: DollarSign,
    accent: 'emerald',
    trend: '+8.4%',
    positive: true,
    progress: 72,
  },
])

const accentClasses = {
  medical: {
    iconBg: 'bg-medical-50 border-medical-100',
    iconText: 'text-medical-600',
    dot: 'bg-medical-500',
    gradient: 'from-medical-500 to-medical-400',
    ringColor: 'stroke-medical-500',
    ringBg: 'stroke-medical-100',
    trendBg: 'bg-medical-50',
    trendText: 'text-medical-700',
  },
  rose: {
    iconBg: 'bg-rose-50 border-rose-100',
    iconText: 'text-rose-500',
    dot: 'bg-rose-500',
    gradient: 'from-rose-500 to-rose-400',
    ringColor: 'stroke-rose-500',
    ringBg: 'stroke-rose-100',
    trendBg: 'bg-rose-50',
    trendText: 'text-rose-700',
  },
  amber: {
    iconBg: 'bg-amber-50 border-amber-100',
    iconText: 'text-amber-500',
    dot: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-400',
    ringColor: 'stroke-amber-500',
    ringBg: 'stroke-amber-100',
    trendBg: 'bg-amber-50',
    trendText: 'text-amber-700',
  },
  emerald: {
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconText: 'text-emerald-500',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-400',
    ringColor: 'stroke-emerald-500',
    ringBg: 'stroke-emerald-100',
    trendBg: 'bg-emerald-50',
    trendText: 'text-emerald-700',
  },
}

// Bar chart: appointments per day of week (Mon-Fri)
const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

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
      backgroundColor: (ctx) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return '#088BB2'
        const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, '#0CADD4')
        gradient.addColorStop(1, '#076F90')
        return gradient
      },
      borderRadius: 8,
      borderSkipped: false,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
    },
  ],
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: '#0A3040',
      titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
      bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx) => `${ctx.parsed.y} citas`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 2,
        font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
        color: '#506478',
        padding: 8,
      },
      grid: { color: '#E8ECF1', drawBorder: false },
      border: { display: false },
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
        color: '#506478',
        padding: 4,
      },
      border: { display: false },
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

const doughnutColors = ['#088BB2', '#D97706', '#E11D48', '#7C3AED', '#059669']

const doughnutChartData = computed(() => {
  const labels = Object.keys(serviceDistribution.value)
  const data = Object.values(serviceDistribution.value)
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: doughnutColors.slice(0, labels.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 0,
        hoverOffset: 6,
      },
    ],
  }
})

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0A3040',
      titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
      bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 4,
      usePointStyle: true,
    },
  },
}

const serviceTotal = computed(() => Object.values(serviceDistribution.value).reduce((a, b) => a + b, 0))

const serviceEntries = computed(() => {
  const entries = Object.entries(serviceDistribution.value)
  return entries.map(([name, count], idx) => ({
    name,
    count,
    pct: serviceTotal.value ? Math.round((count / serviceTotal.value) * 100) : 0,
    color: doughnutColors[idx] || '#94a3b8',
  }))
})

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
</script>

<template>
  <div class="p-5 sm:p-6 lg:p-7 space-y-5">

    <!-- ═══ HEADER ═══ -->
    <motion.div
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
    >
      <h1 class="text-[1.65rem] font-extrabold text-foreground tracking-tight">Analítica</h1>
      <p class="mt-0.5 text-[13px] text-muted-foreground">Resumen de rendimiento del consultorio</p>
    </motion.div>

    <!-- ═══ STATS CARDS ═══ -->
    <motion.div
      class="grid grid-cols-2 lg:grid-cols-4 gap-3"
      :initial="'hidden'"
      :animate="'visible'"
      :transition="{ staggerChildren: 0.06 }"
    >
      <motion.div
        v-for="(stat, idx) in statsCards"
        :key="stat.title"
        :variants="{
          hidden: { opacity: 0, y: 12, scale: 0.97 },
          visible: { opacity: 1, y: 0, scale: 1 }
        }"
        :transition="{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }"
      >
        <motion.div
          class="stat-card relative overflow-hidden border border-border rounded-2xl shadow-card p-4 lg:p-5 group cursor-default"
          :whileHover="{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }"
        >
          <!-- Left accent bar -->
          <div
            class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="accentClasses[stat.accent].gradient"
          ></div>

          <!-- Subtle corner glow on hover -->
          <div
            class="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
            :class="`bg-gradient-to-br ${accentClasses[stat.accent].gradient}`"
            style="opacity: 0;"
          ></div>
          <div
            class="stat-glow absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            :class="`bg-gradient-to-br ${accentClasses[stat.accent].gradient}`"
          ></div>

          <!-- Icon with progress ring -->
          <div class="flex items-start justify-between mb-3.5">
            <div class="relative">
              <svg class="w-11 h-11" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke-width="2.5" class="opacity-40" :class="accentClasses[stat.accent].ringBg" />
                <circle
                  cx="22" cy="22" r="18"
                  fill="none" stroke-width="2.5"
                  stroke-linecap="round"
                  :class="accentClasses[stat.accent].ringColor"
                  :stroke-dasharray="`${(stat.progress || 70) * 1.13} 113.1`"
                  transform="rotate(-90 22 22)"
                  class="stat-ring-progress"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="stat.icon" class="w-[16px] h-[16px]" :class="accentClasses[stat.accent].iconText" />
              </div>
            </div>

            <!-- Trend pill -->
            <span
              v-if="stat.trend"
              class="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight"
              :class="stat.positive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'"
            >
              <TrendingUp v-if="stat.positive" class="w-2.5 h-2.5" />
              <TrendingDown v-else class="w-2.5 h-2.5" />
              {{ stat.trend }}
            </span>
          </div>

          <!-- Value -->
          <p class="text-[1.5rem] lg:text-[1.65rem] font-extrabold text-foreground tracking-tight leading-none">
            {{ stat.value }}
          </p>
          <span v-if="stat.subtitle" class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider ml-0.5">{{ stat.subtitle }}</span>

          <!-- Label -->
          <p class="mt-1.5 text-[12px] font-medium text-muted-foreground leading-tight">{{ stat.title }}</p>
        </motion.div>
      </motion.div>
    </motion.div>

    <!-- ═══ CHARTS ROW ═══ -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">

      <!-- Bar Chart (3/5) -->
      <motion.div
        class="lg:col-span-3"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="border border-border rounded-2xl shadow-card h-full flex flex-col">
          <div class="flex items-center justify-between px-5 pt-4 pb-1">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-medical-50 border border-medical-100 flex items-center justify-center">
                <BarChart3 class="w-4 h-4 text-medical-600" />
              </div>
              <div>
                <h3 class="text-[15px] font-bold text-foreground">Citas por día</h3>
                <p class="text-[11px] text-muted-foreground">Distribución semanal</p>
              </div>
            </div>
            <span class="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
              Esta semana
            </span>
          </div>
          <div class="flex-1 px-5 pb-5 pt-2">
            <div class="h-56 lg:h-64">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Doughnut Chart (2/5) -->
      <motion.div
        class="lg:col-span-2"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="border border-border rounded-2xl shadow-card h-full flex flex-col">
          <div class="flex items-center justify-between px-5 pt-4 pb-1">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                <PieChart class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 class="text-[15px] font-bold text-foreground">Servicios</h3>
                <p class="text-[11px] text-muted-foreground">Distribución total</p>
              </div>
            </div>
          </div>

          <div class="flex-1 px-5 pb-4 pt-2 flex flex-col">
            <!-- Chart -->
            <div class="h-44 flex-shrink-0 relative">
              <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
              <!-- Center label -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="text-center">
                  <p class="text-[1.4rem] font-extrabold text-foreground leading-none">{{ serviceTotal }}</p>
                  <p class="text-[10px] text-muted-foreground font-medium mt-0.5">total</p>
                </div>
              </div>
            </div>

            <!-- Custom legend -->
            <div class="mt-3 space-y-2">
              <div
                v-for="entry in serviceEntries"
                :key="entry.name"
                class="flex items-center justify-between group"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: entry.color }" />
                  <span class="text-[12px] font-medium text-foreground">{{ entry.name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold text-foreground">{{ entry.count }}</span>
                  <span class="text-[10px] text-muted-foreground font-medium w-8 text-right">{{ entry.pct }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- ═══ AI INSIGHT BANNER ═══ -->
    <motion.div
      :initial="{ opacity: 0, scale: 0.97 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }"
    >
      <div class="relative rounded-2xl overflow-hidden"
           style="background: linear-gradient(145deg, #0A3040 0%, #076F90 40%, #088BB2 70%, #0CADD4 100%)">
        <!-- Subtle pattern overlay -->
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.08]" style="background: radial-gradient(circle, #5EDCF6 0%, transparent 70%)"></div>
        <div class="absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-[0.05]" style="background: radial-gradient(circle, #ffffff 0%, transparent 70%)"></div>

        <div class="relative z-10 p-5">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                <Sparkles class="w-4 h-4 text-medical-200" />
              </div>
              <div>
                <h3 class="text-[14px] font-bold text-white">Insight IA</h3>
                <p class="text-[10px] text-white/40">Análisis inteligente de tus métricas</p>
              </div>
            </div>
            <Button
              v-if="aiInsight && !aiLoading"
              variant="ghost"
              size="sm"
              class="text-white/50 hover:text-white hover:bg-white/10 text-[11px] gap-1.5 h-7 px-2.5"
              @click="fetchInsight"
            >
              <RefreshCw class="w-3 h-3" />
              Regenerar
            </Button>
          </div>

          <!-- No API key -->
          <div v-if="aiNoKey" class="bg-white/[0.08] rounded-xl border border-white/[0.06] p-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle class="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p class="text-[13px] font-semibold text-white">API Key no configurada</p>
                <p class="text-[11px] text-white/50 mt-1 leading-relaxed">
                  Agrega tu clave de Gemini en la variable de entorno <code class="text-medical-300 bg-white/[0.08] px-1.5 py-0.5 rounded text-[10px]">VITE_GEMINI_API_KEY</code>
                </p>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="aiError" class="bg-white/[0.08] rounded-xl border border-white/[0.06] p-4">
            <div class="flex items-center justify-between">
              <p class="text-[12px] text-white/70">{{ aiError }}</p>
              <Button
                variant="ghost"
                size="sm"
                class="text-white/50 hover:text-white hover:bg-white/10 text-[11px] h-7 px-2.5"
                @click="fetchInsight"
              >
                Reintentar
              </Button>
            </div>
          </div>

          <!-- Loading -->
          <div v-else-if="aiLoading" class="space-y-3">
            <div class="h-3.5 rounded-full bg-white/[0.08] animate-pulse w-full" />
            <div class="h-3.5 rounded-full bg-white/[0.08] animate-pulse w-5/6" />
            <div class="h-3.5 rounded-full bg-white/[0.08] animate-pulse w-4/6" />
          </div>

          <!-- Result -->
          <div v-else-if="aiInsight" class="text-[12.5px] text-white/80 leading-relaxed whitespace-pre-line">
            {{ aiInsight }}
          </div>
        </div>
      </div>
    </motion.div>

  </div>
</template>

<style scoped>
/* Stat card hover elevation */
.stat-card {
  transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
}
.stat-card:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.06),
    0 20px 40px -8px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.08);
}

/* Corner glow on hover */
.stat-glow {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.stat-card:hover .stat-glow {
  opacity: 0.07;
}

/* Ring progress animation on load */
.stat-ring-progress {
  animation: ring-draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  stroke-dashoffset: 113.1;
}
@keyframes ring-draw {
  from { stroke-dashoffset: 113.1; }
  to { stroke-dashoffset: 0; }
}
</style>
