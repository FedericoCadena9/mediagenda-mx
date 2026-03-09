<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const route = useRoute()

const navItems = [
  { icon: '\u{1F4CA}', label: 'Hoy', to: '/demo/dashboard', exact: true },
  { icon: '\u{1F4C5}', label: 'Calendario', to: '/demo/dashboard/calendario' },
  { icon: '\u{1F4CB}', label: 'Citas', to: '/demo/dashboard/citas' },
  { icon: '\u{1F465}', label: 'Pacientes', to: '/demo/dashboard/pacientes' },
  { icon: '\u{1F9E0}', label: 'Notas Cl\u00ednicas IA', to: '/demo/dashboard/notas', badge: 'IA' },
  { icon: '\u{1F4AC}', label: 'Mensajes IA', to: '/demo/dashboard/mensajes', badge: 'IA' },
  { icon: '\u{1F4C8}', label: 'Anal\u00edtica', to: '/demo/dashboard/analytics' },
]

function isActive(item) {
  if (item.exact) {
    return route.path === item.to
  }
  return route.path.startsWith(item.to)
}

const mobileOpen = computed({
  get: () => !props.collapsed,
  set: (val) => {
    if (!val) emit('close')
  },
})
</script>

<template>
  <!-- Mobile sidebar via Sheet -->
  <Sheet v-model:open="mobileOpen">
    <SheetContent side="left" class="w-60 bg-slate-800 text-white p-0 border-none md:hidden">
      <SheetTitle class="sr-only">Menu de navegaci&oacute;n</SheetTitle>
      <div class="flex items-center px-4 h-14">
        <span class="font-semibold text-sm tracking-wide">MediAgenda MX</span>
      </div>

      <Separator class="bg-slate-700" />

      <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          @click="emit('close')"
        >
          <Button
            variant="ghost"
            :class="[
              'w-full justify-start gap-3 mx-2 rounded-lg text-sm',
              isActive(item)
                ? 'bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white',
            ]"
          >
            <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
            <span class="whitespace-nowrap">{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              class="ml-auto bg-violet-600 text-white border-none text-[10px] px-1.5 py-0.5"
            >
              {{ item.badge }}
            </Badge>
          </Button>
        </router-link>
      </nav>

      <Separator class="bg-slate-700" />

      <div class="px-4 py-3">
        <p class="text-[11px] text-slate-500">Demo v1.0</p>
      </div>
    </SheetContent>
  </Sheet>

  <!-- Desktop sidebar -->
  <aside
    :class="[
      'hidden md:flex sticky top-0 left-0 z-50 h-screen bg-slate-800 text-white flex-col transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Desktop brand area -->
    <div class="flex items-center h-14 px-4 border-b border-slate-700">
      <span
        :class="[
          'font-semibold tracking-wide transition-opacity duration-200',
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 text-sm',
        ]"
      >
        MediAgenda MX
      </span>
      <span v-if="collapsed" class="text-lg font-bold mx-auto">M</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
      >
        <Button
          variant="ghost"
          :class="[
            'w-full justify-start gap-3 mx-2 rounded-lg text-sm',
            isActive(item)
              ? 'bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white',
            collapsed ? 'justify-center px-0' : '',
          ]"
        >
          <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
          <span
            :class="[
              'whitespace-nowrap transition-opacity duration-200',
              collapsed ? 'hidden' : '',
            ]"
          >
            {{ item.label }}
          </span>
          <Badge
            v-if="item.badge"
            :class="[
              'ml-auto bg-violet-600 text-white border-none text-[10px] px-1.5 py-0.5',
              collapsed ? 'hidden' : '',
            ]"
          >
            {{ item.badge }}
          </Badge>
        </Button>
      </router-link>
    </nav>

    <!-- Footer -->
    <Separator class="bg-slate-700" />
    <div class="px-4 py-3">
      <p
        :class="[
          'text-[11px] text-slate-500 transition-opacity duration-200',
          collapsed ? 'opacity-0' : '',
        ]"
      >
        Demo v1.0
      </p>
    </div>
  </aside>
</template>
