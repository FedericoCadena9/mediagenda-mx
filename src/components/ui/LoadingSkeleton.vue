<script setup>
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

defineProps({
  lines: {
    type: Number,
    default: 3,
  },
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'card'].includes(v),
  },
})
</script>

<template>
  <!-- Text skeleton -->
  <div v-if="type === 'text'" class="space-y-3">
    <Skeleton
      v-for="i in lines"
      :key="i"
      class="h-4"
      :class="i === lines ? 'w-2/3' : 'w-full'"
    />
  </div>

  <!-- Card skeleton -->
  <Card v-else class="py-0">
    <CardContent class="p-4 space-y-3">
      <div class="flex items-center gap-3">
        <Skeleton class="w-10 h-10 rounded-lg flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-5 w-1/3" />
          <Skeleton class="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton
        v-for="i in lines"
        :key="i"
        class="h-4"
        :class="i === lines ? 'w-2/3' : 'w-full'"
      />
    </CardContent>
  </Card>
</template>
