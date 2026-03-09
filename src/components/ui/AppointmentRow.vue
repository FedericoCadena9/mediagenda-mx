<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge.vue'
import RiskBadge from './RiskBadge.vue'
import { useNoShowRisk } from '../../composables/useNoShowRisk.js'
import { useAppointmentsStore } from '../../stores/appointments.js'

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update-status'])

const appointmentsStore = useAppointmentsStore()
const risk = useNoShowRisk(
  computed(() => props.appointment.patientId),
  appointmentsStore
)

const formattedTime = computed(() => {
  if (!props.appointment.time) return ''
  return props.appointment.time
})

const terminalStatuses = ['completada', 'cancelada', 'no_show']

const isTerminal = computed(() =>
  terminalStatuses.includes(props.appointment.status)
)

function updateStatus(newStatus) {
  emit('update-status', props.appointment.id, newStatus)
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
  >
    <!-- Time -->
    <div class="flex-shrink-0 text-sm font-semibold text-slate-700 w-16">
      {{ formattedTime }}
    </div>

    <!-- Patient & Service -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-900 truncate">{{ patientName }}</p>
      <p class="text-xs text-slate-500 truncate">{{ serviceName }}</p>
    </div>

    <!-- Badges -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <StatusBadge :status="appointment.status" />
      <RiskBadge v-if="risk" :level="risk.level" />
    </div>

    <!-- Action Buttons -->
    <div v-if="showActions && !isTerminal" class="flex items-center gap-2 flex-shrink-0">
      <!-- Pendiente actions -->
      <template v-if="appointment.status === 'pendiente'">
        <Button
          variant="outline"
          size="sm"
          class="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          @click="updateStatus('confirmada')"
        >
          Confirmar
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
          @click="updateStatus('cancelada')"
        >
          Cancelar
        </Button>
      </template>

      <!-- Confirmada actions -->
      <template v-if="appointment.status === 'confirmada'">
        <Button
          variant="outline"
          size="sm"
          class="text-xs bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200"
          @click="updateStatus('en_curso')"
        >
          Iniciar
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
          @click="updateStatus('cancelada')"
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          class="text-xs bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          @click="updateStatus('no_show')"
        >
          No asistió
        </Button>
      </template>

      <!-- En curso actions -->
      <template v-if="appointment.status === 'en_curso'">
        <Button
          variant="outline"
          size="sm"
          class="text-xs bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          @click="updateStatus('completada')"
        >
          Completar
        </Button>
      </template>
    </div>
  </div>
</template>
