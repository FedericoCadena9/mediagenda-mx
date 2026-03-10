<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-vue-next'

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
  <Card class="ai-response-card relative overflow-hidden border-emerald-200/60 py-0" :class="loading ? 'ai-card-glow' : 'shadow-ai'">
    <!-- Animated gradient border top -->
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500" :class="loading ? 'ai-shimmer-bar' : ''"></div>

    <!-- Subtle gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 pointer-events-none"></div>

    <!-- Decorative floating particles -->
    <div class="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-300/30" style="animation: ai-float 4s ease-in-out infinite"></div>
    <div class="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-emerald-400/20" style="animation: ai-float-delayed 5s ease-in-out 1s infinite"></div>
    <div class="absolute bottom-4 right-6 w-1 h-1 rounded-full bg-emerald-300/25" style="animation: ai-float 6s ease-in-out 2s infinite"></div>

    <!-- Header -->
    <CardHeader class="relative z-10 pb-0 pt-4 px-4">
      <CardTitle class="flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <div class="relative">
          <Sparkles class="w-4 h-4 text-emerald-500" :class="loading ? 'ai-sparkle' : ''" />
          <div v-if="loading" class="absolute inset-0 w-4 h-4 rounded-full bg-emerald-400/20 animate-ping"></div>
        </div>
        <span class="text-ai-gradient font-bold">{{ title || 'Respuesta IA' }}</span>
        <span class="ml-auto text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200/60">AI</span>
      </CardTitle>
    </CardHeader>

    <CardContent class="relative z-10 px-4 pb-4 pt-3">
      <!-- Loading state with shimmer -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="ai-shimmer-bar rounded-md" :class="i === 4 ? 'w-2/3' : 'w-full'" style="height: 14px;"></div>
      </div>

      <!-- Content with fade-in -->
      <Transition name="ai-fade">
        <div v-if="!loading" class="text-sm text-foreground leading-relaxed">
          <slot />
        </div>
      </Transition>
    </CardContent>
  </Card>
</template>

<style scoped>
.ai-response-card {
  background: transparent;
}

.ai-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ai-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
