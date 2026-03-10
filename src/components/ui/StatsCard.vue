<script setup>
import { computed } from 'vue'

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
    cyan: 'bg-medical-50 border-medical-100 text-medical-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    red: 'bg-rose-50 border-rose-100 text-rose-600',
    violet: 'bg-violet-50 border-violet-100 text-violet-600',
  }
  return map[props.color] ?? 'bg-medical-50 border-medical-100 text-medical-600'
})
</script>

<template>
  <div class="bg-white border border-border rounded-xl p-4 shadow-card hover:shadow-card-up transition-shadow duration-200">
    <div class="flex items-center gap-3">
      <div
        v-if="icon"
        :class="iconBgClass"
        class="flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-xl"
      >
        {{ icon }}
      </div>
      <div>
        <p class="text-[1.4rem] font-extrabold text-foreground tracking-tight leading-none">{{ value }}</p>
        <p class="text-[13px] font-medium text-muted-foreground mt-1.5">{{ title }}</p>
      </div>
    </div>
  </div>
</template>
