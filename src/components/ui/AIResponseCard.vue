<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Card class="bg-violet-50 border-violet-200 py-0">
    <!-- Header -->
    <CardHeader class="pb-0 pt-4 px-4">
      <CardTitle class="flex items-center gap-2 text-sm font-semibold text-violet-800">
        <span class="text-lg">&#x2728;</span>
        {{ title || 'Respuesta IA' }}
      </CardTitle>
    </CardHeader>

    <CardContent class="px-4 pb-4 pt-3">
      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <Skeleton v-for="i in 4" :key="i" class="h-4" :class="i === 4 ? 'w-2/3' : 'w-full'" />
      </div>

      <!-- Content with fade-in -->
      <Transition name="fade" mode="out-in">
        <div v-if="!loading" class="text-sm text-slate-700 leading-relaxed">
          <slot />
        </div>
      </Transition>
    </CardContent>
  </Card>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>
