<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const statusMap = {
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  confirmada: {
    label: 'Confirmada',
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  en_curso: {
    label: 'En curso',
    classes: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  completada: {
    label: 'Completada',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelada: {
    label: 'Cancelada',
    classes: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  no_show: {
    label: 'No asistió',
    classes: 'bg-red-100 text-red-800 border-red-200',
  },
}

const label = computed(() => statusMap[props.status]?.label ?? props.status)
const classes = computed(() => statusMap[props.status]?.classes ?? 'bg-muted text-foreground border-border')
</script>

<template>
  <Badge variant="outline" :class="cn(classes)">
    {{ label }}
  </Badge>
</template>
