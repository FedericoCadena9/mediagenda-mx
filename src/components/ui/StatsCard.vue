<script setup>
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'cyan',
  },
})

const iconBgClass = computed(() => {
  const map = {
    cyan: 'bg-cyan-100 text-cyan-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    violet: 'bg-violet-100 text-violet-600',
  }
  return map[props.color] ?? 'bg-cyan-100 text-cyan-600'
})
</script>

<template>
  <Card class="py-0">
    <CardContent class="p-4">
      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          :class="iconBgClass"
          class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        >
          {{ icon }}
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
          <p class="text-sm text-slate-500">{{ title }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
