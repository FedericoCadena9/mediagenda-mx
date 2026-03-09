<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = defineProps({
  level: {
    type: String,
    required: true,
    validator: (v) => ['bajo', 'medio', 'alto'].includes(v),
  },
})

const levelMap = {
  bajo: {
    label: 'Bajo',
    classes: 'bg-green-100 text-green-700 border-green-200',
  },
  medio: {
    label: 'Medio',
    classes: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  alto: {
    label: 'Alto',
    classes: 'bg-red-100 text-red-700 border-red-200',
  },
}

const label = computed(() => levelMap[props.level]?.label ?? props.level)
const classes = computed(() => levelMap[props.level]?.classes ?? 'bg-slate-100 text-slate-700 border-slate-200')
</script>

<template>
  <Badge variant="outline" :class="cn(classes, 'text-[0.65rem] font-semibold leading-none')">
    {{ label }}
  </Badge>
</template>
